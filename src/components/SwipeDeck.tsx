import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { FrontMode, VocabCard } from '../types'
import Card from './Card'

type SwipeDirection = 'left' | 'right'

type SwipeDeckProps = {
  currentCard: VocabCard | null
  nextCard: VocabCard | null
  frontMode: FrontMode
  isMemorized: boolean
  flipped: boolean
  onFlip: () => void
  onSwipe: (direction: SwipeDirection) => void
}

const SWIPE_THRESHOLD = 110
const TAP_MAX_MOVEMENT = 10
const TAP_MAX_DURATION_MS = 260
const FLIP_LOCK_MS = 220

export default function SwipeDeck({
  currentCard,
  nextCard,
  frontMode,
  isMemorized,
  flipped,
  onFlip,
  onSwipe,
}: SwipeDeckProps) {
  const [dragX, setDragX] = useState(0)
  const [swiping, setSwiping] = useState(false)
  const [previewNextCard, setPreviewNextCard] = useState<VocabCard | null>(nextCard)
  const pointerStartRef = useRef<{ x: number; y: number; at: number } | null>(null)
  const movedRef = useRef(false)
  const flipLockedUntilRef = useRef(0)
  const didSwipeRef = useRef(false)

  useEffect(() => {
    if (!swiping) {
      setPreviewNextCard(nextCard)
    }
  }, [nextCard, swiping])

  useEffect(() => {
    flipLockedUntilRef.current = Date.now() + FLIP_LOCK_MS
    movedRef.current = false
    pointerStartRef.current = null
    setDragX(0)
  }, [currentCard?.id])

  const keepHintOpacity = useMemo(() => {
    if (dragX <= 0) {
      return 0
    }
    return Math.min(1, dragX / SWIPE_THRESHOLD)
  }, [dragX])

  const memorizedHintOpacity = useMemo(() => {
    if (dragX >= 0) {
      return 0
    }
    return Math.min(1, Math.abs(dragX) / SWIPE_THRESHOLD)
  }, [dragX])
  const backdropCard = swiping ? previewNextCard : nextCard

  if (!currentCard) {
    return (
      <div className="mx-auto w-full max-w-[30rem] rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        No active card.
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[30rem]">
      <div className="relative isolate h-[min(60svh,32rem)] min-h-[22rem] sm:h-[min(72vh,40rem)] sm:min-h-[30rem]">
        {backdropCard ? (
          <motion.div
            key={backdropCard.id}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0"
            initial={{ y: 8, opacity: 0.75 }}
            animate={{
              y: swiping ? 0 : 8,
              opacity: swiping ? 1 : 0.75,
            }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
          >
            <Card card={backdropCard} flipped={false} isMemorized={false} frontMode={frontMode} />
          </motion.div>
        ) : null}

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
          <div
            className="absolute left-3 top-[23%] -rotate-12 rounded-lg border border-slate-300 bg-slate-900/90 px-3 py-1.5 text-xs font-semibold tracking-[0.16em] text-white transition-opacity"
            style={{ opacity: memorizedHintOpacity }}
          >
            MEMORIZED
          </div>
          <div
            className="absolute right-3 top-[23%] rotate-12 rounded-lg border border-slate-200 bg-white/95 px-3 py-1.5 text-xs font-semibold tracking-[0.16em] text-slate-700 transition-opacity"
            style={{ opacity: keepHintOpacity }}
          >
            KEEP
          </div>
        </div>

        <AnimatePresence
          initial={false}
          mode="wait"
          onExitComplete={() => {
            didSwipeRef.current = swiping
            setSwiping(false)
          }}
        >
          <motion.div
            key={currentCard.id}
            drag="x"
            dragElastic={0.16}
            dragConstraints={{ left: 0, right: 0 }}
            onPointerDown={(event) => {
              pointerStartRef.current = { x: event.clientX, y: event.clientY, at: Date.now() }
              movedRef.current = false
            }}
            onPointerUp={(event) => {
              const start = pointerStartRef.current
              pointerStartRef.current = null

              if (!start || swiping) {
                return
              }

              if (Date.now() < flipLockedUntilRef.current) {
                return
              }

              const elapsed = Date.now() - start.at
              const movedX = Math.abs(event.clientX - start.x)
              const movedY = Math.abs(event.clientY - start.y)
              if (movedRef.current || elapsed > TAP_MAX_DURATION_MS || movedX > TAP_MAX_MOVEMENT || movedY > TAP_MAX_MOVEMENT) {
                return
              }

              onFlip()
            }}
            onDragStart={() => {
              movedRef.current = true
            }}
            onDrag={(event, info) => {
              event.preventDefault()
              setDragX(info.offset.x)
              if (Math.abs(info.offset.x) > TAP_MAX_MOVEMENT) {
                movedRef.current = true
              }
            }}
            onDragEnd={(event, info) => {
              event.preventDefault()
              if (swiping) {
                return
              }

              if (info.offset.x > SWIPE_THRESHOLD) {
                setSwiping(true)
                flipLockedUntilRef.current = Date.now() + FLIP_LOCK_MS
                setPreviewNextCard(nextCard)
                onSwipe('right')
              } else if (info.offset.x < -SWIPE_THRESHOLD) {
                setSwiping(true)
                flipLockedUntilRef.current = Date.now() + FLIP_LOCK_MS
                setPreviewNextCard(nextCard)
                onSwipe('left')
              }

              setDragX(0)
              pointerStartRef.current = null
            }}
            initial={didSwipeRef.current ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.98, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, x: dragX >= 0 ? 220 : -220 }}
            transition={{ duration: 0.16 }}
            className="relative z-10 h-full cursor-grab active:cursor-grabbing"
          >
            <Card card={currentCard} flipped={flipped} isMemorized={isMemorized} frontMode={frontMode} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
