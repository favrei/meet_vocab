import { describe, expect, it } from 'vitest'
import { parseCSV } from '../src/lib/csv'

describe('parseCSV', () => {
  it('parses valid csv when headers are reordered', () => {
    const csv = [
      'en,id,jp,hira,example,translation,romaji,zh,cat',
      'water,1,水,みず,水を飲みます。,I drink water.,mizu,水, noun',
    ].join('\n')

    const result = parseCSV(csv)

    expect(result.errors).toHaveLength(0)
    expect(result.cards).toHaveLength(1)
    expect(result.cards[0]).toMatchObject({
      id: '1',
      jp: '水',
      hira: 'みず',
      en: 'water',
      romaji: 'mizu',
      zh: '水',
      cat: 'noun',
    })
  })

  it('supports quoted fields with commas', () => {
    const csv = [
      'id,jp,hira,en,example,translation,romaji,zh,cat',
      '1,挨拶,あいさつ,greeting,"こんにちは、元気ですか。","Hello, how are you?",aisatsu,,noun',
    ].join('\n')

    const result = parseCSV(csv)

    expect(result.errors).toHaveLength(0)
    expect(result.cards[0]?.example).toBe('こんにちは、元気ですか。')
    expect(result.cards[0]?.translation).toBe('Hello, how are you?')
  })

  it('returns row-level errors for missing required fields', () => {
    const csv = [
      'id,jp,hira,en,example,translation,romaji,zh,cat',
      ',水,みず,water,水を飲みます。,I drink water.,,,',
    ].join('\n')

    const result = parseCSV(csv)

    expect(result.cards).toHaveLength(0)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]).toMatchObject({ row: 2 })
    expect(result.errors[0]?.message).toContain('id is required')
  })

  it('rejects duplicate ids', () => {
    const csv = [
      'id,jp,hira,en,example,translation,romaji,zh,cat',
      '1,水,みず,water,水を飲みます。,I drink water.,,,',
      '1,火,ひ,fire,火を見ます。,I see fire.,,,',
    ].join('\n')

    const result = parseCSV(csv)

    expect(result.cards).toHaveLength(1)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]).toMatchObject({ row: 3 })
    expect(result.errors[0]?.message).toContain('duplicate id: 1')
  })

  it('parses csv with only required headers (optional columns omitted)', () => {
    const csv = ['id,jp,hira,en,example,translation', '1,水,みず,water,水を飲みます。,I drink water.'].join('\n')

    const result = parseCSV(csv)

    expect(result.errors).toHaveLength(0)
    expect(result.cards).toHaveLength(1)
    expect(result.cards[0]).toMatchObject({
      id: '1',
      jp: '水',
      hira: 'みず',
      en: 'water',
    })
    expect(result.cards[0]?.romaji).toBeUndefined()
    expect(result.cards[0]?.zh).toBeUndefined()
    expect(result.cards[0]?.cat).toBeUndefined()
  })

  it('fails when required headers are missing', () => {
    const csv = ['id,jp,hira,example,translation', '1,水,みず,水を飲みます。,I drink water.'].join('\n')

    const result = parseCSV(csv)

    expect(result.cards).toHaveLength(0)
    expect(result.errors[0]).toMatchObject({ row: 1 })
    expect(result.errors[0]?.message).toContain('Missing header: en')
  })
})
