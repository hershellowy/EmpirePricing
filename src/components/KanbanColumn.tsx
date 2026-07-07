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

  const chevron = collapsed ? (
    <svg
      className={`mt-auto mb-2 h-3.5 w-3.5 shrink-0 self-center ${style.barText} opacity-70`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  ) : (
    <svg
      className={`h-3.5 w-3.5 shrink-0 ${style.barText} opacity-70`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className="flex h-full w-11 shrink-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm transition hover:brightness-95"
      >
        <div className={`flex min-w-0 shrink-0 flex-col gap-1 px-1 py-2 ${style.bar}`}>
          <span
            className={`min-w-0 text-center text-[11px] leading-tight font-semibold break-words ${style.barText}`}
          >
            {stage}
          </span>
          <span className={`text-center text-xs font-bold ${style.barText}`}>{count}</span>
        </div>
        {chevron}
      </button>
    )
  }

  return (
    <div className="flex h-full w-36 shrink-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className={`flex shrink-0 flex-col gap-1 px-2 py-2 text-left transition hover:brightness-95 ${style.bar}`}
      >
        <div className="flex min-w-0 items-start justify-between gap-1">
          <span className={`min-w-0 flex-1 text-xs leading-tight font-semibold break-words ${style.barText}`}>
            {stage}
          </span>
          {chevron}
        </div>
        <span className={`text-xs font-bold ${style.barText}`}>{count}</span>
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
