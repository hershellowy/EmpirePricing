import { useMemo, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useBuildings } from '../hooks/useBuildings'
import { useSettings } from '../hooks/useSettings'
import { STAGES, type Building } from '../lib/types'
import { KanbanColumn } from '../components/KanbanColumn'
import { BuildingCard } from '../components/BuildingCard'
import { BuildingModal } from '../components/BuildingModal'

export function Dashboard() {
  const { isAdmin } = useAuth()
  const {
    buildings,
    stageLogs,
    loading,
    error,
    addBuilding,
    updateBuilding,
    deleteBuilding,
  } = useBuildings()
  const { visibility } = useSettings()

  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<Building | undefined>(undefined)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return buildings
    return buildings.filter((b) => b.name.toLowerCase().includes(term))
  }, [buildings, search])

  const byStage = useMemo(() => {
    const grouped: Record<string, Building[]> = {}
    for (const stage of STAGES) grouped[stage] = []
    for (const b of filtered) grouped[b.stage]?.push(b)
    return grouped
  }, [filtered])

  const openCreate = () => {
    setSelected(undefined)
    setModalOpen(true)
  }

  const openBuilding = (b: Building) => {
    setSelected(b)
    setModalOpen(true)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy-200 border-t-electric-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        Failed to load buildings: {error}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-navy-900">Deal Pipeline</h1>
          <p className="text-sm text-slate-500">
            {buildings.length} building{buildings.length === 1 ? '' : 's'} tracked
          </p>
        </div>

        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search buildings…"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-electric-400 focus:outline-none focus:ring-2 focus:ring-electric-100 sm:w-56"
          />
          {isAdmin && (
            <button
              type="button"
              onClick={openCreate}
              className="whitespace-nowrap rounded-lg bg-electric-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-electric-600"
            >
              + Add Building
            </button>
          )}
        </div>
      </div>

      <div className="flex h-[calc(100vh-13rem)] gap-4 overflow-x-auto pb-2">
        {STAGES.map((stage) => (
          <KanbanColumn key={stage} stage={stage} count={byStage[stage]?.length ?? 0}>
            {byStage[stage]?.map((b) => (
              <BuildingCard
                key={b.id}
                building={b}
                logs={stageLogs[b.id] ?? []}
                isAdmin={isAdmin}
                visibility={visibility}
                onClick={() => openBuilding(b)}
              />
            ))}
          </KanbanColumn>
        ))}
      </div>

      <BuildingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        building={selected}
        logs={selected ? stageLogs[selected.id] ?? [] : []}
        isAdmin={isAdmin}
        visibility={visibility}
        onCreate={addBuilding}
        onUpdate={updateBuilding}
        onDelete={deleteBuilding}
      />
    </div>
  )
}
