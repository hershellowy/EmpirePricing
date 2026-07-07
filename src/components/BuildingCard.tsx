import type { Building, FieldVisibility, StageLog } from '../lib/types'
import { currentStageLog, formatDuration } from '../utils/time'

interface BuildingCardProps {
  building: Building
  logs: StageLog[]
  isAdmin: boolean
  visibility: FieldVisibility
  onClick: () => void
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function BuildingCard({
  building,
  logs,
  isAdmin,
  visibility,
  onClick,
}: BuildingCardProps) {
  const show = (field: keyof FieldVisibility) => isAdmin || visibility[field]
  const current = currentStageLog(logs)

  const showSub = show('sub_price') && building.sub_price != null
  const showCustomer = show('customer_price') && building.customer_price != null
  const showTime = show('time_in_stage') && current != null

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col gap-1 rounded-lg border border-slate-200 bg-white p-2.5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-electric-300 hover:shadow-md"
    >
      <h3 className="text-sm leading-snug font-bold text-navy-900">{building.name}</h3>

      {(showSub || showCustomer || showTime) && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] font-medium text-slate-400">
          {showSub && <span>S {currency.format(building.sub_price!)}</span>}
          {showCustomer && <span>C {currency.format(building.customer_price!)}</span>}
          {showTime && current && (
            <span className="text-electric-500">
              {formatDuration(Date.now() - new Date(current.entered_at).getTime())}
            </span>
          )}
        </div>
      )}
    </button>
  )
}
