import type { ReactNode } from 'react'
import type { Stage } from '../lib/types'
import { STAGE_STYLES } from '../lib/stageStyles'

export function KanbanColumn({
  stage,
  count,
  collapsed,
  onToggle,
  children,
}: {
  stage: Stage
  count: number
  collapsed: boolean
  onToggle: () => void
  children: ReactNode
}) {
  const style = STAGE_STYLES[stage]

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className={`flex h-full w-20 shrink-0 flex-col items-center gap-2 overflow-hidden rounded-xl border border-t-4 border-slate-200 bg-slate-50 px-1 py-3 shadow-sm transition hover:bg-slate-100 ${style.topAccent}`}
      >
        <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${style.badge}`}>
          {count}
        </span>
        <span
          className={`text-center text-[11px] leading-tight font-semibold tracking-tight ${style.text}`}
        >
          {stage}
        </span>
        <svg
          className="mt-auto h-3.5 w-3.5 shrink-0 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    )
  }

  return (
    <div
      className={`flex h-full w-36 shrink-0 flex-col overflow-hidden rounded-xl border border-t-4 border-slate-200 bg-slate-50 shadow-sm ${style.topAccent}`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex items-start gap-1.5 border-b border-slate-200 bg-white px-2 py-2 text-left transition hover:bg-slate-50"
      >
        <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`} />
        <span className={`flex-1 text-xs leading-tight font-semibold tracking-tight ${style.text}`}>
          {stage}
        </span>
        <span className={`mt-0.5 shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${style.badge}`}>
          {count}
        </span>
        <svg
          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className="flex-1 space-y-2 overflow-y-auto p-2">
        {count === 0 ? (
          <p className="py-6 text-center text-xs text-slate-400">No buildings.</p>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
