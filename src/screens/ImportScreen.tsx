import { useMemo, useRef, useState, type ChangeEvent } from 'react'
import ConfirmModal from '../components/ConfirmModal'
import PromptGenerator from '../components/PromptGenerator'
import { parseCSV } from '../lib/csv'
import { createInitialDeckState, generateSeed } from '../lib/deck'
import { saveDeck, saveDeckState, saveFrontMode } from '../lib/storage'
import type { VocabCard } from '../types'

type ImportScreenProps = {
  existingDeck: boolean
  onImportSuccess: (cards: VocabCard[]) => void
}

const EXAMPLE_CSV = `id,jp,hira,en,example,translation,romaji,zh,cat
1,猫,ねこ,cat,猫が好きです,I like cats,neko,猫,noun
2,犬,いぬ,dog,犬と散歩します,I walk with my dog,inu,狗,noun
3,鳥,とり,bird,鳥が空を飛んでいます,A bird is flying in the sky,tori,鸟,noun
4,魚,さかな,fish,魚を食べました,I ate fish,sakana,鱼,noun
5,馬,うま,horse,馬に乗りたいです,I want to ride a horse,uma,马,noun`

export default function ImportScreen({ existingDeck, onImportSuccess }: ImportScreenProps) {
  const importSectionRef = useRef<HTMLElement | null>(null)
  const [rawInput, setRawInput] = useState('')
  const [errors, setErrors] = useState<{ row: number; message: string }[]>([])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingCards, setPendingCards] = useState<VocabCard[] | null>(null)

  const groupedErrors = useMemo(() => {
    const headerRegex = /header/i
    return errors.reduce(
      (acc, item) => {
        if (headerRegex.test(item.message)) {
          acc.headerErrors.push(item)
        } else {
          acc.rowErrors.push(item)
        }
        return acc
      },
      { headerErrors: [] as { row: number; message: string }[], rowErrors: [] as { row: number; message: string }[] }
    )
  }, [errors])

  const walkthroughVideoSrc = `${import.meta.env.BASE_URL}walkthrough.mp4`

  const persistAndContinue = (cards: VocabCard[]) => {
    saveDeck(cards)
    saveDeckState(createInitialDeckState(generateSeed()))
    saveFrontMode('jp')
    onImportSuccess(cards)
  }

  const parseAndImport = (input: string) => {
    const result = parseCSV(input)

    if (result.errors.length > 0) {
      setErrors(result.errors)
      return
    }

    if (result.cards.length === 0) {
      setErrors([{ row: 1, message: 'We could not find valid rows. Try loading the sample rows to compare format.' }])
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

  const handleImport = () => {
    parseAndImport(rawInput)
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

  const handleUseExampleCSV = () => {
    setRawInput(EXAMPLE_CSV)
    setErrors([])
  }

  const handleStartWithSampleDeck = () => {
    setRawInput(EXAMPLE_CSV)
    parseAndImport(EXAMPLE_CSV)
  }

  const handleScrollToImport = () => {
    importSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-6 sm:px-6">
      {/* ── Hero: demo video front and center ── */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-2xl">
        <div className="relative z-10 px-5 pt-5 pb-1">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Date-a-Lingo</p>
        </div>
        <div className="relative z-10 px-4 pb-5 sm:px-6">
          <video
            className="mx-auto mt-3 w-full max-w-3xl rounded-2xl shadow-lg ring-1 ring-white/10"
            controls
            autoPlay
            muted
            loop
            preload="auto"
            playsInline
            src={walkthroughVideoSrc}
          />
        </div>
        {/* subtle gradient glow behind the video */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(99,102,241,0.15) 0%, transparent 70%)',
          }}
        />
      </section>

      {/* ── CTA strip ── */}
      <section className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-slate-700 hover:shadow-lg active:scale-[0.98]"
          onClick={handleStartWithSampleDeck}
        >
          Try with sample deck
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow-md active:scale-[0.98]"
          onClick={handleScrollToImport}
        >
          Import my CSV
        </button>
      </section>

      <p className="mt-3 text-center text-xs text-slate-400">No account needed. Everything stays in your browser.</p>

      {/* ── Import form ── */}
      <section
        ref={importSectionRef}
        className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <h2 className="text-base font-semibold text-slate-900">Import your word list</h2>
        <div className="mt-4 space-y-3">
          <textarea
            id="csv-paste"
            className="h-44 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
            placeholder="id,jp,hira,en,example,translation,romaji,zh,cat"
            value={rawInput}
            onChange={(event) => setRawInput(event.target.value)}
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-700 active:scale-[0.98]"
              onClick={handleImport}
            >
              Import deck
            </button>
            <label className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
              Upload file
              <input type="file" accept=".csv,text/csv" className="hidden" onChange={handleFilePick} />
            </label>
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              onClick={handleUseExampleCSV}
            >
              Load sample rows
            </button>
          </div>

          <details className="group rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
            <summary className="cursor-pointer font-medium text-slate-600 group-open:mb-2">CSV format reference</summary>
            <p className="font-mono text-slate-600">id,jp,hira,en,example,translation,romaji,zh,cat</p>
            <p className="mt-1.5 font-mono text-slate-600">1,猫,ねこ,cat,猫が好きです,I like cats,neko,猫,noun</p>
          </details>

          {errors.length > 0 ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              <p className="font-semibold">Fix these issues</p>
              {groupedErrors.headerErrors.length > 0 ? (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
                  {groupedErrors.headerErrors.map((error, index) => (
                    <li key={`header-${error.row}-${index}`}>
                      Row {error.row}: {error.message}
                    </li>
                  ))}
                </ul>
              ) : null}
              {groupedErrors.rowErrors.length > 0 ? (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
                  {groupedErrors.rowErrors.map((error, index) => (
                    <li key={`row-${error.row}-${index}`}>
                      Row {error.row}: {error.message}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      <PromptGenerator />

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
