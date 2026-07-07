import type { Building, FieldVisibility, StageLog } from '../lib/types'
import { STAGE_STYLES } from '../lib/stageStyles'
import { currentStageLog, formatDate, formatDuration } from '../utils/time'

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
  maximumFractionDigits: 0,
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
  const style = STAGE_STYLES[building.stage]

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-electric-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-navy-900">{building.name}</h3>
        {show('stage') && (
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${style.badge}`}
          >
            {building.stage}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        {show('service_type') && (
          <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
            {building.service_type}
          </span>
        )}
        {show('date_logged') && current && (
          <span>Since {formatDate(current.entered_at)}</span>
        )}
        {show('time_in_stage') && current && (
          <span className="font-medium text-electric-600">
            {formatDuration(Date.now() - new Date(current.entered_at).getTime())} in stage
          </span>
        )}
      </div>

      {(show('sub_price') || show('customer_price')) && (
        <div className="flex gap-4 border-t border-slate-100 pt-3 text-sm">
          {show('sub_price') && (
            <div>
              <p className="text-xs text-slate-400">Sub Price</p>
              <p className="font-semibold text-navy-800">
                {building.sub_price != null ? currency.format(building.sub_price) : '—'}
              </p>
            </div>
          )}
          {show('customer_price') && (
            <div>
              <p className="text-xs text-slate-400">Customer Price</p>
              <p className="font-semibold text-navy-800">
                {building.customer_price != null
                  ? currency.format(building.customer_price)
                  : '—'}
              </p>
            </div>
          )}
        </div>
      )}

      {show('notes') && building.notes && (
        <p className="line-clamp-2 text-xs text-slate-500">{building.notes}</p>
      )}
    </button>
  )
}
