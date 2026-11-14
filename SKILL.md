---
name: moonlit-social-publisher
description: "X文章及明确指定图文/短帖/线程的发布器：把已确认的小红书图文笔记、抖音图文或长文、X Articles文章保存到原生草稿箱并回读；明确指定的图文/短帖/线程准备到 READY，给月明看这一条的最终预览，月明对这一条明确批准后才发（逐条批准，旧批准不复用），发完回报链接。用户说“把这篇发到小红书/X”“把小红书笔记直接发出去”“发抖音图文/长文”“同步成 X 线程”“发布恢复或结果核验”时使用。Not for writing copy (moonlit-xiaohongshu / moonlit-x-short), making images (Codex 生图), video uploads (moonlit-video-publisher) or WeChat articles."
---

# Moonlit Social Publisher

**三审必读（文案确认即触发）**：文案确认后按当前激活 `moonlit-content-engine/references/publish-review.md` 实际执行guoshen的script文本审核，不强审初稿、不等成片；音画/封面/平台设置明确未审。上传前content审完整实际包并验证script；草稿上传后final审原生设置和封面实际呈现并验证前两阶段。文案改变使相关旧证据失效；每阶段不能替代后续审核、用户授权或平台裁决。旧v1回执须实际补审，不静默升级；调用门禁必须带 `--require-chain-version 2`。


Publish one confirmed content package to Xiaohongshu graphic notes, Douyin image posts or long-form articles, and/or X Articles and explicitly requested short posts or threads. Keep content generation separate from live platform operations: receive Xiaohongshu copy, image mode, and ordered images from `moonlit-xiaohongshu`; receive Douyin source copy and ordered images from the confirmed canonical article or graphic package; receive X article prose or explicitly selected post segments from `moonlit-x-short`.

**发布键在月明**：X Articles先遵守下述默认草稿终点。其他明确指定的图文/短帖/线程，及用户之后明确改变文章边界而开启的发布分支，可以自动发布，但**每一条**都要先给月明看最终预览，月明对这一条明确批准后才点最终按钮；以前的批准、其他作品或其他平台的批准都不能复用；发布后把链接报给月明。本文里所有“current-run authorization / 本次授权”都按这条理解：一份批准只对一个作品 × 一个平台 × 一个内容指纹有效。完整流程与批准记录格式见 [逐条发布批准](references/per-item-approval.md)，点最终按钮前必须跑 `node scripts/check-approval.mjs`。

**登录态**：只在月明本人 Mac 上已登录的浏览器任务空间里操作；不读取、不导出、不保存 Cookie、Token 或浏览器资料。

## 发布前必需审核

内容进入发布准备，先按名称解析当前激活 `moonlit-content-engine`，读取其 `references/publish-review.md`，并实际运行依赖 `guoshen`。通读正文或独立语音/字幕及全画面，审核目标平台的当前规则、封面、渠道文案和发布设置；完成报告与版本绑定回执，通过共享门禁才上传、进入READY或最终提交。修复、换平台、文案/媒体/设置变化后重审；审核缺失、未完成或不通过不能继续外发。手工浏览器路径、续发、恢复和直接CLI也遵守同一门禁；本地排版/只读检查可先执行。上游不支持的公众号、X等按合同补充对应平台审核，不能套用视频号结论。

执行发布命令前，按激活目录设置 `MOONLIT_GUOSHEN_GATE`、`MOONLIT_GUOSHEN_DIR`、`MOONLIT_GUOSHEN_RECEIPT`。共享门禁只验证回执，不能替代实际语义审核；通过也不代替月明对这一条的批准。

## Required inputs

First resolve platform × native format × cover type from the current request and moonlit-content-engine contract. Require a package matching [references/package-schema.md](references/package-schema.md). Resolve every image path and validate the package before opening a creator page:

```bash
node scripts/validate-package.mjs /absolute/path/to/social-publish-package.json
# After actual guoshen review, before any upload or final publication:
node scripts/validate-package.mjs /absolute/path/to/social-publish-package.json --require-review
```

Never store cookies, credentials, browser profiles, login state, or final-publish authorization in the package or Skill repository.

**X Articles默认终点**：保存原生文章草稿并回读，记录`draft`，由月明最终发表；不点Publish，不要求为完成草稿再批准发表。“全平台分发”或泛称“重新发”不改变此边界。只有用户之后明确针对文章改变边界，才进入下述逐条最终发布分支。该边界不把明确指定的图文、短帖或线程改成草稿任务。

