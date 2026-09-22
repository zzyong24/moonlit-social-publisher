---
name: moonlit-social-publisher
description: Prepare, validate, and—after explicit current-run authorization—publish 月明水清深 Xiaohongshu graphic notes, Douyin image posts or long-form articles, and X threads with reusable logged-in browser task spaces. Use when the user asks for 自动分发、发布小红书图文、发布抖音图文或长文、同步到 X、连续自回复、thread、帖子串、长内容分段发布、发布恢复或结果核验。
---

# Moonlit Social Publisher

Publish one confirmed content package to Xiaohongshu graphic notes, Douyin image posts or long-form articles, and/or X threads. Keep content generation separate from live platform operations: receive Xiaohongshu copy, image mode, and ordered images from `moonlit-xiaohongshu`; receive Douyin source copy and ordered images from the confirmed canonical article or graphic package; receive X post segments from `moonlit-x-short`.

## Required inputs

Require a package matching [references/package-schema.md](references/package-schema.md). Resolve every image path and validate the package before opening a creator page:

```bash
node scripts/validate-package.mjs /absolute/path/to/social-publish-package.json
```

Never store cookies, credentials, browser profiles, login state, or final-publish authorization in the package or Skill repository.

## Two-phase workflow

1. Read the confirmed source copy and ordered assets from the canonical work directory.
2. Validate the package and freeze its fingerprint.
3. Read and follow [references/browser-operation-contract.md](references/browser-operation-contract.md). Reuse one stable Ego Lite task space per platform/account and inspect current page state before mutation.
4. Upload assets and fill every field. Re-read title, body/post order, media order, declarations, and visibility.
5. Stop at `READY` unless the user explicitly authorizes final publication in the current run.
6. After authorization, publish platforms serially. Verify each result before advancing to the next platform.
7. Write one distribution record per platform with `draft`, `ready`, `submitted`, or `published`. A review state is `submitted`, never `published`.

Current-run authorization may cover both selected platforms when the request names both. It does not persist to retries, future works, or newly added platforms.

## Platform routing

- For Xiaohongshu graphic notes, read [references/platform-xiaohongshu-graphic.md](references/platform-xiaohongshu-graphic.md).
- For Douyin graphic posts, read [references/platform-douyin-graphic.md](references/platform-douyin-graphic.md).
- For Douyin long-form articles, read [references/platform-douyin-article.md](references/platform-douyin-article.md).
- For X threads, read [references/platform-x-thread.md](references/platform-x-thread.md).
- If multiple platforms are selected, prepare all of them first, report a combined readiness summary, then request or consume one explicit final authorization.

Do not force identical copy across platforms unless the user explicitly requests a shared source. Share evidence and thesis, while keeping Xiaohongshu as a saveable graphic note and X as a connected argument across posts. Xiaohongshu defaults to one strong cover; use a carousel only when every additional image adds independent value.

Route Douyin by content shape: use `douyinGraphic` for a short image post whose description fits the 1000-character editor; use `douyinArticle` for an article, a WeChat long-form source, content over 1000 characters, or any request to keep the Douyin content the same as the WeChat article. Do not compress a long article into the image-post description when the native article editor is available.

## Final checks

- Package fingerprint still matches the prepared draft.
- Xiaohongshu cover is image 1. `single_cover` has exactly 1 image; `carousel` has 2–18 ordered images.
- Douyin graphic images are 1–35 supported still images in exact order. GIF files are never uploaded; use a truthful still counterpart or omit the unsupported asset.
- Douyin title/body are re-read from the live editor, topic entities are committed through the native control, and `contentSource` still resolves to the frozen canonical source.
- Douyin article title, summary, full body, inline media, header image, cover, topics, visibility, and source hash are verified independently from image-post fields.
- X uses the native thread composer; every post and attached media item is in the intended slot.
- Originality and AI-content declarations are truthful and independently set.
- The exact final control is identified from the current live page.
- Verification evidence includes title/first-post identity, platform time or URL when available, and review/public status.

## Recovery

Inspect before retrying. If a matching note or thread already exists in management/profile views, do not resubmit. Resume the same task space for the same work and platform. If the user takes control, stop immediately and wait for an explicit “继续” before taking it back.
