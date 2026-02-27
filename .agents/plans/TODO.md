# Plans TODO

## Active
- v1 draft is complete and visually polished. Ready for deployment or next phase work.

## Recently Applied
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
- GitHub Pages deployment setup/release.
