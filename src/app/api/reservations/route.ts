import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { CreateReservationSchema, sanitizeString } from '@/lib/validation'
import { checkRateLimit, getClientIp } from '@/lib/auth'
import { z } from 'zod'

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

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const supabase = getSupabaseClient()

    // Rate limiting: 3 reservations per hour per IP
    const clientIp = getClientIp(request)
    const rateLimitCheck = checkRateLimit(`reservation:${clientIp}`, 3, 3600000)

    if (!rateLimitCheck.allowed) {
      console.warn(`[Reservations API] Rate limit exceeded for IP: ${clientIp}`)
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
        console.warn('[Reservations API] Validation failed:', error.errors)
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
    // Parse the date/time components directly to avoid timezone issues
    const [year, month, day] = validatedData.reservation_date.split('-').map(Number)
    const [hours, minutes] = validatedData.reservation_time.split(':').map(Number)

    // Create date in local server timezone
    const reservationDateTime = new Date(year, month - 1, day, hours, minutes, 0)
    const now = new Date()

    // Allow some buffer (1 minute) to account for request processing time
    const bufferMs = 60 * 1000 // 1 minute
    if (reservationDateTime.getTime() < (now.getTime() - bufferMs)) {
      console.warn('[Reservations API] Reservation date is in the past:', {
        reservation: reservationDateTime.toISOString(),
        now: now.toISOString(),
        date: validatedData.reservation_date,
        time: validatedData.reservation_time
      })
      return NextResponse.json(
        { error: 'Reservation must be in the future' },
        { status: 400 }
      )
    }

    // Get reservation settings with caching
    const { data: settings, error: settingsError } = await supabase
      .from('reservation_settings')
      .select('*')
      .limit(1)
      .maybeSingle()

    if (settingsError) {
      console.error('[Reservations API] Failed to fetch settings:', settingsError)
    }

    // Apply business rules if settings exist
    if (settings) {
      // Check minimum advance booking
      const minAdvanceMs = (settings.min_advance_hours || 1) * 60 * 60 * 1000
      const timeDiff = reservationDateTime.getTime() - now.getTime()

      if (timeDiff < minAdvanceMs) {
        console.warn('[Reservations API] Reservation too soon:', { timeDiff, minAdvanceMs })
        return NextResponse.json(
          { error: `Reservations must be made at least ${settings.min_advance_hours || 1} hours in advance` },
          { status: 400 }
        )
      }

      // Check if date is within booking window
      const bookingWindowDays = settings.booking_window_days || 30
      const maxDate = new Date()
      maxDate.setDate(maxDate.getDate() + bookingWindowDays)

      if (reservationDateTime > maxDate) {
        console.warn('[Reservations API] Reservation too far in future:', { reservationDateTime, maxDate })
        return NextResponse.json(
          { error: `Reservations can only be made up to ${bookingWindowDays} days in advance` },
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

    // Create reservation with transaction safety
    const { data: reservation, error } = await supabase
      .from('reservations')
      .insert([sanitizedData])
      .select()
      .single()

    if (error) {
      console.error('[Reservations API] Database error:', error)

      // Handle specific errors
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { error: 'A reservation already exists for this time' },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to create reservation. Please try again.' },
        { status: 500 }
      )
    }

    const duration = Date.now() - startTime
    console.log('[Reservations API] Reservation created successfully:', {
      id: reservation.id,
      date: reservation.reservation_date,
      time: reservation.reservation_time,
      duration: `${duration}ms`
    })

    return NextResponse.json(
      {
        message: 'Reservation created successfully',
        reservation,
      },
      { status: 201 }
    )
  } catch (error) {
    const duration = Date.now() - startTime
    console.error('[Reservations API] Unhandled error:', error, `Duration: ${duration}ms`)

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET /api/reservations - Get all reservations (ADMIN ONLY)
export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    const supabase = getSupabaseClient()

    // ✅ CRITICAL SECURITY FIX: Require authentication
    const { validateAdminAuth } = await import('@/lib/auth')
    const isAuthenticated = await validateAdminAuth(request)

    if (!isAuthenticated) {
      console.warn('[Reservations API] Unauthorized GET request')
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
      console.error('[Reservations API] Error fetching reservations:', error)
      return NextResponse.json(
        { error: 'Failed to fetch reservations' },
        { status: 500 }
      )
    }

    const duration = Date.now() - startTime
    console.log('[Reservations API] Fetched reservations:', {
      count: reservations?.length || 0,
      filters: { date, status },
      duration: `${duration}ms`
    })

    return NextResponse.json({ reservations })
  } catch (error) {
    const duration = Date.now() - startTime
    console.error('[Reservations API] Unhandled error in GET:', error, `Duration: ${duration}ms`)

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
