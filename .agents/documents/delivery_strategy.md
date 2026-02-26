# Delivery Strategy (Core)

## Objective
Ship a polished v1 of the validated POC, replacing hardcoded data with CSV import.

## Current Milestone
- This draft milestone targets local playability only.
- GitHub Pages deployment is explicitly deferred to the next phase.

## Architecture
- 100% client-side. 0 server, 0 API calls.
- All persistence via localStorage.
- Public repo on GitHub, deployed to GH Pages from same repo.
- No security/IP concerns — source is intentionally open.
- No router. State machine: `import` screen → `deck` screen. Return to import only via options sheet.
- Three layers (all client-side):
  1. **Import Layer** — CSV paste/upload, parse, validate, LLM prompt. Produces `VocabCard[]`.
  2. **Deck Engine** — Seeded shuffle, cursor, memorized set, localStorage persistence. Pure state logic.
  3. **Swipe UI** — Card display, gestures, options sheet, end-of-deck. Consumes deck state.
- Layers 1 and 2 must be plain TS/JS with no React dependency — testable as pure functions.
- Layer 3 depends on React but must work in headless test environments.
- Agents can run all tests headlessly via CLI. No manual browser interaction required for verification.
- Targets: smartphone (primary), tablet, desktop. Touch + mouse drag.

## Context
- POC already validated by friends — interaction model is confirmed.
- No new service will be built. This app *is* the product.

## Phases
1. Lock card protocol and import contract.
2. Scaffold project (Vite + React 19 + TypeScript + Tailwind v4 + Motion + Vitest).
3. Port POC swipe flow into proper components.
4. Build CSV import screen (paste + file upload) with validation.
5. Add copy-ready LLM prompt for CSV generation.
6. Add tests, QA, and GH Pages release.

## Done Means
- Core swipe loop works on smartphone, tablet, and desktop (matching POC behavior).
- CSV import works for paste and file upload.
- Invalid CSV shows clear row-level errors.
- LLM prompt is accessible in the app.
- No backend required.
- GH Pages deployment is live.
- All tests pass headlessly via CLI (`npm test` or equivalent).
