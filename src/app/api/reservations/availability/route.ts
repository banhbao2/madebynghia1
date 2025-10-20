import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Singleton Supabase client for better performance
let supabaseClient: ReturnType<typeof createClient> | null = null

function getSupabaseClient() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables')
    }

    supabaseClient = createClient(supabaseUrl, supabaseKey)
  }
  return supabaseClient
}

// Default settings to use when database settings are not available
const DEFAULT_SETTINGS = {
  reservation_start_time: '11:00:00',
  reservation_end_time: '21:00:00',
  slot_duration_minutes: 30,
  max_tables: 15,
  closed_days: [] as string[],
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    const supabase = getSupabaseClient()
    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get('date')

    console.log('[Availability API] Request for date:', date)

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      )
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      console.warn('[Availability API] Invalid date format:', date)
      return NextResponse.json(
        { error: 'Invalid date format. Expected YYYY-MM-DD' },
        { status: 400 }
      )
    }

    // Get reservation settings with better error handling
    const { data: settings, error: settingsError } = await supabase
      .from('reservation_settings')
      .select('*')
      .limit(1)
      .maybeSingle()

    if (settingsError) {
      console.error('[Availability API] Settings query error:', settingsError)
    }

    const finalSettings = settings || DEFAULT_SETTINGS
    console.log('[Availability API] Using settings:', finalSettings)

    // Check if date is closed
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    if (finalSettings.closed_days && finalSettings.closed_days.includes(dayOfWeek)) {
      return NextResponse.json({
        slots: [],
        message: 'Restaurant is closed on this day',
      })
    }

    // Get existing reservations for this date
    const { data: existingReservations, error: resError } = await supabase
      .from('reservations')
      .select('reservation_time, party_size')
      .eq('reservation_date', date)
      .in('status', ['pending', 'confirmed'])

    if (resError) {
      console.error('[Availability API] Reservations query error:', resError)
    }

    const reservations = existingReservations || []
    console.log('[Availability API] Found', reservations.length, 'existing reservations')

    // Generate time slots
    const slots = generateTimeSlots(
      finalSettings.reservation_start_time,
      finalSettings.reservation_end_time,
      finalSettings.slot_duration_minutes || 30
    )

    console.log('[Availability API] Generated', slots.length, 'time slots')

    // Calculate availability for each slot with optimized lookup
    const reservationsByTime = new Map<string, number>()

    reservations.forEach((r: any) => {
      // Normalize time to HH:MM format (database returns HH:MM:SS)
      const time = r.reservation_time ? r.reservation_time.slice(0, 5) : r.reservation_time
      const currentPartySize = reservationsByTime.get(time) || 0
      reservationsByTime.set(time, currentPartySize + (r.party_size || 0))
    })

    const availableSlots = slots.map((time) => {
      const totalPartySize = reservationsByTime.get(time) || 0

      // Rough capacity check - assume each table seats 4 people
      const estimatedTablesUsed = Math.ceil(totalPartySize / 4)
      const remainingCapacity = (finalSettings.max_tables || 15) - estimatedTablesUsed

      return {
        time,
        available: remainingCapacity > 0,
        remainingCapacity,
      }
    })

    const duration = Date.now() - startTime
    console.log('[Availability API] Returning', availableSlots.length, 'slots -', `${duration}ms`)

    return NextResponse.json({ slots: availableSlots })
  } catch (error) {
    const duration = Date.now() - startTime
    console.error('[Availability API] Unhandled error:', error, `Duration: ${duration}ms`)

    if (error instanceof Error) {
      console.error('[Availability API] Error stack:', error.stack)
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * Generate time slots between start and end time
 * Returns times in HH:MM format
 */
function generateTimeSlots(
  startTime: string,
  endTime: string,
  intervalMinutes: number
): string[] {
  const slots: string[] = []

  const [startHour, startMinute] = startTime.split(':').map(Number)
  const [endHour, endMinute] = endTime.split(':').map(Number)

  let currentHour = startHour
  let currentMinute = startMinute

  // Safety check to prevent infinite loops
  const maxIterations = 100
  let iterations = 0

  while (
    (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) &&
    iterations < maxIterations
  ) {
    const timeString = `${String(currentHour).padStart(2, '0')}:${String(
      currentMinute
    ).padStart(2, '0')}`
    slots.push(timeString)

    currentMinute += intervalMinutes
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60)
      currentMinute = currentMinute % 60
    }

    iterations++
  }

  return slots
}
