#!/usr/bin/env node

import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const packagePath = process.argv[2];
if (!packagePath) {
  console.error('Usage: node scripts/validate-package.mjs /absolute/path/to/social-publish-package.json');
  process.exit(2);
}

const absolutePackagePath = path.resolve(packagePath);
const packageDir = path.dirname(absolutePackagePath);
const raw = fs.readFileSync(absolutePackagePath, 'utf8');
const data = JSON.parse(raw);
const errors = [];
const reviewFiles = [absolutePackagePath];

const chars = (value) => Array.from(value ?? '').length;
const hasCjk = (value) => /[\u3400-\u9fff\uf900-\ufaff]/u.test(value ?? '');
const resolveAsset = (value) => path.isAbsolute(value) ? value : path.resolve(packageDir, value);
const requireAsset = (value, label) => {
  if (typeof value === 'string' && value.trim()) reviewFiles.push(resolveAsset(value));
  if (typeof value !== 'string' || !value.trim()) {
    errors.push(`${label}: missing path`);
    return;
  }
  if (!fs.existsSync(resolveAsset(value))) errors.push(`${label}: file not found: ${value}`);
};

if (data.schemaVersion !== 1) errors.push('schemaVersion must be 1');
if (!/^W-\d{8}-\d{3}$/.test(data.workId ?? '')) errors.push('workId must match W-YYYYMMDD-NNN');
if (!data.platforms || typeof data.platforms !== 'object') errors.push('platforms is required');

const xhs = data.platforms?.xiaohongshu;
if (xhs?.enabled) {
  if (!xhs.title?.trim()) errors.push('xiaohongshu.title is required');
  if (chars(xhs.title) > 20) errors.push('xiaohongshu.title must be <= 20 visible characters');
  if (!xhs.body?.trim()) errors.push('xiaohongshu.body is required');
  if (chars(xhs.body) > 1000) errors.push('xiaohongshu.body must be <= 1000 visible characters');
  if (!Array.isArray(xhs.topics) || xhs.topics.length < 5 || xhs.topics.length > 8) {
    errors.push('xiaohongshu.topics must contain 5-8 topics');
  }
  const imageMode = xhs.imageMode ?? (xhs.images?.length === 1 ? 'single_cover' : 'carousel');
  if (!['single_cover', 'carousel'].includes(imageMode)) {
    errors.push('xiaohongshu.imageMode must be single_cover or carousel');
  }
  if (!Array.isArray(xhs.images) || xhs.images.length < 1 || xhs.images.length > 18) {
    errors.push('xiaohongshu.images must contain 1-18 ordered images');
  } else if (imageMode === 'single_cover' && xhs.images.length !== 1) {
    errors.push('xiaohongshu single_cover mode requires exactly 1 image');
  } else if (imageMode === 'carousel' && xhs.images.length < 2) {
    errors.push('xiaohongshu carousel mode requires 2-18 images');
  } else {
    xhs.images.forEach((asset, index) => requireAsset(asset, `xiaohongshu.images[${index}]`));
  }
  if (!['all_content_original', 'not_original', 'ask_each_run'].includes(xhs.originalityPolicy)) {
    errors.push('xiaohongshu.originalityPolicy is invalid');
  }
  if (!['public', 'private'].includes(xhs.visibility)) errors.push('xiaohongshu.visibility is invalid');
}

const douyinGraphic = data.platforms?.douyinGraphic;
if (douyinGraphic?.enabled) {
  if (douyinGraphic.copyMode !== 'wechat_same_story') {
    errors.push('douyinGraphic.copyMode must be wechat_same_story');
  }
  requireAsset(douyinGraphic.contentSource, 'douyinGraphic.contentSource');
  if (typeof douyinGraphic.contentSource === 'string' && path.extname(douyinGraphic.contentSource).toLowerCase() !== '.md') {
    errors.push('douyinGraphic.contentSource must be a Markdown file');
  }
  if (!/^[a-f0-9]{64}$/.test(douyinGraphic.sourceSha256 ?? '')) {
    errors.push('douyinGraphic.sourceSha256 must be a lowercase SHA-256');
  } else if (typeof douyinGraphic.contentSource === 'string' && fs.existsSync(resolveAsset(douyinGraphic.contentSource))) {
    const actualSourceSha256 = crypto.createHash('sha256').update(fs.readFileSync(resolveAsset(douyinGraphic.contentSource))).digest('hex');
    if (actualSourceSha256 !== douyinGraphic.sourceSha256) errors.push('douyinGraphic.contentSource SHA-256 does not match sourceSha256');
  }
  if (!douyinGraphic.title?.trim()) errors.push('douyinGraphic.title is required');
  if (!douyinGraphic.body?.trim()) errors.push('douyinGraphic.body is required');
  if (!Array.isArray(douyinGraphic.topics) || douyinGraphic.topics.length < 1 || douyinGraphic.topics.length > 8) {
    errors.push('douyinGraphic.topics must contain 1-8 topics');
  }
  if (!Array.isArray(douyinGraphic.images) || douyinGraphic.images.length < 1 || douyinGraphic.images.length > 35) {
    errors.push('douyinGraphic.images must contain 1-35 ordered still images');
  } else {
    const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);
    douyinGraphic.images.forEach((asset, index) => {
      requireAsset(asset, `douyinGraphic.images[${index}]`);
      if (typeof asset === 'string' && !allowedExtensions.has(path.extname(asset).toLowerCase())) {
        errors.push(`douyinGraphic.images[${index}] must be JPG, JPEG, PNG, or WebP`);
      }
    });
  }
  if (!['all_content_original', 'not_original', 'ask_each_run'].includes(douyinGraphic.originalityPolicy)) {
    errors.push('douyinGraphic.originalityPolicy is invalid');
  }
  if (!['public', 'private'].includes(douyinGraphic.visibility)) errors.push('douyinGraphic.visibility is invalid');
}

