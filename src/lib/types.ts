export const STAGES = [
  'Targeting',
  'Pending Pricing',
  'Pending Proposal',
  'Submitted',
  'Won',
  'Lost',
  'Executed',
] as const

export type Stage = (typeof STAGES)[number]

export const SERVICE_TYPES = ['Windows', 'Facade', 'Windows + Facade'] as const

export type ServiceType = (typeof SERVICE_TYPES)[number]

export type AppRole = 'admin' | 'sub'

export interface Building {
  id: string
  name: string
  service_type: ServiceType
  stage: Stage
  sub_price: number | null
  customer_price: number | null
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface StageLog {
  id: string
  building_id: string
  stage: Stage
  entered_at: string
  exited_at: string | null
}

export interface UserRole {
  user_id: string
  email: string
  role: AppRole
  created_at: string
}

/** Fields whose visibility to the `sub` role can be toggled from Settings. */
export const TOGGLEABLE_FIELDS = [
  'service_type',
  'stage',
  'date_logged',
  'time_in_stage',
  'sub_price',
  'customer_price',
  'notes',
] as const

export type ToggleableField = (typeof TOGGLEABLE_FIELDS)[number]

export const FIELD_LABELS: Record<ToggleableField, string> = {
  service_type: 'Service Type',
  stage: 'Current Stage',
  date_logged: 'Date Logged per Stage',
  time_in_stage: 'Time Spent in Stage',
  sub_price: 'Sub Price',
  customer_price: 'Customer Price',
  notes: 'Notes',
}

export interface SettingRow {
  field_name: ToggleableField
  visible_to_sub: boolean
  updated_at: string
}

export type FieldVisibility = Record<ToggleableField, boolean>

export const DEFAULT_FIELD_VISIBILITY: FieldVisibility = {
  service_type: true,
  stage: true,
  date_logged: true,
  time_in_stage: true,
  sub_price: true,
  customer_price: true,
  notes: true,
}
