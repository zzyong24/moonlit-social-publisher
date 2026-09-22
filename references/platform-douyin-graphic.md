# Douyin graphic post

Use the Douyin creator center's native `发布图文` flow. Keep it separate from the Douyin video release and record it as `channel: douyin`, `format: graphic_post`.

## Preparation

1. Open or reuse the stable logged-in Douyin creator task space and navigate to `https://creator.douyin.com/creator-micro/content/upload?default-tab=3`.
2. Confirm the page is on `发布图文`, not `发布视频` or `发布文章`, and confirm the intended account.
3. Resolve `contentSource` and verify its current SHA-256 against the package fingerprint before editing.
4. Upload the ordered still images as one set. Current observed guidance (2026-09-09): JPG/JPEG/PNG/WebP, each file at most 50 MB, at most 35 images; GIF is unsupported; recommended ratios are 3:4 or 4:3 and ratios wider/taller than 1:2 are discouraged.
5. Keep image 1 as the cover. Verify the editor's uploaded count and order exactly match the package.

## Copy mapping

- `copyMode: wechat_same_story` means the Douyin post uses the confirmed WeChat article as its source of truth. Preserve the title, factual claims, section order, conclusion, and CTA.
- Convert Markdown headings, block quotes, lists, and emphasis into readable plain text. Remove image syntax and front matter; do not paste file paths or HTML.
- Platform-required shortening is allowed only when the live editor rejects the full text. Shorten by removing repeated exposition, never by changing facts or inventing a new angle. Record the actual posted text and the platform limit in the distribution receipt.
- Add package topics through Douyin's native topic UI. Pasted hashtag text alone is not proof that a topic entity was committed.

## Declarations and final gate

- Set visibility, originality, AI-content, and other declarations independently and truthfully when the live editor exposes them.
- Verify title, body, topics, image count/order, cover, visibility, and declarations from fresh page state.
- Stop at the exact enabled final `发布` control. A general request to add platform support is not final-click authorization; request one current-run confirmation after reporting the prepared values.
- After authorization, click the exact final control once. Verify success in 内容管理 by matching title and graphic-post identity. Record `submitted` while under review and `published` only when public/已发布 is confirmed.

## Recovery

Inspect 内容管理 before retrying. If the exact title and graphic-post identity already exist, do not submit a duplicate. Reuse the same Douyin task space for the same work. If the user takes control, stop and wait for an explicit `继续` before reclaiming it.
