# Requirements (Core)

## Product Principle
- Build a polished version of the existing POC (see `resources/poc.md`).
- Same Tinder-style swipe interface, but replace hardcoded data with user-provided CSV.
- Friends already validated the POC — scope is the POC interaction model + CSV import. No new service.
- Prioritize simple, mobile-first interaction.

## Non-Negotiables
- 0 server. Everything runs client-side.
- No auth/user system.
- Browser-only runtime. All state lives in localStorage.
- No concern about source theft — code is public, that's fine.
- Deploy on GitHub Pages. Source code lives in the same repo.

## Data Principle
- User brings vocab data via CSV (paste or file upload).
- CSV must follow the agreed contract (see `csv_contract_and_prompt.md`).
- Encourage users to generate CSV with LLMs — provide a copy-ready prompt in the app.

## Platform Support
- Smartphone (primary), tablet, and desktop PC.
- Touch swipe on phone/tablet, mouse drag on desktop.
- Responsive layout — must work well at all three sizes, but phone comes first.

## UX Principle
- Main flow: import CSV -> swipe -> review -> restart.
- Keep UI minimal and focused.
- Clear validation errors for invalid CSV (row-level).
- Card front shows standard form (jp) by default, toggleable to English (en) in options.
- Card back always shows: meaning, pronunciation (hira), example + translation.
- One deck at a time. New import replaces old deck and resets memorized state (with warning).
- No router. App is a state machine: `import` → `deck`.
- App launch: if localStorage has a saved deck, go straight to deck screen. Otherwise show import screen.
- Return to import only via options sheet ("Import new deck" at bottom, intentionally hard to reach).
- Replacing a deck shows an inline confirmation ("This will replace your current deck and reset progress. Continue?"). No browser `confirm()` — use a small in-app modal for polish.
- No browser back-button navigation between screens.

## Quality Principle
- Local persistence only.
- Deterministic shuffle behavior.
- Basic unit tests for parser/shuffle/state.

## Testability Principle
- Core logic (CSV parsing, deck engine) must be pure functions — testable without a browser.
- UI components must be testable in headless environments (jsdom / headless browser).
- AI agents must be able to run and verify the system headlessly (CLI test runner, no manual interaction).
- Design for programmable control: state should be inspectable and manipulable without the UI.
