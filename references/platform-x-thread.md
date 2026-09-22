# X thread adapter

## Content shape

Use the native X thread composer for long-form distribution:

1. Post 1: result-led hook and the promise of the thread.
2. Posts 2–N-1: one claim, step, or piece of evidence per post.
3. Final post: conclusion, CTA, and at most 1–2 hashtags.

Default to 5–8 posts for a Xiaohongshu-length source. Keep each Chinese post at 130 visible characters or fewer so numbering, punctuation, and UI weighting have room. Avoid repeating the same hook, CTA, or hashtag block in every reply.

Distribute images across posts by meaning. X currently allows up to 4 media items in one post; attach the cover to post 1 and place evidence beside the post that explains it. Add image descriptions when available.

## Prepare

1. Open `https://x.com/compose/post` in a stable X task space and confirm account identity.
2. Fill post 1, use the native plus control to add each next post, and attach media to the correct post slot.
3. Re-read every post in order. Require the UI counter to accept every segment; local length validation is only a conservative precheck.
4. Confirm the native final action is `Post all` (or the current localized equivalent), not a single-post action.
5. Stop at `READY` unless final publication is explicitly authorized in the current run.

Prefer `Post all` over publishing the first post and then adding replies one by one. It gives one reviewable draft and one final action, reducing partial-thread failures. Use serial self-replies only when the native thread composer is unavailable and the user explicitly accepts the partial-publication risk.

## Publish and verify

After authorization, click the exact `Post all` control once. Verify the profile or thread detail page contains the exact first-post identity and the expected connected post count/order. Record the thread URL when available. If only part of the thread appears, stop and report the partial state; do not silently repost duplicates.

## Platform basis

X's official help defines a thread as connected posts from one person and documents the web flow: draft the first post, use the plus control for additional posts, then use `Post all`. Standard posts allow up to 280 characters and up to 4 media items; longer single posts depend on Premium. Keep thread mode as the portable default instead of depending on Premium long-post access.

Official references:

- `https://help.x.com/en/using-x/create-a-thread`
- `https://help.x.com/en/using-x/how-to-post`
- `https://help.x.com/en/using-x/posting-gifs-and-pictures`

Treat labels and selectors as live evidence, not permanent API contracts. Inspect the current page before acting.
