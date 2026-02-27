import type { RowError, VocabCard } from '../types'

const REQUIRED_HEADERS = ['id', 'jp', 'hira', 'en', 'example', 'translation'] as const
const OPTIONAL_HEADERS = ['romaji', 'zh', 'cat'] as const
const ALL_HEADERS = [...REQUIRED_HEADERS, ...OPTIONAL_HEADERS]

type ParsedRows = {
  rows: string[][]
  error: RowError | null
}

function parseRows(raw: string): ParsedRows {
  const rows: string[][] = []
  const source = raw.replace(/^\uFEFF/, '')

  let row: string[] = []
  let cell = ''
  let inQuotes = false
  let rowNumber = 1

  for (let i = 0; i < source.length; i += 1) {
    const char = source[i]

    if (inQuotes) {
      if (char === '"') {
        if (source[i + 1] === '"') {
          cell += '"'
          i += 1
        } else {
          inQuotes = false
        }
      } else {
        if (char === '\n') {
          rowNumber += 1
        }
        cell += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
      continue
    }

    if (char === ',') {
      row.push(cell)
      cell = ''
      continue
    }

    if (char === '\n' || char === '\r') {
      if (char === '\r' && source[i + 1] === '\n') {
        i += 1
      }
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
      rowNumber += 1
      continue
    }

    cell += char
  }

  if (inQuotes) {
    return {
      rows: [],
      error: { row: rowNumber, message: 'Unclosed quote in CSV input.' },
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell)
    rows.push(row)
  }

  const nonEmptyRows = rows.filter((line) => line.some((value) => value.trim().length > 0))

  return { rows: nonEmptyRows, error: null }
}

function toError(row: number, message: string): RowError {
  return { row, message }
}

export function parseCSV(raw: string): { cards: VocabCard[]; errors: RowError[] } {
  if (raw.trim().length === 0) {
    return { cards: [], errors: [toError(1, 'CSV input is empty.')] }
  }

  const { rows, error } = parseRows(raw)
  if (error) {
    return { cards: [], errors: [error] }
  }

  if (rows.length === 0) {
    return { cards: [], errors: [toError(1, 'CSV input is empty.')] }
  }

  const headerRow = rows[0].map((value) => value.trim())
  const errors: RowError[] = []

  const seenHeaders = new Set<string>()
  for (const column of headerRow) {
    if (seenHeaders.has(column)) {
      errors.push(toError(1, `Duplicate header: ${column}`))
    }
    seenHeaders.add(column)
  }

  for (const required of ALL_HEADERS) {
    if (!seenHeaders.has(required)) {
      errors.push(toError(1, `Missing header: ${required}`))
    }
  }

  for (const column of seenHeaders) {
    if (!ALL_HEADERS.includes(column as (typeof ALL_HEADERS)[number])) {
      errors.push(toError(1, `Unknown header: ${column}`))
    }
  }

  if (errors.length > 0) {
    return { cards: [], errors }
  }

  const headerIndex = new Map<string, number>()
  headerRow.forEach((name, index) => {
    headerIndex.set(name, index)
  })

  const cards: VocabCard[] = []
  const seenIds = new Set<string>()

  for (let i = 1; i < rows.length; i += 1) {
    const rowValues = rows[i]
    const lineNumber = i + 1

    if (rowValues.every((value) => value.trim().length === 0)) {
      continue
    }

    const getValue = (field: (typeof ALL_HEADERS)[number]) => {
      const index = headerIndex.get(field)
      if (index === undefined) {
        return ''
      }
      return (rowValues[index] ?? '').trim()
    }

    const id = getValue('id')
    const jp = getValue('jp')
    const hira = getValue('hira')
    const en = getValue('en')
    const example = getValue('example')
    const translation = getValue('translation')

    const rowIssues: string[] = []

    if (!id) rowIssues.push('id is required')
    if (!jp) rowIssues.push('jp is required')
    if (!hira) rowIssues.push('hira is required')
    if (!en) rowIssues.push('en is required')
    if (!example) rowIssues.push('example is required')
    if (!translation) rowIssues.push('translation is required')

    if (id && seenIds.has(id)) {
      rowIssues.push(`duplicate id: ${id}`)
    }

    if (rowIssues.length > 0) {
      errors.push(toError(lineNumber, rowIssues.join('; ')))
      continue
    }

    seenIds.add(id)

    const romaji = getValue('romaji')
    const zh = getValue('zh')
    const cat = getValue('cat')

    cards.push({
      id,
      jp,
      hira,
      en,
      example,
      translation,
      romaji: romaji || undefined,
      zh: zh || undefined,
      cat: cat || undefined,
    })
  }

  return { cards, errors }
}
