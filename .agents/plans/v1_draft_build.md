# v1 Draft Build Plan

## Context
POC is validated by friends. Goal: scaffold the real project and get a working draft that an agent (or human) can open in the browser. The POC (`resources/poc.md`) is a single-file React component with hardcoded markdown data. This plan turns it into a proper three-layer app with CSV import.

## Tech Stack
- **Build:** Vite
- **UI:** React 19 + TypeScript
- **Styling:** Tailwind CSS v4
- **Animation:** Motion (formerly framer-motion)
- **Icons:** lucide-react
- **Test:** Vitest + jsdom
- **JS Package Manager:** npm

## This Phase Goal
- Deliver a playable local draft (`npm run dev`), not deployment.
- GitHub Pages deployment is deferred to the next phase.

## Implementation Status (2026-02-27)
- Phase 1 to Phase 6 are implemented and locally playable.
- Test/build are green: `npm test` and `npm run build`.
- Swipe behavior shipped: `right = keep`, `left = memorized/drop`.
- Deck behavior shipped:
  - If `Hide memorized` is ON (default), memorized cards leave active draw.
  - If `Hide memorized` is OFF, memorized cards stay in draw and deck can loop.
- UI updates shipped:
  - Flat Material-like style (no 3D/glass look).
  - Card-first layout with minimized floating controls.
  - Card back simplified; optional metadata is compact (`romaji / zh / cat`).
- Visual polish pass (2026-02-27):
  - Card back: content vertically centered as a group (`flex-1 flex-col items-center justify-center gap-6`) instead of `justify-between`.
  - Text hierarchy improved: secondary text (hiragana, translation) lighter color/weight.
  - Action buttons: changed from small circles to equal-width pill-shaped buttons with labels ("Memorized" / "Keep"), spanning full card width with `flex-1`.

## Directory Layout
```
date-a-lingo/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts          # if needed by v4
├── src/
│   ├── main.tsx                # ReactDOM entry
│   ├── App.tsx                 # state machine: import | deck
│   ├── types.ts                # VocabCard type
│   ├── lib/
│   │   ├── csv.ts              # parse + validate CSV → VocabCard[]
│   │   ├── deck.ts             # seeded shuffle, deck state logic
│   │   └── storage.ts          # localStorage helpers (deck, seed, memorized, settings)
│   ├── screens/
│   │   ├── ImportScreen.tsx     # paste/upload CSV, show errors, LLM prompt
│   │   └── DeckScreen.tsx      # swipe deck, options sheet, end-of-deck
│   ├── components/
│   │   ├── Card.tsx            # front + back face
│   │   ├── SwipeDeck.tsx       # drag/swipe gesture wrapper
│   │   ├── Sheet.tsx           # bottom sheet (options)
│   │   ├── ProgressBar.tsx
│   │   ├── Pill.tsx
│   │   └── ConfirmModal.tsx    # inline "replace deck?" confirmation
│   └── index.css               # Tailwind directives
├── tests/
│   ├── csv.test.ts
│   ├── deck.test.ts
│   └── storage.test.ts
└── .agents/                    # (existing)
```

## Build Phases

### Phase 1 — Scaffold
1. `npm create vite@latest . -- --template react-ts` (in-place).
2. Install deps: `npm i motion lucide-react`.
3. Install Tailwind v4: follow Vite plugin approach (`@tailwindcss/vite`).
4. Install dev deps: `npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom`.
5. Configure `vitest` in `vite.config.ts` (environment: jsdom).
6. Verify: `npm run dev` opens blank page, `npm test` runs with 0 tests.

### Phase 2 — Pure Logic Layer (no React)
**`src/types.ts`**
- Export `VocabCard` type as defined in `documents/card_protocol.md`.

**`src/lib/csv.ts`**
- `parseCSV(raw: string): { cards: VocabCard[]; errors: { row: number; message: string }[] }`
- Validate required fields, unique ids, standard CSV quoting.
- Accept reordered CSV columns by header name mapping (all required/optional headers must exist).
- Pure function, no side effects.

