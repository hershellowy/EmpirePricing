import type { Stage, StageLog } from '../lib/types'

/** Total milliseconds spent in each stage, summed across every visit. */
export function durationsByStage(logs: StageLog[]): Partial<Record<Stage, number>> {
  const totals: Partial<Record<Stage, number>> = {}
  const now = Date.now()

  for (const log of logs) {
    const start = new Date(log.entered_at).getTime()
    const end = log.exited_at ? new Date(log.exited_at).getTime() : now
    totals[log.stage] = (totals[log.stage] ?? 0) + Math.max(0, end - start)
  }

  return totals
}

/** The still-open log (current stage), if any. */
export function currentStageLog(logs: StageLog[]): StageLog | undefined {
  return logs.find((log) => log.exited_at === null)
}

export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  if (minutes < 60) return `${Math.max(1, minutes)}m`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`

  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d`

  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo`

  const years = Math.floor(months / 12)
  const remMonths = months % 12
  return remMonths ? `${years}y ${remMonths}mo` : `${years}y`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
