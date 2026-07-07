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
        className={`flex h-full w-12 shrink-0 flex-col items-center gap-3 overflow-hidden rounded-xl border border-t-4 border-slate-200 bg-slate-50 py-3 shadow-sm transition hover:bg-slate-100 ${style.topAccent}`}
      >
        <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-xs font-semibold ${style.badge}`}>
          {count}
        </span>
        <span
          className={`flex-1 [writing-mode:vertical-rl] rotate-180 whitespace-nowrap text-sm font-semibold tracking-tight ${style.text}`}
        >
          {stage}
        </span>
        <svg
          className="h-4 w-4 shrink-0 text-slate-400"
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
      className={`flex h-full w-72 shrink-0 flex-col overflow-hidden rounded-xl border border-t-4 border-slate-200 bg-slate-50 shadow-sm ${style.topAccent}`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 border-b border-slate-200 bg-white px-3 py-3 text-left transition hover:bg-slate-50"
      >
        <span className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
        <span className={`flex-1 truncate font-semibold tracking-tight ${style.text}`}>
          {stage}
        </span>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${style.badge}`}>
          {count}
        </span>
        <svg
          className="h-4 w-4 shrink-0 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {count === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">No buildings.</p>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
