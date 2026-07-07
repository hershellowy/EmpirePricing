import { useState, type ReactNode } from 'react'
import type { Stage } from '../lib/types'
import { STAGE_STYLES } from '../lib/stageStyles'

export function StageSection({
  stage,
  count,
  children,
  defaultOpen = true,
}: {
  stage: Stage
  count: number
  children: ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const style = STAGE_STYLES[stage]

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-3 border-l-4 bg-white px-4 py-3 text-left transition hover:bg-slate-50 ${style.accent} ${open ? 'border-b border-b-slate-100' : ''}`}
      >
        <div className="flex items-center gap-2.5">
          <span className={`h-2 w-2 rounded-full ${style.dot}`} />
          <span className={`font-semibold tracking-tight ${style.text}`}>{stage}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${style.badge}`}>
            {count}
          </span>
        </div>
        <svg
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="p-4">
          {count === 0 ? (
            <p className="py-4 text-center text-sm text-slate-400">
              No buildings in this stage.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {children}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
