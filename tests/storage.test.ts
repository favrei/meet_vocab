import { describe, expect, it } from 'vitest'
import { createInitialDeckState } from '../src/lib/deck'
import {
  clearAll,
  loadDeck,
  loadDeckState,
  loadFrontMode,
  saveDeck,
  saveDeckState,
  saveFrontMode,
} from '../src/lib/storage'
import type { VocabCard } from '../src/types'

const cards: VocabCard[] = [
  {
    id: '1',
    jp: '水',
    hira: 'みず',
    en: 'water',
    example: '水を飲みます。',
    translation: 'I drink water.',
  },
]

describe('storage', () => {
  it('saves and loads deck', () => {
    saveDeck(cards)

    const loaded = loadDeck()

    expect(loaded).toEqual(cards)
  })

  it('saves and loads deck state including memorized set', () => {
    const state = createInitialDeckState(123)
    state.cursor = 2
    state.hideMemorized = true
    state.memorized.add('1')

    saveDeckState(state)
    const loaded = loadDeckState()

    expect(loaded?.seed).toBe(123)
    expect(loaded?.cursor).toBe(2)
    expect(loaded?.hideMemorized).toBe(true)
    expect(loaded?.memorized.has('1')).toBe(true)
  })

  it('stores and loads front mode', () => {
    saveFrontMode('en')

    expect(loadFrontMode()).toBe('en')
  })

  it('clearAll removes all keys', () => {
    saveDeck(cards)
    saveDeckState(createInitialDeckState(111))
    saveFrontMode('jp')

    clearAll()

    expect(loadDeck()).toBeNull()
    expect(loadDeckState()).toBeNull()
    expect(loadFrontMode()).toBeNull()
  })
})
