# Browser operation contract

Use this contract for every Moonlit social-publishing browser run. Platform references define field semantics; this file defines how browser state is owned, mutated, verified, and recovered.

## Stable task-space identity

- Reuse one stable Ego Lite task space per platform/account. Persist and resume the numeric task-space id for follow-ups on the same publishing chain.
- At the beginning of every browser round, explicitly select the recorded task space, list its tabs, and switch to the exact target tab. Never rely on the previously active tab.
- A platform popup, crop dialog, or file chooser is page state, not proof that the user took control. Treat only Ego's explicit ownership error as a control handoff.
- Keep the platform task space available for reuse when the user has requested a persistent publishing page. Close obsolete scratch tabs and abandoned wrong-format drafts so the next run has one unambiguous target.

## Ownership boundary

- If Ego reports that the user controls the task space, stop every browser action immediately. Do not retry, create another space, or take it back implicitly.
- Resume only after the user explicitly says `继续`, then take over the recorded task space and select the exact tab again.
- When the user confirms they published manually, do not click or resubmit. Record `published` only from that explicit confirmation, including its timestamp and source.

## Inspect → act → verify

For every meaningful mutation:

1. Inspect fresh DOM/text/page state.
2. Perform one scoped action.
3. Re-read the affected field or structure before advancing.

Use semantic locators and visible text first. Generated class names and absolute coordinates are fallback evidence. Rebuild snapshot refs after a re-render; never reuse a stale ref.

## Rich-text editors

- Treat rich editors as stateful applications. Do not mutate `innerHTML` or assume a hidden textarea represents the document.
- Use a small write/format probe before substantial editing. Prefer a verified combination of DOM range selection plus real keyboard or visible toolbar actions.
- Convert source structure into native structure: headings, editorial paragraphs, block quotes, and lists. Do not paste Markdown line breaks mechanically.
- After editing, verify both content and structure. Normalize whitespace for a source-fidelity hash, then separately count native headings, emphasis spans, quotes, lists, committed topic entities, and inline media.
- Visual inspection of the editor and platform preview is required for long-form content. A matching plain-text hash does not prove readable formatting.

## Uploads and duplicate prevention

- Upload only package-declared assets in order. When the site uses a native file chooser, wait for the chooser event, bind the intended file, complete crop/confirm steps, and verify the resulting preview before continuing.
- Do not infer upload completion from a thumbnail alone when progress or processing UI remains.
- Verify inline-media count and uniqueness after retries. Use dimensions, remote asset ids, or a compact visual hash when filenames are no longer visible.
- If the platform rejects a media type, use only a truthful supported counterpart or omit it and record the substitution. Never retry the same unsupported file blindly.

## Final gate and recovery

- Re-read the frozen package and confirm its fingerprint before the final control.
- Identify the exact enabled final publish control from fresh page state. Stop at `READY` without current-run authorization.
- Before any retry, inspect the platform management/profile view for the exact content identity. Existing matching content blocks resubmission.
- A changed title, body, asset set, or rich-text plan creates a new package fingerprint and requires a fresh `READY` verification.
- Persist verification evidence and platform state as `draft`, `ready`, `submitted`, or `published`; review/审核中 is always `submitted`.
