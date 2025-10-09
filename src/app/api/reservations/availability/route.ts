import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get('date')

    console.log('[Availability API] Request for date:', date)

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      )
    }

    // Get reservation settings with better error handling
    let settings = null
    try {
      const { data, error: settingsError } = await supabase
        .from('reservation_settings')
        .select('*')
        .limit(1)
        .maybeSingle()

      if (settingsError) {
        console.error('[Availability API] Settings query error:', settingsError)
      } else {
        settings = data
        console.log('[Availability API] Found settings:', settings)
      }
    } catch (err) {
      console.error('[Availability API] Exception fetching settings:', err)
    }

    // If no settings exist, use defaults
    const defaultSettings = {
      reservation_start_time: '11:00:00',
      reservation_end_time: '21:00:00',
      slot_duration_minutes: 30,
      max_tables: 15,
      closed_days: [],
    }

    const finalSettings = settings || defaultSettings

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
    let existingReservations: any[] = []
    try {
      const { data, error: resError } = await supabase
        .from('reservations')
        .select('reservation_time, party_size')
        .eq('reservation_date', date)
        .in('status', ['pending', 'confirmed'])

      if (resError) {
        console.error('[Availability API] Reservations query error:', resError)
      } else {
        existingReservations = data || []
        console.log('[Availability API] Found', existingReservations.length, 'existing reservations')
      }
    } catch (err) {
      console.error('[Availability API] Exception fetching reservations:', err)
      existingReservations = []
    }

    // Generate time slots
    const slots = generateTimeSlots(
      finalSettings.reservation_start_time,
      finalSettings.reservation_end_time,
      finalSettings.slot_duration_minutes
    )

    console.log('Generated slots:', slots.length, slots)

    // Calculate availability for each slot
    const availableSlots = slots.map((time) => {
      const reservationsAtTime = existingReservations.filter(
        (r) => r.reservation_time === time
      )

      const totalPartySize = reservationsAtTime.reduce(
        (sum, r) => sum + (r.party_size || 0),
        0
      )

      // Rough capacity check - assume each table seats 4 people
      const estimatedTablesUsed = Math.ceil(totalPartySize / 4)
      const remainingCapacity = finalSettings.max_tables - estimatedTablesUsed

      return {
        time,
        available: remainingCapacity > 0,
        remainingCapacity,
      }
    })

    console.log('[Availability API] Returning', availableSlots.length, 'slots')

    return NextResponse.json({ slots: availableSlots })
  } catch (error) {
    console.error('[Availability API] CRITICAL ERROR:', error)
    console.error('[Availability API] Error stack:', error instanceof Error ? error.stack : 'No stack')
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

function generateTimeSlots(
  startTime: string,
  endTime: string,
  intervalMinutes: number
): string[] {
  const slots: string[] = []

  console.log('Generating slots:', { startTime, endTime, intervalMinutes })

  const [startHour, startMinute] = startTime.split(':').map(Number)
  const [endHour, endMinute] = endTime.split(':').map(Number)

  let currentHour = startHour
  let currentMinute = startMinute

  // Safety check to prevent infinite loops
  let maxIterations = 100
  let iterations = 0

  while (
    (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) &&
    iterations < maxIterations
  ) {
    const timeString = `${String(currentHour).padStart(2, '0')}:${String(
      currentMinute
    ).padStart(2, '0')}:00`
    slots.push(timeString)

    currentMinute += intervalMinutes
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60)
      currentMinute = currentMinute % 60
    }

    iterations++
  }

  console.log('Generated', slots.length, 'time slots')
  return slots
}
