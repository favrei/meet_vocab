# Plans TODO

## Active
- Keep production (`deploy`) in sync with `main` after each validated fix.
- Current `main` HEAD: `0135d23` (rebrand app to Date-a-Lingo).

## Hosting
- Live at `https://favrei.github.io/date-a-lingo/`.
- Deployment mode: branch-based manual publish from `deploy` branch.
- GitHub Actions workflow exists at `.github/workflows/deploy.yml` but initial runs failed (token cannot create Pages site); manual branch publish is the active method.

## Shipped
- App rebranded to **Date-a-Lingo** (commit `0135d23`).
- Added example output to AI prompt template (commit `30215c9`).
- Code quality cleanup and smooth next-card transition (commit `787f8d6`).
- Swipe hint badges moved to side positions to avoid overlap (commit `7a08fb0`).
- Prefetched next card stabilized until exit animation completes (commit `4f9b57f`).
- Fixed preview card mismatch during swipe transition (commit `b21639c`).
- Prevented swipe hint overlay from covering card serial (commit `915d249`).
- Hardened mobile tap handling to prevent accidental card flips (commit `920b8a3`).
- Mobile deck layout responsiveness improvements (commit `600690a`).
- Import landing UX overhaul: hero with walkthrough video, CTA strip, sample-first path.
- Flat Material-like UI style, pill-shaped action buttons, simplified card-back layout.
- Swipe semantics locked: right = keep, left = memorized/drop.
- Hide-memorized default ON for new deck state.

## Decisions Locked
- JS package manager: `npm`.
- Swipe semantics: right = keep, left = memorized/drop.
- CSV import accepts reordered columns by header name.
- Import UI includes textarea paste + file picker upload.
- Fullscreen toggle is deferred.

## Next Phase (After Draft)
- Capture short release notes for the mobile swipe fixes and import polish batch.
