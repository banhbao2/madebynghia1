import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      customer_name,
      customer_email,
      customer_phone,
      reservation_date,
      reservation_time,
      party_size,
      special_requests,
    } = body

    // Validation
    if (
      !customer_name ||
      !customer_email ||
      !customer_phone ||
      !reservation_date ||
      !reservation_time ||
      !party_size
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if party size is within limits
    if (party_size < 1 || party_size > 20) {
      return NextResponse.json(
        { error: 'Party size must be between 1 and 20' },
        { status: 400 }
      )
    }

    // Check if reservation is in the future
    const reservationDateTime = new Date(`${reservation_date}T${reservation_time}`)
    const now = new Date()

    if (reservationDateTime <= now) {
      return NextResponse.json(
        { error: 'Reservation must be in the future' },
        { status: 400 }
      )
    }

    // Get reservation settings
    const { data: settings } = await supabase
      .from('reservation_settings')
      .select('*')
      .single()

    if (settings) {
      // Check minimum advance booking
      const minAdvanceMs = settings.min_advance_hours * 60 * 60 * 1000
      if (reservationDateTime.getTime() - now.getTime() < minAdvanceMs) {
        return NextResponse.json(
          { error: `Reservations must be made at least ${settings.min_advance_hours} hours in advance` },
          { status: 400 }
        )
      }

      // Check if date is within booking window
      const maxDate = new Date()
      maxDate.setDate(maxDate.getDate() + settings.booking_window_days)
      if (reservationDateTime > maxDate) {
        return NextResponse.json(
          { error: `Reservations can only be made up to ${settings.booking_window_days} days in advance` },
          { status: 400 }
        )
      }
    }

    // Create reservation
    const { data: reservation, error } = await supabase
      .from('reservations')
      .insert([
        {
          customer_name,
          customer_email,
          customer_phone,
          reservation_date,
          reservation_time,
          party_size,
          special_requests,
          status: settings?.auto_confirm ? 'confirmed' : 'pending',
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating reservation:', error)
      return NextResponse.json(
        { error: 'Failed to create reservation' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'Reservation created successfully',
        reservation,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in POST /api/reservations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get('date')
    const status = searchParams.get('status')

    let query = supabase.from('reservations').select('*')

    if (date) {
      query = query.eq('reservation_date', date)
    }

    if (status) {
      query = query.eq('status', status)
    }

    query = query.order('reservation_date', { ascending: true })
      .order('reservation_time', { ascending: true })

    const { data: reservations, error } = await query

    if (error) {
      console.error('Error fetching reservations:', error)
      return NextResponse.json(
        { error: 'Failed to fetch reservations' },
        { status: 500 }
      )
    }

    return NextResponse.json({ reservations })
  } catch (error) {
    console.error('Error in GET /api/reservations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