const douyinArticle = data.platforms?.douyinArticle;
if (douyinArticle?.enabled) {
  if (douyinArticle.copyMode !== 'wechat_article') errors.push('douyinArticle.copyMode must be wechat_article');
  requireAsset(douyinArticle.contentSource, 'douyinArticle.contentSource');
  if (typeof douyinArticle.contentSource === 'string' && path.extname(douyinArticle.contentSource).toLowerCase() !== '.md') {
    errors.push('douyinArticle.contentSource must be a Markdown file');
  }
  if (!/^[a-f0-9]{64}$/.test(douyinArticle.sourceSha256 ?? '')) {
    errors.push('douyinArticle.sourceSha256 must be a lowercase SHA-256');
  } else if (typeof douyinArticle.contentSource === 'string' && fs.existsSync(resolveAsset(douyinArticle.contentSource))) {
    const actualSourceSha256 = crypto.createHash('sha256').update(fs.readFileSync(resolveAsset(douyinArticle.contentSource))).digest('hex');
    if (actualSourceSha256 !== douyinArticle.sourceSha256) errors.push('douyinArticle.contentSource SHA-256 does not match sourceSha256');
  }
  if (!douyinArticle.title?.trim()) errors.push('douyinArticle.title is required');
  if (chars(douyinArticle.title) > 30) errors.push('douyinArticle.title must be <= 30 visible characters');
  if (!douyinArticle.summary?.trim()) errors.push('douyinArticle.summary is required');
  if (chars(douyinArticle.summary) > 30) errors.push('douyinArticle.summary must be <= 30 visible characters');
  if (!douyinArticle.body?.trim()) errors.push('douyinArticle.body is required');
  if (chars(douyinArticle.body) > 20000) errors.push('douyinArticle.body must be <= 20000 visible characters');
  if (!douyinArticle.richText || typeof douyinArticle.richText !== 'object') {
    errors.push('douyinArticle.richText is required');
  } else {
    if (douyinArticle.richText.paragraphMode !== 'editorial_2_to_5_sentences') {
      errors.push('douyinArticle.richText.paragraphMode must be editorial_2_to_5_sentences');
    }
    for (const field of ['sectionHeadings', 'emphasisSpans', 'blockquoteSpans']) {
      const spans = douyinArticle.richText[field];
      if (!Array.isArray(spans)) {
        errors.push(`douyinArticle.richText.${field} must be an array`);
      } else {
        spans.forEach((span, index) => {
          if (!span?.trim()) errors.push(`douyinArticle.richText.${field}[${index}] must be non-empty`);
          else if (!douyinArticle.body?.includes(span)) errors.push(`douyinArticle.richText.${field}[${index}] must exist in douyinArticle.body`);
        });
      }
    }
    if (!Array.isArray(douyinArticle.richText.sectionHeadings) || douyinArticle.richText.sectionHeadings.length < 1) {
      errors.push('douyinArticle.richText.sectionHeadings must contain at least one heading');
    }
    if (!Array.isArray(douyinArticle.richText.emphasisSpans) || douyinArticle.richText.emphasisSpans.length < 1 || douyinArticle.richText.emphasisSpans.length > 10) {
      errors.push('douyinArticle.richText.emphasisSpans must contain 1-10 spans');
    }
    if (typeof douyinArticle.richText.nativeBulletLists !== 'boolean') {
      errors.push('douyinArticle.richText.nativeBulletLists must be boolean');
    }
  }
  if (!Array.isArray(douyinArticle.topics) || douyinArticle.topics.length < 1 || douyinArticle.topics.length > 5) {
    errors.push('douyinArticle.topics must contain 1-5 topics');
  }
  if (!Array.isArray(douyinArticle.inlineImages)) {
    errors.push('douyinArticle.inlineImages must be an array');
  } else {
    const inlineExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);
    douyinArticle.inlineImages.forEach((asset, index) => {
      requireAsset(asset, `douyinArticle.inlineImages[${index}]`);
      if (typeof asset === 'string' && !inlineExtensions.has(path.extname(asset).toLowerCase())) {
        errors.push(`douyinArticle.inlineImages[${index}] must be JPG, JPEG, PNG, or WebP`);
      }
    });
  }
  requireAsset(douyinArticle.headerImage, 'douyinArticle.headerImage');
  requireAsset(douyinArticle.coverImage, 'douyinArticle.coverImage');
  const staticExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);
  if (typeof douyinArticle.headerImage === 'string' && !staticExtensions.has(path.extname(douyinArticle.headerImage).toLowerCase())) {
    errors.push('douyinArticle.headerImage must be JPG, JPEG, PNG, or WebP');
  }
  if (typeof douyinArticle.coverImage === 'string' && !staticExtensions.has(path.extname(douyinArticle.coverImage).toLowerCase())) {
    errors.push('douyinArticle.coverImage must be JPG, JPEG, PNG, or WebP');
  }
  if (!['all_content_original', 'not_original', 'ask_each_run'].includes(douyinArticle.originalityPolicy)) {
    errors.push('douyinArticle.originalityPolicy is invalid');
  }
  if (!['public', 'private'].includes(douyinArticle.visibility)) errors.push('douyinArticle.visibility is invalid');
}

