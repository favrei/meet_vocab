import { useMemo, useState, type ChangeEvent } from 'react'
import ConfirmModal from '../components/ConfirmModal'
import { parseCSV } from '../lib/csv'
import { createInitialDeckState } from '../lib/deck'
import { saveDeck, saveDeckState, saveFrontMode } from '../lib/storage'
import type { VocabCard } from '../types'

type ImportScreenProps = {
  existingDeck: boolean
  onImportSuccess: (cards: VocabCard[]) => void
}

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
- Generate [NUMBER] words about [TOPIC].`

function generateSeed() {
  return Math.floor(Date.now() % 2147483647)
}

export default function ImportScreen({ existingDeck, onImportSuccess }: ImportScreenProps) {
  const [rawInput, setRawInput] = useState('')
  const [errors, setErrors] = useState<{ row: number; message: string }[]>([])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingCards, setPendingCards] = useState<VocabCard[] | null>(null)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const [numberValue, setNumberValue] = useState('30')
  const [topicValue, setTopicValue] = useState('daily conversation')

  const promptText = useMemo(() => {
    return PROMPT_TEMPLATE.replace('[NUMBER]', numberValue || '[NUMBER]').replace('[TOPIC]', topicValue || '[TOPIC]')
  }, [numberValue, topicValue])

  const persistAndContinue = (cards: VocabCard[]) => {
    saveDeck(cards)
    saveDeckState(createInitialDeckState(generateSeed()))
    saveFrontMode('jp')
    onImportSuccess(cards)
  }

  const handleImport = () => {
    const result = parseCSV(rawInput)

    if (result.errors.length > 0) {
      setErrors(result.errors)
      return
    }

    if (result.cards.length === 0) {
      setErrors([{ row: 1, message: 'No valid data rows found.' }])
      return
    }

    setErrors([])

    if (existingDeck) {
      setPendingCards(result.cards)
      setConfirmOpen(true)
      return
    }

    persistAndContinue(result.cards)
  }

  const handleFilePick = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const text = await file.text()
    setRawInput(text)
    setErrors([])
  }

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptText)
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-8 sm:px-6">
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Bring your CSV, swipe words into memory.</h1>
        <p className="mt-2 text-sm text-slate-600">Paste CSV text or choose a `.csv` file. Import replaces the active deck.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Import deck</h2>
        <div className="mt-4 space-y-3">
          <label className="block text-sm font-medium text-slate-700" htmlFor="csv-paste">
            Paste CSV
          </label>
          <textarea
            id="csv-paste"
            className="h-56 w-full rounded-xl border border-slate-300 p-3 font-mono text-xs text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-slate-500"
            placeholder="id,jp,hira,en,example,translation,romaji,zh,cat"
            value={rawInput}
            onChange={(event) => setRawInput(event.target.value)}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
              Choose CSV file
              <input type="file" accept=".csv,text/csv" className="hidden" onChange={handleFilePick} />
            </label>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              onClick={handleImport}
            >
              Import Deck
            </button>
          </div>

          {errors.length > 0 ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              <p className="font-semibold">Import errors</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {errors.map((error, index) => (
                  <li key={`${error.row}-${index}`}>
                    Row {error.row}: {error.message}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">CSV Prompt Helper</h2>
        <p className="mt-2 text-sm text-slate-600">Fill values, copy prompt, then paste to your LLM.</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm text-slate-700">
            Number
            <input
              value={numberValue}
              onChange={(event) => setNumberValue(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm text-slate-700">
            Topic
            <input
              value={topicValue}
              onChange={(event) => setTopicValue(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <pre className="mt-4 max-h-64 overflow-auto rounded-xl bg-slate-950 p-3 text-xs text-slate-100">{promptText}</pre>
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            onClick={handleCopyPrompt}
          >
            Copy prompt
          </button>
          {copyStatus === 'copied' ? <span className="text-sm text-emerald-700">Copied.</span> : null}
          {copyStatus === 'failed' ? <span className="text-sm text-rose-700">Copy failed.</span> : null}
        </div>
      </section>

      <ConfirmModal
        open={confirmOpen}
        title="Replace current deck?"
        message="This will replace your current deck and reset progress. Continue?"
        confirmLabel="Replace deck"
        onCancel={() => {
          setConfirmOpen(false)
          setPendingCards(null)
        }}
        onConfirm={() => {
          if (pendingCards) {
            persistAndContinue(pendingCards)
          }
          setConfirmOpen(false)
          setPendingCards(null)
        }}
      />
    </main>
  )
}
