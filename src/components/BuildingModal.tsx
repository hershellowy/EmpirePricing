import { useEffect, useState } from 'react'
import type {
  Building,
  FieldVisibility,
  ServiceType,
  Stage,
  StageLog,
} from '../lib/types'
import { SERVICE_TYPES, STAGES } from '../lib/types'
import { STAGE_STYLES } from '../lib/stageStyles'
import { durationsByStage, formatDate, formatDuration } from '../utils/time'
import type { BuildingUpdateInput, NewBuildingInput } from '../hooks/useBuildings'

interface BuildingModalProps {
  open: boolean
  onClose: () => void
  building?: Building
  logs: StageLog[]
  isAdmin: boolean
  visibility: FieldVisibility
  onCreate: (input: NewBuildingInput) => Promise<void>
  onUpdate: (id: string, input: BuildingUpdateInput) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

const emptyForm: NewBuildingInput = {
  name: '',
  service_type: 'Windows',
  stage: 'Targeting',
  sub_price: null,
  customer_price: null,
  notes: '',
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function BuildingModal({
  open,
  onClose,
  building,
  logs,
  isAdmin,
  visibility,
  onCreate,
  onUpdate,
  onDelete,
}: BuildingModalProps) {
  const [form, setForm] = useState<NewBuildingInput>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setConfirmDelete(false)
    setError(null)
    if (building) {
      setForm({
        name: building.name,
        service_type: building.service_type,
        stage: building.stage,
        sub_price: building.sub_price,
        customer_price: building.customer_price,
        notes: building.notes ?? '',
      })
    } else {
      setForm(emptyForm)
    }
  }, [open, building])

  if (!open) return null

  const show = (field: keyof FieldVisibility) => isAdmin || visibility[field]
  const editable = isAdmin
  const durations = durationsByStage(logs)

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      if (building) {
        await onUpdate(building.id, {
          ...form,
          notes: form.notes?.trim() ? form.notes : null,
        })
      } else {
        await onCreate({
          ...form,
          notes: form.notes?.trim() ? form.notes : null,
        })
      }
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save building.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!building) return
    setSaving(true)
    setError(null)
    try {
      await onDelete(building.id)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete building.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-navy-900">
            {building ? (editable ? 'Edit Building' : building.name) : 'Add Building'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          {editable ? (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">
                Building Name
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-electric-400 focus:outline-none focus:ring-2 focus:ring-electric-100"
                placeholder="e.g. 123 Main St Office Tower"
              />
            </div>
          ) : null}

          {show('service_type') && (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">
                Service Type
              </label>
              {editable ? (
                <select
                  value={form.service_type}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, service_type: e.target.value as ServiceType }))
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-electric-400 focus:outline-none focus:ring-2 focus:ring-electric-100"
                >
                  {SERVICE_TYPES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-navy-800">{building?.service_type}</p>
              )}
            </div>
          )}

          {show('stage') && (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">
                Current Stage
              </label>
              {editable ? (
                <select
                  value={form.stage}
                  onChange={(e) => setForm((f) => ({ ...f, stage: e.target.value as Stage }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-electric-400 focus:outline-none focus:ring-2 focus:ring-electric-100"
                >
                  {STAGES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              ) : (
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${STAGE_STYLES[building!.stage].badge}`}
                >
                  {building?.stage}
                </span>
              )}
            </div>
          )}

          {editable && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  Sub Price
                </label>
                <input
                  type="number"
                  value={form.sub_price ?? ''}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      sub_price: e.target.value === '' ? null : Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-electric-400 focus:outline-none focus:ring-2 focus:ring-electric-100"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  Customer Price
                </label>
                <input
                  type="number"
                  value={form.customer_price ?? ''}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      customer_price: e.target.value === '' ? null : Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-electric-400 focus:outline-none focus:ring-2 focus:ring-electric-100"
                  placeholder="0.00"
                />
              </div>
            </div>
          )}

          {!editable && (show('sub_price') || show('customer_price')) && (
            <div className="grid grid-cols-2 gap-4">
              {show('sub_price') && (
                <div>
                  <p className="text-xs text-slate-400">Sub Price</p>
                  <p className="font-semibold text-navy-800">
                    {building?.sub_price != null ? currency.format(building.sub_price) : '—'}
                  </p>
                </div>
              )}
              {show('customer_price') && (
                <div>
                  <p className="text-xs text-slate-400">Customer Price</p>
                  <p className="font-semibold text-navy-800">
                    {building?.customer_price != null
                      ? currency.format(building.customer_price)
                      : '—'}
                  </p>
                </div>
              )}
            </div>
          )}

          {show('notes') && (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Notes</label>
              {editable ? (
                <textarea
                  value={form.notes ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-electric-400 focus:outline-none focus:ring-2 focus:ring-electric-100"
                />
              ) : (
                <p className="whitespace-pre-wrap text-sm text-navy-800">
                  {building?.notes || '—'}
                </p>
              )}
            </div>
          )}

          {building && (show('date_logged') || show('time_in_stage')) && logs.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium text-slate-500">Stage History</p>
              <div className="space-y-1.5 rounded-lg bg-slate-50 p-3">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-navy-800">{log.stage}</span>
                    <span className="text-slate-500">
                      {show('date_logged') && formatDate(log.entered_at)}
                      {show('date_logged') && show('time_in_stage') && ' · '}
                      {show('time_in_stage') &&
                        formatDuration(durations[log.stage] ?? 0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          )}
        </div>

        {editable && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
            {building ? (
              confirmDelete ? (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500">Delete this building?</span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={saving}
                    className="rounded-md bg-rose-600 px-3 py-1.5 font-medium text-white hover:bg-rose-700 disabled:opacity-50"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="rounded-md px-3 py-1.5 font-medium text-slate-500 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="text-sm font-medium text-rose-600 hover:text-rose-700"
                >
                  Delete
                </button>
              )
            ) : (
              <span />
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !form.name.trim()}
              className="rounded-lg bg-electric-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-electric-600 disabled:opacity-50"
            >
              {saving ? 'Saving…' : building ? 'Save Changes' : 'Add Building'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