const x = data.platforms?.x;
if (x?.enabled) {
  if (!['thread', 'short'].includes(x.mode)) errors.push('x.mode must be thread or short');
  if (!Array.isArray(x.posts) || x.posts.length < 1) {
    errors.push('x.posts must contain at least one post');
  } else {
    if (x.mode === 'thread' && x.posts.length < 2) errors.push('x thread mode requires at least 2 posts');
    if (x.mode === 'short' && x.posts.length !== 1) errors.push('x short mode requires exactly 1 post');
    x.posts.forEach((post, index) => {
      if (!post?.text?.trim()) errors.push(`x.posts[${index}].text is required`);
      const limit = hasCjk(post?.text) ? 130 : 280;
      if (chars(post?.text) > limit) errors.push(`x.posts[${index}].text exceeds the ${limit}-character precheck`);
      if (!Array.isArray(post?.media)) errors.push(`x.posts[${index}].media must be an array`);
      else if (post.media.length > 4) errors.push(`x.posts[${index}].media may contain at most 4 items`);
      else post.media.forEach((asset, mediaIndex) => requireAsset(asset, `x.posts[${index}].media[${mediaIndex}]`));
    });
  }
  if (x.visibility !== 'public') errors.push('x.visibility must be public');
}

if (!xhs?.enabled && !douyinGraphic?.enabled && !douyinArticle?.enabled && !x?.enabled) errors.push('at least one platform must be enabled');
if (Object.hasOwn(data, 'publishAuthorized')) errors.push('publishAuthorized must never be persisted in the package');

if (errors.length) {
  console.error(JSON.stringify({status: 'INVALID', errors}, null, 2));
  process.exit(1);
}

const fingerprint = crypto.createHash('sha256').update(raw).digest('hex');
const requireReview = process.argv.includes('--require-review');
if (requireReview) {
  const gate = process.env.MOONLIT_GUOSHEN_GATE;
  const receipt = process.env.MOONLIT_GUOSHEN_RECEIPT;
  const guoshenDir = process.env.MOONLIT_GUOSHEN_DIR;
  if (!gate || !receipt || !guoshenDir) {
    console.error('guoshen gate/receipt/dir required before READY or upload');
    process.exit(2);
  }
  const platforms = [...new Set([
    ...(xhs?.enabled ? ['xiaohongshu'] : []),
    ...(douyinGraphic?.enabled || douyinArticle?.enabled ? ['douyin'] : []),
    ...(x?.enabled ? ['x'] : []),
  ])];
  const checked = spawnSync(process.env.MOONLIT_PYTHON || 'python3', [gate,
    '--receipt', receipt, '--guoshen-dir', guoshenDir,
    ...platforms.flatMap(platform => ['--platform', platform]),
    ...[...new Set(reviewFiles)].flatMap(file => ['--file', file]),
  ], {encoding: 'utf8'});
  if (checked.status !== 0) {
    console.error(checked.stderr || checked.stdout || String(checked.error || 'guoshen preflight failed'));
    process.exit(2);
  }
}
console.log(JSON.stringify({status: requireReview ? 'READY' : 'VALIDATED', riskReview: requireReview ? 'passed' : 'not_checked', workId: data.workId, fingerprint}, null, 2));
