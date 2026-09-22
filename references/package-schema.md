# Social publish package

Use one immutable JSON package for one work. Omit a platform or set `enabled: false` when it is not selected.

```json
{
  "schemaVersion": 1,
  "workId": "W-YYYYMMDD-NNN",
  "platforms": {
    "xiaohongshu": {
      "enabled": true,
      "imageMode": "single_cover",
      "title": "20 字以内标题",
      "body": "完整正文",
      "topics": ["AI编程", "游戏开发"],
      "images": ["/absolute/or/package-relative/path.png"],
      "originalityPolicy": "ask_each_run",
      "contentTypeDeclaration": "笔记含AI合成内容",
      "visibility": "public"
    },
    "douyinGraphic": {
      "enabled": true,
      "copyMode": "wechat_same_story",
      "contentSource": "/absolute/path/to/confirmed-wechat-article.md",
      "sourceSha256": "64-character SHA-256 of contentSource",
      "title": "与公众号一致的标题",
      "body": "由公众号正文转换得到的纯文本",
      "topics": ["AI应用", "育儿记录"],
      "images": ["/absolute/or/package-relative/path.png"],
      "originalityPolicy": "all_content_original",
      "contentTypeDeclaration": "含AI生成内容",
      "visibility": "public"
    },
    "douyinArticle": {
      "enabled": true,
      "copyMode": "wechat_article",
      "contentSource": "/absolute/path/to/confirmed-wechat-article.md",
      "sourceSha256": "64-character SHA-256 of contentSource",
      "title": "30 字以内标题",
      "summary": "30 字以内摘要",
      "body": "由公众号正文转换得到的完整文章文本",
      "richText": {
        "paragraphMode": "editorial_2_to_5_sentences",
        "sectionHeadings": ["原生二级标题"],
        "emphasisSpans": ["需要加粗的关键判断"],
        "blockquoteSpans": ["需要使用原生引用样式的原文"],
        "nativeBulletLists": true
      },
      "inlineImages": ["/absolute/or/package-relative/path.png"],
      "headerImage": "/absolute/path/to/landscape-header.png",
      "coverImage": "/absolute/path/to/cover.png",
      "topics": ["AI应用", "育儿记录"],
      "originalityPolicy": "all_content_original",
      "contentTypeDeclaration": "含AI生成内容",
      "visibility": "public"
    },
    "x": {
      "enabled": true,
      "mode": "thread",
      "posts": [
        {"text": "主帖", "media": ["/path/cover.png"]},
        {"text": "连续自回复 1", "media": []}
      ],
      "visibility": "public"
    }
  }
}
```

Rules:

- Do not add a `publishAuthorized` field. Authorization exists only in the current conversation/run.
- For Moonlit Xiaohongshu graphic packages, default to `imageMode: single_cover` with exactly 1 image. Use `carousel` with 2–18 ordered images only when every additional image carries independent information. Require 5–8 topics in either mode.
- Set `originalityPolicy` to `all_content_original`, `not_original`, or `ask_each_run`; the first is a truthful standing policy, not publish authorization.
- Use `笔记含AI合成内容` when any published visual or substantive content is AI-generated or AI-composited.
- For Douyin graphic posts, require `copyMode: wechat_same_story`, a readable Markdown `contentSource`, its exact `sourceSha256`, non-empty `title` and `body`, 1–35 ordered JPG/JPEG/PNG/WebP still images, and 1–8 topics. GIF is unsupported. The live editor is authoritative for copy-length limits; if it rejects the full article, shorten only repeated exposition and record the actual submitted copy.
- Set Douyin `originalityPolicy` to `all_content_original`, `not_original`, or `ask_each_run`. Set `contentTypeDeclaration` truthfully when AI-generated or AI-composited assets are present.
- For Douyin long-form articles, require `copyMode: wechat_article`, a matching source hash, title ≤30 characters, summary ≤30 characters, body ≤20,000 characters, a `richText` formatting plan, 1–5 topics, ordered JPG/JPEG/PNG/WebP inline images, a header image, and a cover image. GIF is unsupported by the current native article editor. Use the article flow whenever a WeChat long-form source or body over 1000 characters is intended. The live draft must use native headings, editorial paragraphs, deliberate emphasis, quotes/lists where applicable, rather than mechanically preserving every source line break.
- For X, use `mode: thread`; one post is allowed only when the content skill explicitly selected short mode.
- Attach no more than 4 media items to one X post. Keep media paths attached to their intended post rather than in one global pool.
- Freeze the package after draft preparation. Any content or asset change creates a new fingerprint and requires revalidation.
