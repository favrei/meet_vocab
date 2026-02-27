# Deck Import Landing UX Overhaul Plan

## Implementation Status (2026-02-27)

### Shipped
- Added hero-first import landing with embedded walkthrough video.
- Added top CTA strip with sample-first path (`Try with sample deck`) and quick jump to import form (`Import my CSV`).
- Added trust copy: local-only storage and no account required.
- Reworked import form hierarchy and visual polish (card sections, spacing, clearer headings).
- Kept CSV helper flow in-page with collapsible "Generate a word list with AI" section and copy prompt action.
- Improved error readability by grouping import issues into header vs row errors.
- Fixed import action control consistency: `Import deck`, `Upload file`, and `Load sample rows` now share unified sizing.

### Follow-up Mobile UX Fixes Completed
- Deck screen now uses mobile-first responsive sizing (`svh` based) to reduce oversized cards on phones.
- Card typography and spacing are scaled down on small screens, with larger values restored at `sm+`.
- Added tap-guard heuristics on swipe cards to prevent accidental flips while dragging on mobile.
- Moved swipe hint chip (`KEEP` / `MEMORIZED`) into a reserved row above the card so it does not overlap serial labels.
- Stabilized next-card preview during swipe transitions by freezing prefetched next card until exit animation completion.

### Remaining from this plan
- Guided 3-step onboarding block is not yet implemented.
- Copy rewrite for some labels/messages is still partial.
- Accessibility pass is still pending (focus states + screen reader wording review).
- Optional visual assets/illustrations beyond video are still open.

## Why we are doing this
- First-time users land on a screen that feels technical and cold.
- The current import view explains mechanics, but does not sell value or reduce anxiety.
- We need to improve comprehension, confidence, and motivation before users ever paste CSV.

## Primary goals
- Make the first screen feel welcoming and visual.
- Explain the workflow in plain language, not CSV jargon.
- Help users succeed on first import attempt.
- Keep power-user speed for users who already have a deck ready.

## Non-goals (for this phase)
- Rebuilding the entire study/swipe experience.
- Backend or account features.
- Advanced deck authoring workflows.

## UX strategy
1. Lead with value first, instructions second.
2. Show what users get immediately (preview cards / outcomes).
3. Use progressive disclosure: simple path first, details on demand.
4. Replace jargon with user language.
5. Provide concrete examples at every decision point.

## Planned improvements

### 1) Hero + visual context
- Add a strong top hero section:
- Headline focused on outcome: learn Japanese faster with your own vocab deck.
- Subtext describing 30-second onboarding.
- Include a visual (mock flashcard stack / screenshot / illustration) so the page is not text-only.
- Add one primary CTA: `Start with sample deck`.
- Add secondary CTA: `Import my CSV`.

### 1.1) Walkthrough video (real usage)
- Add an embedded walkthrough video to the landing/import page.
- Show actual flow: load sample/import CSV -> review/swipe -> mark memorized.
- Place it near the hero so first-time users can understand usage quickly.
- Include controls (`play/pause`, `seek`, `mute`) and a fallback link.
- Ensure responsive behavior on mobile without layout breaking.

### 2) Guided onboarding flow (3 short steps)
- Introduce a compact stepper:
- Step 1: Get CSV (sample, file upload, or generate with helper prompt).
- Step 2: Import and validate.
- Step 3: Start swiping cards.
- Keep each step to one sentence + icon.

### 3) Rewrite copy to plain language
- Replace technical labels:
- `Import deck` -> `Add your word list`.
- `CSV Prompt Helper` -> `Need a list? Generate one quickly`.
- `Import replaces the active deck` -> friendly warning with explicit outcome.
- Add microcopy near input: “Not sure format is right? Use the sample first.”

### 4) Strong sample-first path
- Promote sample deck as safest first action.
- Add “Preview sample rows” expandable panel before import.
- Allow one-click “Load sample and start” to reduce blank-state friction.

### 5) Better error UX
- Keep row-level errors, but rewrite in actionable tone.
- Group errors by type: missing columns, required value missing, duplicate IDs.
- Add “Fix tips” panel with exact expected headers and a valid row example.

### 6) Layout and visual hierarchy
- Split page into two clear zones:
- Left/top: motivation + what this app does.
- Right/bottom: import form.
- Use card sections with icons, spacing, and distinct emphasis states.
- Ensure good mobile stacking order: value section first, input section second.

### 7) Trust and reassurance
- Add small “What stays local” note:
- Deck and progress are stored in browser local storage.
- No signup required.
- Add expectation line: “You can replace or reset deck anytime.”

### 8) Accessibility and usability baseline
- Ensure button labels are explicit and screen-reader friendly.
- Improve focus states for keyboard users.
- Maintain readable contrast and minimum touch sizes.

## Implementation sequence
1. Rewrite IA and copy for the import screen.
2. Build new hero + stepper + sample-first CTA block.
3. Add and wire the real-usage walkthrough video section.
4. Re-layout import form and prompt helper into clearer sections.
5. Improve error messaging and tips panel.
6. Add visual assets/placeholders and responsive polish.
7. Run accessibility pass and device checks (desktop + mobile).

## Acceptance criteria
- A first-time user can explain what to do in under 10 seconds.
- At least one visual element is visible above the fold.
- A real-usage walkthrough video is visible on the landing/import page.
- Sample deck path is obvious and one-click.
- Error messages tell users exactly how to fix input.
- The page feels welcoming rather than technical.

## Risks / dependencies
- This repository currently appears to contain built static assets only.
- To implement cleanly, we likely need the source files (components/styles) rather than editing minified bundles.
- If source is unavailable, we can still patch built files, but it will be slower and harder to maintain.
