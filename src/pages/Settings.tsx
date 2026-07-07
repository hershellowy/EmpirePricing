import { useSettings } from '../hooks/useSettings'
import { FIELD_LABELS, TOGGLEABLE_FIELDS } from '../lib/types'

export function Settings() {
  const { visibility, loading, setFieldVisibility } = useSettings()

  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-navy-900">Settings</h1>
        <p className="text-sm text-slate-500">
          Control which fields subcontractors can see. Admins always see every field.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-navy-200 border-t-electric-500" />
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {TOGGLEABLE_FIELDS.map((field) => (
              <li key={field} className="flex items-center justify-between px-5 py-4">
                <span className="text-sm font-medium text-navy-800">
                  {FIELD_LABELS[field]}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={visibility[field]}
                  onClick={() => setFieldVisibility(field, !visibility[field])}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                    visibility[field] ? 'bg-electric-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      visibility[field] ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-xs text-slate-400">
        Visible to subs = on. Hidden fields are stripped from both the pipeline cards and
        building detail view for the Sub role.
      </p>
    </div>
  )
}
