export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export interface Reservation {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  reservation_date: string
  reservation_time: string
  party_size: number
  status: ReservationStatus
  special_requests?: string | null
  table_number?: string | null
  admin_notes?: string | null
  expires_at?: string | null
  created_at: string
  updated_at: string
}

export interface ReservationSettings {
  id: string
  max_tables: number
  max_party_size: number
  slot_duration_minutes: number
  booking_window_days: number
  reservation_start_time: string
  reservation_end_time: string
  closed_days: string[]
  auto_confirm: boolean
  min_advance_hours: number
  created_at: string
  updated_at: string
}

export interface ReservationFormData {
  customer_name: string
  customer_email: string
  customer_phone: string
  reservation_date: string
  reservation_time: string
  party_size: number
  special_requests?: string
}

export interface TimeSlot {
  time: string
  available: boolean
  remainingCapacity?: number
}
