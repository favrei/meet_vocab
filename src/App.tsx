import { useState } from 'react'
import ImportScreen from './screens/ImportScreen'
import DeckScreen from './screens/DeckScreen'
import { clearAll, loadDeck } from './lib/storage'
import type { VocabCard } from './types'

type Screen = 'import' | 'deck'

function initialCards(): VocabCard[] | null {
  const saved = loadDeck()
  if (!saved || saved.length === 0) {
    return null
  }
  return saved
}

export default function App() {
  const [{ cards, screen }, setAppState] = useState<{ cards: VocabCard[] | null; screen: Screen }>(() => {
    const saved = initialCards()
    return {
      cards: saved,
      screen: saved ? 'deck' : 'import',
    }
  })

  const hasDeck = (cards?.length ?? 0) > 0

  if (screen === 'deck' && hasDeck && cards) {
    return (
      <DeckScreen
        cards={cards}
        onImportNewDeck={() => {
          clearAll()
          setAppState({
            cards: null,
            screen: 'import',
          })
        }}
      />
    )
  }

  return (
    <ImportScreen
      onImportSuccess={(nextCards) => {
        setAppState({
          cards: nextCards,
          screen: 'deck',
        })
      }}
    />
  )
}
