import { describe, expect, it } from 'vitest'
import {
  activeOrder,
  advance,
  createInitialDeckState,
  markMemorized,
  resetMemorized,
  reshuffle,
  restartSameOrder,
  setHideMemorized,
  shuffleWithSeed,
} from '../src/lib/deck'
import type { VocabCard } from '../src/types'

const cards: VocabCard[] = [
  { id: '1', jp: '水', hira: 'みず', en: 'water', example: '水を飲みます。', translation: 'I drink water.' },
  { id: '2', jp: '火', hira: 'ひ', en: 'fire', example: '火を見ます。', translation: 'I see fire.' },
  { id: '3', jp: '木', hira: 'き', en: 'tree', example: '木を見ます。', translation: 'I see a tree.' },
]

describe('deck engine', () => {
  it('shuffles deterministically by seed', () => {
    const first = shuffleWithSeed(cards, 123).map((card) => card.id)
    const second = shuffleWithSeed(cards, 123).map((card) => card.id)
    const third = shuffleWithSeed(cards, 999).map((card) => card.id)

    expect(first).toEqual(second)
    expect(first).not.toEqual(third)
  })

  it('drops memorized cards from active order', () => {
    let state = createInitialDeckState(42)
    expect(state.hideMemorized).toBe(true)

    const firstCardId = activeOrder(cards, state)[0]!.id

    state = markMemorized(state, firstCardId, cards)

    const filtered = activeOrder(cards, state)

    expect(filtered).toHaveLength(2)
    expect(filtered.map((card) => card.id)).not.toContain(firstCardId)
  })

  it('keeps memorized cards in active order when hideMemorized is off', () => {
    let state = createInitialDeckState(42)
    state = setHideMemorized(state, false, cards)

    const firstCardId = activeOrder(cards, state)[0]!.id
    state = markMemorized(state, firstCardId, cards)

    const active = activeOrder(cards, state)
    expect(active).toHaveLength(3)
    expect(active.map((card) => card.id)).toContain(firstCardId)
  })

  it('advance wraps cursor while cards remain active', () => {
    let state = createInitialDeckState(42)

    state = advance(state, cards)
    state = advance(state, cards)
    state = advance(state, cards)

    expect(state.cursor).toBe(0)
  })

  it('markMemorized keeps cursor valid while shrinking active deck', () => {
    let state = createInitialDeckState(42)

    const first = activeOrder(cards, state)
    state = markMemorized(state, first[0]!.id, cards)

    const second = activeOrder(cards, state)
    state = markMemorized(state, second[state.cursor]!.id, cards)

    const third = activeOrder(cards, state)
    state = markMemorized(state, third[state.cursor]!.id, cards)

    expect(activeOrder(cards, state)).toHaveLength(0)
    expect(state.cursor).toBe(0)
  })

  it('restart, reshuffle, and reset helpers keep behavior stable', () => {
    let state = createInitialDeckState(7)
    const firstOrder = activeOrder(cards, state).map((card) => card.id)

    state = advance(state, cards)
    state = markMemorized(state, firstOrder[0]!, cards)

    state = restartSameOrder(state, cards)
    expect(state.cursor).toBe(0)

    state = reshuffle(state, 99)
    expect(state.cursor).toBe(0)
    expect(activeOrder(cards, state).map((card) => card.id)).not.toEqual(firstOrder)

    state = resetMemorized(state)
    expect(state.memorized.size).toBe(0)
    expect(state.cursor).toBe(0)
  })
})
