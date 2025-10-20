import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Order } from '@/types/order'
import { CreateOrderSchema, sanitizeString } from '@/lib/validation'
import { checkRateLimit, getClientIp } from '@/lib/auth'
import { z } from 'zod'

const TAX_RATE = 0.19 // 19% MwSt (German VAT for food services)

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 orders per minute per IP
    const clientIp = getClientIp(request)
    const rateLimitCheck = checkRateLimit(`order:${clientIp}`, 5, 60000)

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    console.log('Received order data:', JSON.stringify(body, null, 2))

    // Basic validation - just check required fields exist
    if (!body.customer_name || !body.customer_phone || !body.order_type || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Use the data as-is, we'll clean it before inserting
    const validatedData = body

    // ✅ CRITICAL SECURITY FIX: Server-side price calculation
    // Never trust client-provided prices!
    const itemIds = validatedData.items.map(item => item.id)

    const { data: menuItems, error: menuError } = await supabase
      .from('menu_items')
      .select('id, price, name, is_available')
      .in('id', itemIds)

    if (menuError) {
      console.error('Error fetching menu items:', menuError)
      return NextResponse.json(
        { error: 'Failed to validate order items' },
        { status: 500 }
      )
    }

    // Validate all items exist and are available
    const menuItemsMap = new Map(menuItems?.map(item => [item.id, item]) || [])

    for (const orderItem of validatedData.items) {
      const menuItem = menuItemsMap.get(orderItem.id)

      if (!menuItem) {
        return NextResponse.json(
          { error: `Item not found: ${orderItem.name}` },
          { status: 400 }
        )
      }

      if (!menuItem.is_available) {
        return NextResponse.json(
          { error: `Item unavailable: ${menuItem.name}` },
          { status: 400 }
        )
      }
    }

    // Calculate actual prices from database (NEVER trust client)
    const calculatedSubtotal = validatedData.items.reduce((sum, orderItem) => {
      const menuItem = menuItemsMap.get(orderItem.id)
      if (!menuItem) return sum
      return sum + (menuItem.price * orderItem.quantity)
    }, 0)

    const calculatedTax = calculatedSubtotal * TAX_RATE
    const calculatedTotal = calculatedSubtotal + calculatedTax

    // Round to 2 decimal places
    const subtotal = Math.round(calculatedSubtotal * 100) / 100
    const tax = Math.round(calculatedTax * 100) / 100
    const total = Math.round(calculatedTotal * 100) / 100

    // Sanitize string inputs to prevent XSS
    const sanitizedData = {
      customer_name: sanitizeString(validatedData.customer_name),
      customer_phone: sanitizeString(validatedData.customer_phone),
      customer_email: validatedData.customer_email ? sanitizeString(validatedData.customer_email) : null,
      delivery_address: validatedData.delivery_address ? sanitizeString(validatedData.delivery_address) : null,
      order_type: validatedData.order_type,
      scheduled_time: validatedData.scheduled_time || null,
      special_notes: validatedData.special_notes ? sanitizeString(validatedData.special_notes) : null,
      items: validatedData.items.map(item => ({
        id: item.id,
        name: sanitizeString(item.name),
        quantity: item.quantity,
        price: menuItemsMap.get(item.id)?.price || 0,
        customizations: item.selectedCustomizations || item.customizations || {}
      })),
      subtotal,
      tax,
      total,
      status: 'pending' as const
    }

    // Insert order into database
    const { data, error } = await supabase
      .from('orders')
      .insert([sanitizedData])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create order', details: error.message },
        { status: 500 }
      )
    }

    const createdOrder = data as Order

    // IMMEDIATE CONFIRMATION EMAIL (Industry Standard: Amazon, DoorDash, Uber Eats)
    // Send email right away with tracking link
    // Customer can track status via link, no need for additional emails
    if (createdOrder.customer_email) {
      try {
        const emailResponse = await fetch(`${request.nextUrl.origin}/api/send-order-confirmation-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerEmail: createdOrder.customer_email,
            customerName: createdOrder.customer_name,
            orderId: createdOrder.id,
            orderNumber: createdOrder.id.slice(-8).toUpperCase(),
            orderType: createdOrder.order_type,
            items: createdOrder.items,
            subtotal: createdOrder.subtotal,
            tax: createdOrder.tax,
            total: createdOrder.total,
            scheduledTime: createdOrder.scheduled_time,
            deliveryAddress: createdOrder.delivery_address,
          })
        })

        if (emailResponse.ok) {
          console.log(`📧 Confirmation email sent to ${createdOrder.customer_email} for order ${createdOrder.id}`)
        } else {
          // Don't fail order if email fails
          console.error('Failed to send confirmation email:', await emailResponse.text())
        }
      } catch (emailError) {
        // Don't fail order if email fails
        console.error('Error sending confirmation email:', emailError)
      }
    }

    return NextResponse.json(
      {
        success: true,
        order: createdOrder,
        message: 'Order placed successfully'
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/orders - Get all orders (ADMIN ONLY)
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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch orders', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        orders: data as Order[]
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
