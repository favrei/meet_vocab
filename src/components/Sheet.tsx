import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'

type SheetProps = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export default function Sheet({ open, title, onClose, children }: SheetProps) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-40 bg-black/35"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Close options"
          />
          <motion.section
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-3xl rounded-t-2xl border border-slate-200 bg-white p-5 shadow-md"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-300" />
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
              <button type="button" onClick={onClose} className="text-sm text-slate-600 hover:text-slate-900">
                Close
              </button>
            </div>
            <div className="mt-4 space-y-4">{children}</div>
          </motion.section>
        </>
      ) : null}
    </AnimatePresence>
  )
}
