#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const scriptDir = path.dirname(new URL(import.meta.url).pathname);
const validator = path.join(scriptDir, 'validate-package.mjs');
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'moonlit-social-publisher-'));

try {
  const images = Array.from({length: 9}, (_, index) => {
    const file = path.join(tempDir, `${index + 1}.png`);
    fs.writeFileSync(file, 'fixture');
    return file;
  });
  const article = path.join(tempDir, 'article.md');
  fs.writeFileSync(article, '# 已确认公众号文章\n\n正文。');

  const valid = {
    schemaVersion: 1,
    workId: 'W-20260907-001',
    platforms: {
      xiaohongshu: {
        enabled: true,
        imageMode: 'single_cover',
        title: '半小时把一张图做成2D游戏',
        body: '一份完整、可核验的小红书图文正文。',
        topics: ['AI编程', '游戏开发', 'Blender', 'ThreeJS', '独立开发'],
        images: [images[0]],
        originalityPolicy: 'ask_each_run',
        contentTypeDeclaration: '笔记含AI合成内容',
        visibility: 'public'
      },
      douyinGraphic: {
        enabled: true,
        copyMode: 'wechat_same_story',
        contentSource: article,
        sourceSha256: '7023772a0c9d2c845deb78da43e89333e43f14f5a817a3adee9c6a55a1067a18',
        title: 'AI时代，孩子的上下文从出生开始',
        body: '与公众号文章保持同一标题、论证顺序、结论和证据。',
        topics: ['AI应用', '育儿记录'],
        images: [images[0], images[1]],
        originalityPolicy: 'all_content_original',
        contentTypeDeclaration: '含AI生成内容',
        visibility: 'public'
      },
      douyinArticle: {
        enabled: true,
        copyMode: 'wechat_article',
        contentSource: article,
        sourceSha256: '7023772a0c9d2c845deb78da43e89333e43f14f5a817a3adee9c6a55a1067a18',
        title: 'AI时代，孩子的上下文从出生开始',
        summary: '说一句话，把日常保存成成长上下文',
        body: '第一部分\n\n一篇与公众号同源的完整长文。\n\n关键判断。\n\n引用原文。',
        richText: {
          paragraphMode: 'editorial_2_to_5_sentences',
          sectionHeadings: ['第一部分'],
          emphasisSpans: ['关键判断。'],
          blockquoteSpans: ['引用原文。'],
          nativeBulletLists: true
        },
        inlineImages: [images[0], images[1]],
        headerImage: images[0],
        coverImage: images[1],
        topics: ['AI应用', '育儿记录'],
        originalityPolicy: 'all_content_original',
        contentTypeDeclaration: '含AI生成内容',
        visibility: 'public'
      },
      x: {
        enabled: true,
        mode: 'thread',
        posts: [
          {text: '主帖：结果钩子。', media: [images[0]]},
          {text: '连续自回复：一个步骤。', media: [images[1]]}
        ],
        visibility: 'public'
      }
    }
  };

  const validPath = path.join(tempDir, 'valid.json');
  fs.writeFileSync(validPath, JSON.stringify(valid));
  const missingReviewEnv = {...process.env};
  delete missingReviewEnv.MOONLIT_GUOSHEN_GATE;
  delete missingReviewEnv.MOONLIT_GUOSHEN_DIR;
  delete missingReviewEnv.MOONLIT_GUOSHEN_RECEIPT;
  const noReview = spawnSync(process.execPath, [validator, validPath, '--require-review'], {encoding:'utf8', env:missingReviewEnv});
  if (noReview.status === 0 || !noReview.stderr.includes('guoshen')) {
    throw new Error('missing guoshen review must block READY');
  }
  const legacyGate = path.join(tempDir, 'legacy-gate.py');
  fs.writeFileSync(legacyGate, 'import sys\nif "--require-chain-version" in sys.argv: sys.exit("legacy gate rejects unknown chain version")\nprint("old unversioned pass")\n');
  const oldGateRun = spawnSync(process.execPath, [validator, validPath, '--require-review'], {encoding:'utf8', env:{...missingReviewEnv,
    MOONLIT_GUOSHEN_GATE:legacyGate, MOONLIT_GUOSHEN_DIR:tempDir, MOONLIT_GUOSHEN_RECEIPT:validPath}});
  if (oldGateRun.status === 0 || !oldGateRun.stderr.includes('legacy gate rejects')) throw new Error('old gate must not bypass three reviews');
  const validRun = spawnSync(process.execPath, [validator, validPath], {encoding: 'utf8'});
  if (validRun.status !== 0 || !validRun.stdout.includes('"status": "VALIDATED"')) {
    throw new Error(`valid package failed: ${validRun.stderr || validRun.stdout}`);
  }

  const validCarouselPath = path.join(tempDir, 'valid-carousel.json');
  const validCarousel = structuredClone(valid);
  validCarousel.platforms.xiaohongshu.imageMode = 'carousel';
  validCarousel.platforms.xiaohongshu.images = images;
  fs.writeFileSync(validCarouselPath, JSON.stringify(validCarousel));
  const validCarouselRun = spawnSync(process.execPath, [validator, validCarouselPath], {encoding: 'utf8'});
  if (validCarouselRun.status !== 0 || !validCarouselRun.stdout.includes('"status": "VALIDATED"')) {
    throw new Error(`valid carousel package failed: ${validCarouselRun.stderr || validCarouselRun.stdout}`);
  }

  const invalidModePath = path.join(tempDir, 'invalid-mode.json');
  const invalidMode = structuredClone(valid);
  invalidMode.platforms.xiaohongshu.images = images.slice(0, 2);
  fs.writeFileSync(invalidModePath, JSON.stringify(invalidMode));
  const invalidModeRun = spawnSync(process.execPath, [validator, invalidModePath], {encoding: 'utf8'});
  if (invalidModeRun.status === 0 || !invalidModeRun.stderr.includes('single_cover mode requires exactly 1 image')) {
    throw new Error(`invalid single-cover package was not rejected: ${invalidModeRun.stderr || invalidModeRun.stdout}`);
  }

  const invalidDouyinGifPath = path.join(tempDir, 'invalid-douyin-gif.json');
  const invalidDouyinGif = structuredClone(valid);
  invalidDouyinGif.platforms.douyinGraphic.images = [path.join(tempDir, 'demo.gif')];
  fs.writeFileSync(invalidDouyinGif.platforms.douyinGraphic.images[0], 'fixture');
  fs.writeFileSync(invalidDouyinGifPath, JSON.stringify(invalidDouyinGif));
  const invalidDouyinGifRun = spawnSync(process.execPath, [validator, invalidDouyinGifPath], {encoding: 'utf8'});
  if (invalidDouyinGifRun.status === 0 || !invalidDouyinGifRun.stderr.includes('must be JPG, JPEG, PNG, or WebP')) {
    throw new Error(`invalid Douyin GIF package was not rejected: ${invalidDouyinGifRun.stderr || invalidDouyinGifRun.stdout}`);
  }

  const invalidArticleFormattingPath = path.join(tempDir, 'invalid-article-formatting.json');
  const invalidArticleFormatting = structuredClone(valid);
  delete invalidArticleFormatting.platforms.douyinArticle.richText;
  fs.writeFileSync(invalidArticleFormattingPath, JSON.stringify(invalidArticleFormatting));
  const invalidArticleFormattingRun = spawnSync(process.execPath, [validator, invalidArticleFormattingPath], {encoding: 'utf8'});
  if (invalidArticleFormattingRun.status === 0 || !invalidArticleFormattingRun.stderr.includes('douyinArticle.richText is required')) {
    throw new Error(`unformatted Douyin article package was not rejected: ${invalidArticleFormattingRun.stderr || invalidArticleFormattingRun.stdout}`);
  }

  const invalidArticleGifPath = path.join(tempDir, 'invalid-article-gif.json');
  const invalidArticleGif = structuredClone(valid);
  invalidArticleGif.platforms.douyinArticle.inlineImages = [path.join(tempDir, 'article.gif')];
  fs.writeFileSync(invalidArticleGif.platforms.douyinArticle.inlineImages[0], 'fixture');
  fs.writeFileSync(invalidArticleGifPath, JSON.stringify(invalidArticleGif));
  const invalidArticleGifRun = spawnSync(process.execPath, [validator, invalidArticleGifPath], {encoding: 'utf8'});
  if (invalidArticleGifRun.status === 0 || !invalidArticleGifRun.stderr.includes('must be JPG, JPEG, PNG, or WebP')) {
    throw new Error(`invalid Douyin article GIF package was not rejected: ${invalidArticleGifRun.stderr || invalidArticleGifRun.stdout}`);
  }

  const invalidPath = path.join(tempDir, 'invalid.json');
  fs.writeFileSync(invalidPath, JSON.stringify({...valid, publishAuthorized: true}));
  const invalidRun = spawnSync(process.execPath, [validator, invalidPath], {encoding: 'utf8'});
  if (invalidRun.status === 0 || !invalidRun.stderr.includes('publishAuthorized must never be persisted')) {
    throw new Error(`unsafe package was not rejected: ${invalidRun.stderr || invalidRun.stdout}`);
  }

  const articlePackage = {
    schemaVersion: 1, workId: valid.workId,
    distributionContract: {x: {format: 'article', coverKind: 'non_portrait'}},
    platforms: {x: {enabled: true, mode: 'article', title: '完整文章', body: '完整论证。',
      contentSource: article, sourceSha256: valid.platforms.douyinArticle.sourceSha256,
      coverImage: images[0], coverKind: 'non_portrait', inlineImages: [images[1]], visibility: 'public'}}
  };
  function checkFormat(pkg, expected, message) {
    const f = path.join(tempDir, 'format-case.json'); fs.writeFileSync(f, JSON.stringify(pkg));
    const result = spawnSync(process.execPath, [validator, f], {encoding: 'utf8'});
    if ((result.status === 0) !== expected || (!expected && !result.stderr.includes(message))) {
      throw new Error(`format routing regression: ${result.stderr || result.stdout}`);
    }
  }
  checkFormat(articlePackage, true);
  const wrongX = structuredClone(valid); wrongX.distributionContract = {xiaohongshu: {format: 'graphic'}, x: {format: 'article'}};
  checkFormat(wrongX, false, 'x.mode conflicts');
  const wrongXhs = structuredClone(valid); wrongXhs.distributionContract = {xiaohongshu: {format: 'video'}, x: {format: wrongXhs.platforms.x.mode}};
  checkFormat(wrongXhs, false, 'xiaohongshu graphic adapter conflicts');
  const portraitArticle = structuredClone(articlePackage); portraitArticle.platforms.x.coverKind = 'portrait';
  checkFormat(portraitArticle, false, 'coverKind must be non_portrait');
  const splitArticle = structuredClone(articlePackage); splitArticle.platforms.x.posts = valid.platforms.x.posts;
  checkFormat(splitArticle, false, 'must not contain posts');
  console.log('social publish package validation tests passed');
} finally {
  fs.rmSync(tempDir, {recursive: true, force: true});
}
