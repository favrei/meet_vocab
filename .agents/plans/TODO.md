# Plans TODO

## Active
- Hosting phase is active: GitHub Pages deployment for `favrei/meet_vocab`.

## Hosting Progress (2026-02-27)
- Added deploy workflow: `.github/workflows/deploy.yml`.
- Set Vite production base path to `/meet_vocab/` in `vite.config.ts`.
- Added hosting notes to `README.md`.
- Verified locally: `npm test` (15 pass), `npm run build` success.
- First Actions run failed because Pages site was not enabled yet; patched workflow with `enablement: true`.
- Second Actions run also failed because workflow token lacks permission to create initial Pages site.
- Created and pushed manual publish branch `deploy` with static build output.
- Remaining: set Pages source to `deploy` branch root and verify live URL.

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

## Decisions Locked
- JS package manager: `npm`.
- Swipe semantics: right = keep, left = memorized/drop.
- CSV import accepts reordered columns by header name.
- Import UI includes textarea paste + file picker upload.
- Fullscreen toggle is deferred.

## Next Phase (After Draft)
- Validate live deployment and capture release notes.
