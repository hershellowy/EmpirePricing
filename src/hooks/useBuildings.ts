import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Building, ServiceType, Stage, StageLog } from '../lib/types'

export interface NewBuildingInput {
  name: string
  service_type: ServiceType
  stage: Stage
  sub_price: number | null
  customer_price: number | null
  notes: string | null
}

export type BuildingUpdateInput = Partial<NewBuildingInput>

export function useBuildings() {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [stageLogs, setStageLogs] = useState<Record<string, StageLog[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    const [buildingsRes, logsRes] = await Promise.all([
      supabase
        .from('buildings')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase
        .from('stage_logs')
        .select('*')
        .order('entered_at', { ascending: true }),
    ])

    if (buildingsRes.error) {
      setError(buildingsRes.error.message)
      setLoading(false)
      return
    }
    if (logsRes.error) {
      setError(logsRes.error.message)
      setLoading(false)
      return
    }

    setBuildings(buildingsRes.data ?? [])

    const grouped: Record<string, StageLog[]> = {}
    for (const log of logsRes.data ?? []) {
      ;(grouped[log.building_id] ??= []).push(log)
    }
    setStageLogs(grouped)
    setError(null)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()

    const channel = supabase
      .channel('buildings-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'buildings' },
        () => refresh(),
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'stage_logs' },
        () => refresh(),
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [refresh])

  const addBuilding = async (input: NewBuildingInput) => {
    const { error: insertError } = await supabase
      .from('buildings')
      .insert(input)
    if (insertError) throw insertError
    await refresh()
  }

  const updateBuilding = async (id: string, input: BuildingUpdateInput) => {
    const { error: updateError } = await supabase
      .from('buildings')
      .update(input)
      .eq('id', id)
    if (updateError) throw updateError
    await refresh()
  }

  const deleteBuilding = async (id: string) => {
    const { error: deleteError } = await supabase
      .from('buildings')
      .delete()
      .eq('id', id)
    if (deleteError) throw deleteError
    await refresh()
  }

  return {
    buildings,
    stageLogs,
    loading,
    error,
    refresh,
    addBuilding,
    updateBuilding,
    deleteBuilding,
  }
}
