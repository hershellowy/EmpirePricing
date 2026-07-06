import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import {
  DEFAULT_FIELD_VISIBILITY,
  type FieldVisibility,
  type ToggleableField,
} from '../lib/types'

export function useSettings() {
  const [visibility, setVisibility] = useState<FieldVisibility>(
    DEFAULT_FIELD_VISIBILITY,
  )
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from('settings')
      .select('field_name, visible_to_sub')

    if (error) {
      console.error('Failed to load settings', error)
      setLoading(false)
      return
    }

    const next = { ...DEFAULT_FIELD_VISIBILITY }
    for (const row of data ?? []) {
      next[row.field_name as ToggleableField] = row.visible_to_sub
    }
    setVisibility(next)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const setFieldVisibility = async (field: ToggleableField, value: boolean) => {
    setVisibility((prev) => ({ ...prev, [field]: value }))
    const { error } = await supabase
      .from('settings')
      .update({ visible_to_sub: value, updated_at: new Date().toISOString() })
      .eq('field_name', field)

    if (error) {
      console.error('Failed to update setting', error)
      refresh()
    }
  }

  return { visibility, loading, setFieldVisibility, refresh }
}