**`src/lib/deck.ts`**
- `mulberry32(seed: number): () => number`
- `shuffleWithSeed<T>(items: T[], seed: number): T[]`
- `type DeckState = { seed: number; cursor: number; memorized: Set<string>; hideMemorized: boolean }`
- Helper functions: `activeOrder()`, `advance()`, `markMemorized()`, `resetMemorized()`, `reshuffle()`, `restartSameOrder()`.
- All pure — take state in, return new state out.

**`src/lib/storage.ts`**
- `saveDeck(cards: VocabCard[]): void`
- `loadDeck(): VocabCard[] | null`
- `saveDeckState(state: DeckState): void`
- `loadDeckState(): DeckState | null`
- `clearAll(): void`
- Thin localStorage wrappers. Keys namespaced (`mv_deck_v1`, `mv_state_v1`, etc.).

**Tests:** Write `csv.test.ts` and `deck.test.ts` covering happy path + edge cases. Verify with `npm test`.

### Phase 3 — Swipe UI (Port from POC)
Port the POC's rendering and gesture logic into proper components:

**`src/components/Card.tsx`**
- Props: `card: VocabCard`, `flipped: boolean`, `isMemorized: boolean`, `frontMode: 'jp' | 'en'`.
- Renders front or back face.
- Back shows required fields plus compact optional metadata when present (`romaji / zh / cat`).

**`src/components/SwipeDeck.tsx`**
- Wraps current card in `motion.div` with drag-x.
- Handles drag direction state, threshold detection, exit animation.
- Swipe semantics: right swipe keeps card (advance), left swipe marks memorized (drop).
- Renders next-card preview behind.

**`src/components/Sheet.tsx`, `ProgressBar.tsx`, `Pill.tsx`**
- Direct port from POC, converted to TypeScript with props.

**`src/screens/DeckScreen.tsx`**
- Composes SwipeDeck + Sheet + end-of-deck.
- Manages deck state via `lib/deck.ts` + `lib/storage.ts`.
- Deck-first layout: card is primary, controls/progress are minimized as floating UI.
- Options sheet: hide-memorized toggle (default ON), **front mode toggle (jp/en)**, re-shuffle, reset memorized, restart, and "Import new deck".

### Phase 4 — Import Screen
**`src/screens/ImportScreen.tsx`**
- Two input modes: paste (textarea) and file upload (file picker only).
- On submit: parse via `lib/csv.ts`, show row-level errors inline.
- On success: save deck to storage, transition to deck screen.
- Contains copy-ready LLM prompt section (from `documents/csv_contract_and_prompt.md`).
  - User fills in `[NUMBER]` and `[TOPIC]` fields, clicks copy button.

**`src/components/ConfirmModal.tsx`**
- Shown when importing over an existing deck.
- Inline modal (not `window.confirm`): "This will replace your current deck and reset progress. Continue?"

### Phase 5 — App Shell
**`src/App.tsx`**
- State machine with two states: `'import'` and `'deck'`.
- On mount: check `storage.loadDeck()`. If deck exists → `'deck'`. Else → `'import'`.
- Transitions: import success → `'deck'`. Options "Import new deck" → `'import'`.
- No router. No browser back-button handling between screens.

**`src/main.tsx`**
- `ReactDOM.createRoot` → `<App />`.

### Phase 6 — Polish & Verify
- Responsive check: test at phone (375px), tablet (768px), desktop (1024px+).
- Touch swipe on mobile, mouse drag on desktop.
- Styling pass: moved from prototype styling to flat Material-like styling.
- Run `npm test` — all pass.
- Run `npm run build` — no errors.
- Manual smoke test via `npm run dev`.

## Deferred (not in this draft)
- GitHub Pages deployment config.
- Fullscreen toggle (from POC).
- Landing page (per `landing_page_spec.md` — optional for v1).
- PWA / offline support.

## Verification
1. `npm run dev` → opens import screen.
2. Paste a valid CSV → swipe deck appears.
3. Swipe right keeps, swipe left memorizes/drops; state persists on refresh.
4. Options sheet works: hide memorized (default ON), re-shuffle, reset, front mode toggle.
5. End-of-deck appears when no active cards remain (with hide ON) and restart/shuffle/reset buttons work.
6. Import new deck from options → confirm modal → import screen.
7. `npm test` → all tests pass.
8. `npm run build` → clean production build.
