import { useMemo, useState } from 'react'

const PROMPT_TEMPLATE = `Generate a Japanese vocabulary CSV for language learning.

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
[SPECIFIC_WORDS]

Example output (3 rows):
id,jp,hira,en,example,translation,romaji,zh,cat
1,猫,ねこ,cat,猫が好きです,I like cats,neko,猫,noun
2,犬,いぬ,dog,犬と散歩します,I walk with my dog,inu,狗,noun
3,鳥,とり,bird,鳥が空を飛んでいます,A bird is flying in the sky,tori,鸟,noun`

export default function PromptGenerator() {
  const [numberValue, setNumberValue] = useState('30')
  const [topicValue, setTopicValue] = useState('daily conversation')
  const [specificWords, setSpecificWords] = useState('')
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')

  const promptText = useMemo(() => {
    let text = PROMPT_TEMPLATE.replace('[NUMBER]', numberValue || '[NUMBER]').replace('[TOPIC]', topicValue || '[TOPIC]')

    if (specificWords.trim()) {
      text = text.replace('[SPECIFIC_WORDS]', `- Make sure to include these specific words: ${specificWords.trim()}`)
    } else {
      text = text.replace('\n[SPECIFIC_WORDS]', '')
    }

    return text
  }, [numberValue, topicValue, specificWords])

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptText)
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    }
  }

  return (
    <>
      <p className="mb-3 text-sm text-slate-500">
        Copy this prompt, paste it into ChatGPT / Claude / Gemini, then paste the CSV output in step 2.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-slate-600">
          Words
          <input
            value={numberValue}
            onChange={(event) => setNumberValue(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
          />
        </label>
        <label className="text-sm text-slate-600">
          Topic
          <input
            value={topicValue}
            onChange={(event) => setTopicValue(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
          />
        </label>
      </div>

      <label className="mt-3 block text-sm text-slate-600">
        Specific words to include (optional)
        <textarea
          value={specificWords}
          onChange={(event) => setSpecificWords(event.target.value)}
          placeholder="e.g. 食べる, 飲む, 走る"
          className="mt-1 h-16 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
        />
      </label>

      <pre className="mt-4 max-h-48 overflow-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-200">{promptText}</pre>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
          onClick={handleCopyPrompt}
        >
          Copy prompt
        </button>
        {copyStatus === 'copied' ? <span className="text-sm text-slate-500">Copied</span> : null}
        {copyStatus === 'failed' ? <span className="text-sm text-rose-600">Copy failed</span> : null}
      </div>
    </>
  )
}
