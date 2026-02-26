# Card Protocol (Core)

## Canonical Runtime Shape
```ts
type VocabCard = {
  id: string;        // required — unique identifier
  jp: string;        // required — standard form (kanji/katakana/hiragana)
  hira: string;      // required — hiragana reading (pronunciation)
  en: string;        // required — English meaning
  example: string;   // required — Japanese example sentence
  translation: string; // required — English translation of example
  romaji?: string;   // optional — romanized pronunciation
  zh?: string;       // optional — Chinese meaning
  cat?: string;      // optional — category/tag
};
```

## Card Display

### Front (user-configurable in options)
- Default: standard form (`jp`) displayed large
- Alternative: English meaning (`en`) displayed large
- User toggles between the two in options panel

### Back (always shows)
- Required: English meaning (or standard form if front shows English), pronunciation (`hira`), example sentence + translation
- Optional: `romaji`, `zh`, `cat` — shown if present, hidden if empty

## Principle
- CSV is only the import transport.
- Runtime always uses normalized `VocabCard[]`.
- Japanese-only. Field names are not generalized for other languages.

## Validation
- All required fields must be non-empty.
- Optional fields may be empty/missing — import accepts with empty string.
- `id` must be unique.

## Single Deck
- Only one deck at a time. New import replaces the old one.
- Re-import resets memorized state.
- Warn user before replacing an existing deck.
