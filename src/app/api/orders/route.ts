import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { CreateOrderRequest, Order } from '@/types/order'

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json()

    // Validate required fields
    if (!body.customer_name || !body.customer_phone || !body.order_type || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate order type
    if (body.order_type !== 'delivery' && body.order_type !== 'pickup') {
      return NextResponse.json(
        { error: 'Invalid order type' },
        { status: 400 }
      )
    }

    // If delivery, address is required
    if (body.order_type === 'delivery' && !body.delivery_address) {
      return NextResponse.json(
        { error: 'Delivery address is required for delivery orders' },
        { status: 400 }
      )
    }

    // Insert order into database
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          customer_name: body.customer_name,
          customer_phone: body.customer_phone,
          customer_email: body.customer_email || null,
          delivery_address: body.delivery_address || null,
          order_type: body.order_type,
          scheduled_time: body.scheduled_time || null,
          special_notes: body.special_notes || null,
          items: body.items,
          subtotal: body.subtotal,
          tax: body.tax,
          total: body.total,
          status: 'pending'
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create order', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        order: data as Order,
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

// GET /api/orders - Get all orders
export async function GET(request: NextRequest) {
  try {
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
