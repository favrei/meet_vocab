import type { VocabCard } from '../types'

export type DeckState = {
  seed: number
  cursor: number
  memorized: Set<string>
  hideMemorized: boolean
}

export function generateSeed() {
  return Math.floor(Date.now() % 2147483647)
}

export function mulberry32(seed: number): () => number {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let value = Math.imul(t ^ (t >>> 15), 1 | t)
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffleWithSeed<T>(items: T[], seed: number): T[] {
  const rng = mulberry32(seed)
  const shuffled = [...items]

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled
}

export function createInitialDeckState(seed: number): DeckState {
  return {
    seed,
    cursor: 0,
    memorized: new Set<string>(),
    hideMemorized: true,
  }
}

export function activeOrder(cards: VocabCard[], state: DeckState): VocabCard[] {
  const shuffled = shuffleWithSeed(cards, state.seed)
  if (!state.hideMemorized) {
    return shuffled
  }

  return shuffled.filter((card) => !state.memorized.has(card.id))
}

export function clampCursor(state: DeckState, cards: VocabCard[]): DeckState {
  const active = activeOrder(cards, state)
  if (active.length === 0) {
    return {
      ...state,
      cursor: 0,
    }
  }

  return {
    ...state,
    cursor: state.cursor % active.length,
  }
}

export function advance(state: DeckState, cards: VocabCard[]): DeckState {
  const active = activeOrder(cards, state)
  if (active.length === 0) {
    return {
      ...state,
      cursor: 0,
    }
  }

  return {
    ...state,
    cursor: (state.cursor + 1) % active.length,
  }
}

export function markMemorized(state: DeckState, cardId: string, cards: VocabCard[]): DeckState {
  const memorized = new Set(state.memorized)
  memorized.add(cardId)

  return clampCursor(
    {
      ...state,
      memorized,
    },
    cards,
  )
}

export function resetMemorized(state: DeckState): DeckState {
  return {
    ...state,
    cursor: 0,
    memorized: new Set<string>(),
  }
}

export function reshuffle(state: DeckState, nextSeed: number): DeckState {
  return {
    ...state,
    seed: nextSeed,
    cursor: 0,
  }
}

export function restartSameOrder(state: DeckState, cards: VocabCard[]): DeckState {
  return clampCursor(
    {
      ...state,
      cursor: 0,
    },
    cards,
  )
}

export function setHideMemorized(state: DeckState, hideMemorized: boolean, cards: VocabCard[]): DeckState {
  return clampCursor(
    {
      ...state,
      hideMemorized,
    },
    cards,
  )
}
