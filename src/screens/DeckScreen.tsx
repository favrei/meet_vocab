import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Check, Settings2 } from 'lucide-react'
import Pill from '../components/Pill'
import Sheet from '../components/Sheet'
import SwipeDeck from '../components/SwipeDeck'
import {
  activeOrder,
  advance,
  clampCursor,
  createInitialDeckState,
  markMemorized,
  resetMemorized,
  reshuffle,
  restartSameOrder,
  setHideMemorized,
  type DeckState,
} from '../lib/deck'
import { loadDeckState, loadFrontMode, saveDeckState, saveFrontMode } from '../lib/storage'
import type { FrontMode, VocabCard } from '../types'

type DeckScreenProps = {
  cards: VocabCard[]
  onImportNewDeck: () => void
}

function generateSeed() {
  return Math.floor(Date.now() % 2147483647)
}

export default function DeckScreen({ cards, onImportNewDeck }: DeckScreenProps) {
  const [deckState, setDeckState] = useState<DeckState>(() => {
    const saved = loadDeckState()
    if (!saved) {
      return createInitialDeckState(generateSeed())
    }
    return clampCursor(saved, cards)
  })
  const [frontMode, setFrontMode] = useState<FrontMode>(() => loadFrontMode() ?? 'jp')
  const [flipped, setFlipped] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    setDeckState((current) => clampCursor(current, cards))
  }, [cards])

  useEffect(() => {
    saveDeckState(deckState)
  }, [deckState])

  useEffect(() => {
    saveFrontMode(frontMode)
  }, [frontMode])

  const orderedCards = useMemo(() => activeOrder(cards, deckState), [cards, deckState])
  const done = orderedCards.length === 0
  const currentCard = !done ? orderedCards[deckState.cursor] ?? null : null
  const nextCard = !done && orderedCards.length > 1 ? orderedCards[(deckState.cursor + 1) % orderedCards.length] ?? null : null
  const memorizedCount = deckState.memorized.size

  const handleSwipe = (direction: 'left' | 'right') => {
    setFlipped(false)

    setDeckState((previous) => {
      const active = activeOrder(cards, previous)
      const visibleCard = active[previous.cursor]
      if (!visibleCard) {
        return previous
      }

      if (direction === 'right') {
        // Keep card in deck: move cursor to next active card.
        return advance(previous, cards)
      }

      // Memorized/drop: by default card leaves active deck.
      const marked = markMemorized(previous, visibleCard.id, cards)
      // If hide memorized is OFF, keep draw flow moving to the next card.
      if (!marked.hideMemorized) {
        return advance(marked, cards)
      }
      return marked
    })
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-6 sm:px-6">
      <section className="relative w-full">
        <div className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
          {memorizedCount}/{cards.length}
        </div>
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="absolute right-1 top-0 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
          aria-label="Open options"
        >
          <Settings2 className="h-4 w-4" />
        </button>

        {!done ? (
          <>
            <SwipeDeck
              currentCard={currentCard}
              nextCard={nextCard}
              frontMode={frontMode}
              isMemorized={currentCard ? deckState.memorized.has(currentCard.id) : false}
              flipped={flipped}
              onFlip={() => setFlipped((current) => !current)}
              onSwipe={handleSwipe}
            />

            <div className="mx-auto mt-4 flex w-full max-w-[30rem] items-center gap-3">
              <button
                type="button"
                onClick={() => handleSwipe('left')}
                title="Memorized"
                aria-label="Memorized"
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 text-sm font-medium text-emerald-700 shadow-sm transition hover:bg-emerald-100"
              >
                <Check className="h-4 w-4" />
                Memorized
              </button>
              <button
                type="button"
                onClick={() => handleSwipe('right')}
                title="Keep"
                aria-label="Keep"
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-sky-200 bg-sky-50 text-sm font-medium text-sky-700 shadow-sm transition hover:bg-sky-100"
              >
                Keep
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </>
        ) : (
          <section className="mx-auto mt-10 w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Deck Complete</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">No cards left in active deck</h2>
            <p className="mt-3 text-sm text-slate-600">All cards are memorized. Restart, reset, or import a new deck.</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <Pill
                onClick={() => {
                  setFlipped(false)
                  setDeckState((state) => restartSameOrder(state, cards))
                }}
              >
                Restart
              </Pill>
              <Pill
                onClick={() => {
                  setFlipped(false)
                  setDeckState((state) => reshuffle(state, generateSeed()))
                }}
              >
                Re-shuffle
              </Pill>
              <Pill
                onClick={() => {
                  setFlipped(false)
                  setDeckState((state) => resetMemorized(state))
                }}
              >
                Reset memorized
              </Pill>
            </div>
          </section>
        )}
      </section>

      <Sheet open={sheetOpen} title="Options" onClose={() => setSheetOpen(false)}>
        <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-600">
          <div className="rounded-xl bg-slate-100 p-2">Memorized: {memorizedCount}</div>
          <div className="rounded-xl bg-slate-100 p-2">Active: {orderedCards.length}</div>
          <div className="rounded-xl bg-slate-100 p-2">Total: {cards.length}</div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">Front mode</p>
          <div className="flex gap-2">
            <Pill active={frontMode === 'jp'} onClick={() => setFrontMode('jp')}>
              JP
            </Pill>
            <Pill active={frontMode === 'en'} onClick={() => setFrontMode('en')}>
              EN
            </Pill>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">Card filters</p>
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={deckState.hideMemorized}
              onChange={(event) => {
                setDeckState((state) => setHideMemorized(state, event.target.checked, cards))
              }}
            />
            Hide memorized cards
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <Pill
            onClick={() => {
              setFlipped(false)
              setDeckState((state) => reshuffle(state, generateSeed()))
              setSheetOpen(false)
            }}
          >
            Re-shuffle
          </Pill>
          <Pill
            onClick={() => {
              setFlipped(false)
              setDeckState((state) => resetMemorized(state))
              setSheetOpen(false)
            }}
          >
            Reset memorized
          </Pill>
          <Pill
            onClick={() => {
              setFlipped(false)
              setDeckState((state) => restartSameOrder(state, cards))
              setSheetOpen(false)
            }}
          >
            Restart
          </Pill>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={() => {
              setSheetOpen(false)
              onImportNewDeck()
            }}
            className="w-full rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100"
          >
            Import new deck
          </button>
        </div>
      </Sheet>
    </main>
  )
}
