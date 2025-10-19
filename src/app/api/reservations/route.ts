import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { CreateReservationSchema, sanitizeString } from '@/lib/validation'
import { checkRateLimit, getClientIp } from '@/lib/auth'
import { z } from 'zod'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 3 reservations per hour per IP
    const clientIp = getClientIp(request)
    const rateLimitCheck = checkRateLimit(`reservation:${clientIp}`, 3, 3600000)

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many reservation attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()

    // ✅ SECURITY FIX: Validate and sanitize input using Zod
    let validatedData
    try {
      validatedData = CreateReservationSchema.parse(body)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            details: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
          },
          { status: 400 }
        )
      }
      throw error
    }

    // Check if reservation is in the future
    const reservationDateTime = new Date(`${validatedData.reservation_date}T${validatedData.reservation_time}`)
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

    // ✅ SECURITY FIX: Sanitize inputs to prevent XSS
    const sanitizedData = {
      customer_name: sanitizeString(validatedData.customer_name),
      customer_email: sanitizeString(validatedData.customer_email),
      customer_phone: sanitizeString(validatedData.customer_phone),
      reservation_date: validatedData.reservation_date,
      reservation_time: validatedData.reservation_time,
      party_size: validatedData.party_size,
      special_requests: validatedData.special_requests ? sanitizeString(validatedData.special_requests) : null,
      status: settings?.auto_confirm ? 'confirmed' : 'pending',
    }

    // Create reservation
    const { data: reservation, error } = await supabase
      .from('reservations')
      .insert([sanitizedData])
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

// GET /api/reservations - Get all reservations (ADMIN ONLY)
export async function GET(request: NextRequest) {
  try {
    // ✅ CRITICAL SECURITY FIX: Require authentication
    const { validateAdminAuth } = await import('@/lib/auth')
    const isAuthenticated = await validateAdminAuth(request)

    if (!isAuthenticated) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Admin authentication required. Please log in to the admin panel.'
        },
        { status: 401 }
      )
    }

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
