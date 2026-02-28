# CSV Contract (Core)

## Header Names
Canonical template:
`id,jp,hira,en,example,translation,romaji,zh,cat`

Import accepts reordered columns as long as all required and optional header names exist exactly once.

## Required Fields
`id`, `jp`, `hira`, `en`, `example`, `translation`

## Optional Fields
`romaji`, `zh`, `cat` — may be empty. Import accepts with empty string.

## Rules
- Header must be present and include all required/optional column names.
- Column order may vary.
- Required fields cannot be empty.
- `id` must be unique across rows.
- Show row-level errors on invalid input.
- Standard CSV quoting for fields containing commas.

## LLM Prompt (Draft)

The app must include a copy-ready prompt. Below is the working draft (refine during build):

```
Generate a Japanese vocabulary CSV for language learning.

Output ONLY raw CSV — no markdown fences, no explanation, no commentary.

Header (recommended order):
id,jp,hira,en,example,translation,romaji,zh,cat

Column definitions:
- id: unique integer starting from 1
- jp: Japanese word in standard form (kanji where appropriate)
- hira: full hiragana reading
- en: English meaning
- example: example sentence in Japanese using the word
- translation: English translation of the example sentence
- romaji: romanized pronunciation (optional, may be empty)
- zh: Chinese meaning (optional, may be empty)
- cat: category like "noun", "verb", "adjective" (optional, may be empty)

Rules:
- Use standard CSV quoting if a field contains commas.
- Every row must have id, jp, hira, en, example, and translation filled.
- Generate [NUMBER] words about [TOPIC].

Example output (3 rows):
id,jp,hira,en,example,translation,romaji,zh,cat
1,猫,ねこ,cat,猫が好きです,I like cats,neko,猫,noun
2,犬,いぬ,dog,犬と散歩します,I walk with my dog,inu,狗,noun
3,鳥,とり,bird,鳥が空を飛んでいます,A bird is flying in the sky,tori,鸟,noun
```

### Prompt Principle
- The prompt lives in the app UI, copy-ready.
- Users fill in `[NUMBER]` and `[TOPIC]` before pasting to their LLM.
- Derived from the data model in `resources/original_prompt.md`.
