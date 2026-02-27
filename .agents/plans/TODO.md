# Plans TODO

## Active
- Ongoing UX polish and bugfixes on deck interactions (mobile-first behavior).
- Keep production (`deploy`) in sync with `main` after each validated fix.

## Hosting Progress (2026-02-27)
- Added deploy workflow: `.github/workflows/deploy.yml`.
- Set Vite production base path to `/meet_vocab/` in `vite.config.ts`.
- Added hosting notes to `README.md`.
- Verified locally: `npm test` (15 pass), `npm run build` success.
- First Actions run failed because Pages site was not enabled yet; patched workflow with `enablement: true`.
- Second Actions run also failed because workflow token lacks permission to create initial Pages site.
- Created and pushed manual publish branch `deploy` with static build output.
- Manual branch deployment is live at `https://favrei.github.io/meet_vocab/`.
- Current production branch head: `deploy` @ `81d24b7` (from `main` @ `4f9b57f`).

## Recently Applied
- Added "Use Example CSV" button on import screen to auto-fill a valid sample deck and reduce first-use confusion.
- Rebalanced card back layout: content (meaning, pronunciation, example, tags) grouped as a single vertically-centered cluster instead of spread with `justify-between`.
- Toned down secondary text (hiragana, translation) to lighter weight/color for clearer hierarchy.
- Replaced small circular action buttons with equal-width pill-shaped buttons labeled "Memorized" / "Keep".
- Buttons now span the full card width (left-aligned and right-aligned to card edges).
- Corrected swipe semantics to match POC: right = keep, left = memorized/drop.
- Fixed deck end behavior with hide-memorized semantics and restored toggle in Options.
- Set hide-memorized default to ON for new deck state.
- Refined UI to flat Material-like style and simplified card-back metadata layout.
- Fixed import action button size imbalance (`Import deck` / `Upload file` / `Load sample rows`).
- Improved mobile deck layout responsiveness (card height, spacing, type scale).
- Hardened touch behavior to reduce accidental card flips during swipe gestures.
- Fixed swipe hint overlay overlap with card serial label.
- Fixed preview-card consistency so the prefetched next card does not jump to next-next during swipe.
- Locked swipe transition state until exit completion for stable prefetch rendering.

## Decisions Locked
- JS package manager: `npm`.
- Swipe semantics: right = keep, left = memorized/drop.
- CSV import accepts reordered columns by header name.
- Import UI includes textarea paste + file picker upload.
- Fullscreen toggle is deferred.

## Next Phase (After Draft)
- Capture short release notes for the mobile swipe fixes and import polish batch.
