export type VocabCard = {
  id: string
  jp: string
  hira: string
  en: string
  example: string
  translation: string
  romaji?: string
  zh?: string
  cat?: string
}

export type RowError = {
  row: number
  message: string
}

export type FrontMode = 'jp' | 'en'
