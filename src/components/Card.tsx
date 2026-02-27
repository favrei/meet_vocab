import type { FrontMode, VocabCard } from '../types'

type CardProps = {
  card: VocabCard
  flipped: boolean
  isMemorized: boolean
  frontMode: FrontMode
}

export default function Card({ card, flipped, isMemorized, frontMode }: CardProps) {
  const frontText = frontMode === 'jp' ? card.jp : card.en
  const shell = 'flex h-full w-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6'

  if (!flipped) {
    return (
      <article className={shell}>
        <header className="flex items-center justify-between text-xs font-medium text-slate-500">
          <span>#{card.id}</span>
          {isMemorized ? <span className="rounded-full bg-slate-800 px-2 py-1 text-white">Memorized</span> : null}
        </header>
        <div className="flex flex-1 items-center justify-center px-4 text-center sm:px-5">
          <p className="text-4xl font-medium leading-tight text-slate-900 sm:text-6xl">{frontText}</p>
        </div>
        <p className="text-center text-xs text-slate-500">Tap to reveal details</p>
      </article>
    )
  }

  const metaParts = [card.romaji, card.zh, card.cat].filter((value): value is string => Boolean(value))

  return (
    <article className={shell}>
      <header className="flex items-center justify-between text-xs font-medium text-slate-500">
        <span>#{card.id}</span>
        {isMemorized ? <span className="rounded-full bg-slate-800 px-2 py-1 text-white">Memorized</span> : null}
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 sm:gap-6">
        {/* Hero block: meaning + pronunciation */}
        <div className="text-center">
          <p className="text-2xl font-semibold text-slate-900 sm:text-3xl">{frontMode === 'jp' ? card.en : card.jp}</p>
          <p className="mt-1 text-lg text-slate-500 sm:text-xl">{card.hira}</p>
        </div>

        {/* Example in distinct container */}
        <div className="w-full rounded-xl bg-slate-50 px-4 py-3 text-center">
          <p className="text-sm leading-relaxed text-slate-900 sm:text-base">{card.example}</p>
          <p className="mt-1 text-sm text-slate-500">{card.translation}</p>
        </div>

        {/* Meta pill badges */}
        {metaParts.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-2">
            {metaParts.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">{tag}</span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  )
}