## Two-phase workflow

1. Read the confirmed source copy and ordered assets from the canonical work directory.
2. Validate the package and freeze its fingerprint. Execute guoshen under the required review contract, then call the shared gate with the package JSON, canonical source copy and every actual image/media input before any upload. Re-run the gate before final publication; do not call local package validation a risk-review READY result.
3. Read and follow [references/browser-operation-contract.md](references/browser-operation-contract.md). Reuse one stable Ego Lite task space per platform/account and inspect current page state before mutation.
4. Upload assets and fill every field. Re-read title, body/post order, media order, declarations, and visibility.
5. For X Articles, save and re-read the native draft, record `draft`, and finish here by default. Only an explicit later change to the article boundary permits the publication branch. For explicitly selected graphic posts, short posts or threads, stop at `READY`. Show 月明 the final preview of this item (per platform) and wait for explicit approval of this specific item; write `approval.json` and pass `node scripts/check-approval.mjs` before the final click.
6. Only within the final-publication branch and after approval, publish platforms serially, one approved item at a time. Verify each result, run `check-approval.mjs --consume --link <url>`, and report the link to 月明 before advancing.
7. Write one distribution record per platform with `draft`, `ready`, `submitted`, or `published`. A review state is `submitted`, never `published`.

Approval is per item: one work × one platform × one content fingerprint. Approving one platform never covers another; it does not persist to retries, edits, future works, or newly added platforms.

## Platform routing

- For Xiaohongshu graphic notes, read [references/platform-xiaohongshu-graphic.md](references/platform-xiaohongshu-graphic.md).
- For Douyin graphic posts, read [references/platform-douyin-graphic.md](references/platform-douyin-graphic.md).
- For Douyin long-form articles, read [references/platform-douyin-article.md](references/platform-douyin-article.md).
- For X, default to Articles and read [references/platform-x-article.md](references/platform-x-article.md). Use [references/platform-x-thread.md](references/platform-x-thread.md) only for an explicitly selected thread.
- Xiaohongshu defaults to video via moonlit-video-publisher. Graphic notes require an explicit current selection; Articles access failure never authorizes a fallback thread.
- If multiple platforms are selected, save and re-read X Articles drafts first; prepare explicitly selected publishable formats to READY. Request per-item approval only for their final-publication branch, not for completing an article draft.

Do not force identical copy across platforms unless the user explicitly requests a shared source. Share evidence and thesis, while keeping the selected native format. Only explicitly selected Xiaohongshu graphic notes default to one strong cover; use a carousel only when every additional image adds independent value.

Route Douyin by content shape: use `douyinGraphic` for a short image post whose description fits the 1000-character editor; use `douyinArticle` for an article, a WeChat long-form source, content over 1000 characters, or any request to keep the Douyin content the same as the WeChat article. Do not compress a long article into the image-post description when the native article editor is available.

## Final checks

- Package fingerprint still matches the prepared draft.
- Before upload and final submit, compare native editor format and cover type with the current distribution contract. A content-safety review does not validate publication format.
- Xiaohongshu cover is image 1. `single_cover` has exactly 1 image; `carousel` has 2–18 ordered images.
- Douyin graphic images are 1–35 supported still images in exact order. GIF files are never uploaded; use a truthful still counterpart or omit the unsupported asset.
- Douyin title/body are re-read from the live editor, topic entities are committed through the native control, and `contentSource` still resolves to the frozen canonical source.
- Douyin article title, summary, full body, inline media, header image, cover, topics, visibility, and source hash are verified independently from image-post fields.
- X article mode uses native Articles, complete prose, intended inline images and a non-portrait header; thread mode requires explicit selection and the native thread composer.
- Originality and AI-content declarations are truthful and independently set.
- X Articles defaults to a verified native draft; the final-control and consumed-approval checks below apply only when the current request explicitly opens the publication branch.
- The exact final control is identified from the current live page when that branch applies.
- Verification evidence includes title/first-post identity, platform time or URL when available, and review/public status.
- `approval.json` matches this item, platform and fingerprint, was consumed after success, and the published link was reported to 月明.

## Recovery

Inspect before retrying. If a matching note or thread already exists in management/profile views, do not resubmit. Resume the same task space for the same work and platform. If the user takes control, stop immediately and wait for an explicit “继续” before taking it back.
