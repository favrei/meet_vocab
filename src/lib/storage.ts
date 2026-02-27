import type { FrontMode, VocabCard } from '../types'
import type { DeckState } from './deck'

const DECK_KEY = 'mv_deck_v1'
const STATE_KEY = 'mv_state_v1'
const FRONT_MODE_KEY = 'mv_front_mode_v1'

function getStorage(): Storage | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null
  }
  return window.localStorage
}

function isCard(value: unknown): value is VocabCard {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Record<string, unknown>
  const required = ['id', 'jp', 'hira', 'en', 'example', 'translation']

  return required.every((field) => typeof candidate[field] === 'string')
}

export function saveDeck(cards: VocabCard[]): void {
  const storage = getStorage()
  if (!storage) {
    return
  }
  storage.setItem(DECK_KEY, JSON.stringify(cards))
}

export function loadDeck(): VocabCard[] | null {
  const storage = getStorage()
  if (!storage) {
    return null
  }

  const raw = storage.getItem(DECK_KEY)
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || !parsed.every(isCard)) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

type StoredDeckState = {
  seed: number
  cursor: number
  memorized: string[]
  hideMemorized: boolean
}

function isStoredDeckState(value: unknown): value is StoredDeckState {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.seed === 'number' &&
    typeof candidate.cursor === 'number' &&
    typeof candidate.hideMemorized === 'boolean' &&
    Array.isArray(candidate.memorized) &&
    candidate.memorized.every((id) => typeof id === 'string')
  )
}

export function saveDeckState(state: DeckState): void {
  const storage = getStorage()
  if (!storage) {
    return
  }

  const stored: StoredDeckState = {
    seed: state.seed,
    cursor: state.cursor,
    memorized: [...state.memorized],
    hideMemorized: state.hideMemorized,
  }

  storage.setItem(STATE_KEY, JSON.stringify(stored))
}

export function loadDeckState(): DeckState | null {
  const storage = getStorage()
  if (!storage) {
    return null
  }

  const raw = storage.getItem(STATE_KEY)
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw)
    if (!isStoredDeckState(parsed)) {
      return null
    }

    return {
      seed: parsed.seed,
      cursor: parsed.cursor,
      memorized: new Set(parsed.memorized),
      hideMemorized: parsed.hideMemorized,
    }
  } catch {
    return null
  }
}

export function saveFrontMode(mode: FrontMode): void {
  const storage = getStorage()
  if (!storage) {
    return
  }

  storage.setItem(FRONT_MODE_KEY, mode)
}

export function loadFrontMode(): FrontMode | null {
  const storage = getStorage()
  if (!storage) {
    return null
  }

  const mode = storage.getItem(FRONT_MODE_KEY)
  if (mode === 'jp' || mode === 'en') {
    return mode
  }

  return null
}

export function clearAll(): void {
  const storage = getStorage()
  if (!storage) {
    return
  }

  storage.removeItem(DECK_KEY)
  storage.removeItem(STATE_KEY)
  storage.removeItem(FRONT_MODE_KEY)
}
