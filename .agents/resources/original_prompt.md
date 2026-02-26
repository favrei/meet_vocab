Design Requirements — Japanese Tinder-Style Memory Cards

1) Product Goal



Build a mobile-first Japanese vocabulary learning app that uses a Tinder-like interaction model to quickly triage words into “memorized” vs “keep practicing,” while allowing the learner to reveal details on demand.



2) Core Interaction Model

Primary screen is the deck.



Swipe gestures

Swipe left → mark the current word as memorized.

Swipe right → keep showing (do not mark memorized).

Swiping advances to the next card.



Tap interaction

Tap the card to toggle between:

Cover (front): large Japanese standard form (display form).

Details (back): reading + translations + example.



Swipe affordances

Show lightweight labels above deck: “← Memorized” and “Keep →”.

Labels highlight during drag direction (“left” or “right”).



Deck behavior

Cards are presented in a pre-shuffled order that is stable for a given shuffle seed.



A “next card” preview appears behind the current card for depth.



3) End-of-Deck Experience

When the user finishes the last card, show a dedicated Ending Screen (not a dead stop).



Ending screen actions:

Shuffle and restart (re-seed shuffle + restart at first card).

Restart (same order) (reset cursor only).

Reset memorized (clear memorized state and restart).



4) Options / Settings (Secondary UI)



All controls that affect the deck must live in an Options panel (sheet/drawer), not on the main screen.

Required controls:



Hide memorized toggle: if ON, memorized cards are removed from the active deck.



Re-shuffle deck: generates a new shuffle seed, resets to start.

Reset memorized: clears memorized set and restarts.

Progress display: memorized count / total + progress bar.



5) Data Model

Each card must contain:

jp (standard form), hira (reading), romaji, en, zh, cat, plus a stable id.



The app must provide one example sentence per card, displayed on the back:



Japanese example

English translation



6) Persistence



(optional) Memorized state must persist across refresh via localStorage.



Shuffle seed must persist via localStorage so the deck order is stable until re-shuffled.



7) Non-Functional Requirements



Mobile-friendly layout (safe spacing, large word typography).

Swipe works on touch and mouse drag.

UI must avoid overlap: deck labels must not collide with card badges/content.

The main screen remains focused: deck + small top bar + Options entry point only.

Add full screen toggle because not all of the container will be full screen by default.
