type ProgressBarProps = {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const safeTotal = Math.max(total, 1)
  const percent = Math.min(100, Math.max(0, (current / safeTotal) * 100))

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs text-slate-600">
        <span>Progress</span>
        <span>
          {Math.min(current, total)} / {total}
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-slate-900 transition-[width] duration-200"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
