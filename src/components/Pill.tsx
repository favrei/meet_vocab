import type { ButtonHTMLAttributes, ReactNode } from 'react'

type PillProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean
  children: ReactNode
}

export default function Pill({ active = false, children, className = '', ...rest }: PillProps) {
  const base =
    'rounded-full px-3 py-1 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500'
  const tone = active
    ? 'bg-slate-900 text-white hover:bg-slate-700'
    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'

  return (
    <button type="button" className={`${base} ${tone} ${className}`.trim()} {...rest}>
      {children}
    </button>
  )
}
