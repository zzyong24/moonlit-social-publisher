# Douyin long-form article

Use the native `发布文章` flow and record it as `channel: douyin`, `format: article`. The current creator entry is `https://creator.douyin.com/creator-micro/content/upload?default-tab=5`, followed by `我要发文`.

## Source fidelity

- `copyMode: wechat_article` uses the confirmed WeChat Markdown as the source of truth.
- Preserve the title, summary intent, full argument, section order, conclusion, CTA, and evidence images. Convert Markdown structure into the native rich editor instead of shortening it into the image-post description.
- Verify `sourceSha256` immediately before preparing and again before the final click.
- Current observed editor limits (2026-09-09): title 30 characters, summary 30 characters, body 20,000 characters, and up to 5 topics.

## Preparation

1. Fill the title and summary.
2. Populate the rich-text body. Remove YAML front matter and Markdown image syntax, then convert the source into native rich text:
   - Convert section headings to native level-2 headings. A heading must never remain a plain paragraph.
   - Reflow consecutive short source lines into editorial paragraphs of roughly 2–5 sentences. Do not reproduce every Markdown line break as a separate paragraph, and do not merge across headings, quotes, lists, or evidence images.
   - Use native block quotes and native bullet/numbered lists. Remove typed bullet glyphs after applying native list formatting.
   - Bold only 5–10 decisive claims or memorable conclusions. Avoid bolding whole sections or sprinkling emphasis on generic keywords.
   - Preserve the exact wording and argument order when reflowing; formatting changes may alter whitespace, not meaning.
3. Insert the ordered article images at their corresponding evidence points. If one source media type is rejected, use its truthful static counterpart and record the substitution.
4. Upload a landscape article header image and a platform-suitable cover image. Confirm both previews are populated.
5. Add 1–5 topics through the native topic picker. Set visibility and timing.
6. Set any originality or AI-content declaration truthfully when the live editor exposes it.

## Final gate and verification

- Re-read the title, summary, body character count, inline-media count/order, header image, cover, topics, visibility, and timing from fresh page state.
- Inspect both editor and preview. Confirm at least one native heading for a multi-section article, reasonable paragraph density, intentional emphasis, and no doubled bullet markers or accidental one-sentence paragraph cascade.
- Stop at the exact enabled final `发布` control and show 月明 the final preview and request explicit approval for this item.
- After 月明 approves this specific item and `check-approval.mjs` passes, click once. Verify in 内容管理 by matching the exact title and article identity. Record review as `submitted`; use `published` only after the platform reports public/已发布.
- Before retrying, inspect content management for the exact article identity to prevent duplicates.
