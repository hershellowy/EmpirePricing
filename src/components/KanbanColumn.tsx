import type { ReactNode } from 'react'
import type { Stage } from '../lib/types'
import { STAGE_STYLES } from '../lib/stageStyles'

export function KanbanColumn({
  stage,
  count,
  children,
}: {
  stage: Stage
  count: number
  children: ReactNode
}) {
  const style = STAGE_STYLES[stage]

  return (
    <div
      className={`flex h-full w-72 shrink-0 flex-col overflow-hidden rounded-xl border border-t-4 border-slate-200 bg-slate-50 shadow-sm ${style.topAccent}`}
    >
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-3 py-3">
        <span className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
        <span className={`flex-1 truncate font-semibold tracking-tight ${style.text}`}>
          {stage}
        </span>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${style.badge}`}>
          {count}
        </span>
      </div>

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
