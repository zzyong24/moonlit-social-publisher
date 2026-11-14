# Xiaohongshu graphic-note adapter

## Prepare

1. Open `https://creator.xiaohongshu.com/publish/publish?source=official&from=menu&target=image` in the stable Xiaohongshu task space.
2. Confirm the logged-in account identity.
3. Inspect the active image input. Upload the package's ordered image set; image 1 must remain the cover. `single_cover` uploads exactly 1 image; `carousel` uploads 2–18.
4. Verify the editor's uploaded count and preview total exactly match the package before filling metadata.
5. Fill the exact title and body. Clear the rich editor fully before rebuilding it; suggestion overlays can redirect later keystrokes into the wrong location.
6. Add 5–8 topics through the platform's native topic control and exact suggestion rows. Do not treat pasted `#topic` text as proof of a committed topic entity.
7. Set visibility. Set the AI-content declaration independently from originality.

Current observed upload guidance (2026-09-07): PNG/JPG/JPEG/WebP, up to 32 MB each; the page accepts up to 18 images and recommends ratios from 3:4 to 2:1. These are live observations, not permanent contracts.

## Declarations

- Enable `原创声明` only when the package policy permits it or the user confirms rights in the current run.
- Select `笔记含AI合成内容` when required by the package. This does not imply the work is non-original.
- Never infer either declaration from a filename.

## Ready evidence

Require all of the following:

- uploaded image count equals the package, order is exact, and image 1 is the cover;
- exact title and body after a fresh read;
- exact committed topics or a recorded platform limitation;
- intended declarations and visibility;
- visible enabled final `发布` control;
- final publication not clicked without 月明's per-item approval (see per-item-approval.md).

## Publish and verify

After 月明 approves this specific item and `check-approval.mjs` passes, click the exact enabled `发布` control once. Accept success only when the page reports `发布成功`. Then open 笔记管理 and match the exact title plus image-note identity. Record `submitted` while the list says `审核中`; promote to `published` only after public visibility is confirmed.

This flow was live-tested on 2026-09-07 with a 9-image carousel. Single-cover mode uses the same image-note editor but must still be verified in the current run.
