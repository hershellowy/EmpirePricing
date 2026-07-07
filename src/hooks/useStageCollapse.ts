import { useCallback, useEffect, useState } from 'react'
import type { Stage } from '../lib/types'

const STORAGE_KEY = 'empire-projects.stageCollapseOverrides'

type Overrides = Partial<Record<Stage, boolean>>

function readOverrides(): Overrides {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

/**
 * Collapse state per stage: defaults to expanded when a stage has buildings
 * and collapsed when empty, but a manual toggle always wins over that
 * default from then on, persisted in localStorage.
 */
export function useStageCollapse() {
  const [overrides, setOverrides] = useState<Overrides>(() => readOverrides())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
  }, [overrides])

  const isCollapsed = useCallback(
    (stage: Stage, count: number) => overrides[stage] ?? count === 0,
    [overrides],
  )

  const toggle = useCallback(
    (stage: Stage, count: number) => {
      setOverrides((prev) => ({ ...prev, [stage]: !isCollapsed(stage, count) }))
    },
    [isCollapsed],
  )

  return { isCollapsed, toggle }
}
