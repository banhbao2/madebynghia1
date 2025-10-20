import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { UpdateOrderRequest, Order } from '@/types/order'

// GET /api/orders/[id] - Get a single order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        )
      }
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch order', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        order: data as Order
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/orders/[id] - Update order status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body: UpdateOrderRequest = await request.json()

    // Validate status
    const validStatuses = ['pending', 'accepted', 'preparing', 'ready', 'completed', 'cancelled']
    if (!body.status || !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // FIRST: Get the current order status BEFORE updating
    const { data: currentOrder, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !currentOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const previousStatus = currentOrder.status

    // Update order status
    const { data, error } = await supabase
      .from('orders')
      .update({
        status: body.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        )
      }
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to update order', details: error.message },
        { status: 500 }
      )
    }

    const updatedOrder = data as Order

    // NO EMAILS ON STATUS CHANGES (Industry Best Practice)
    //
    // Reason: Customer already received confirmation email with tracking link
    // They can monitor status in real-time via tracking page (polls every 10 seconds)
    //
    // Benefits:
    // ✅ Prevents email spam (1 email instead of 3-4)
    // ✅ Admin mistakes don't trigger unwanted emails
    // ✅ Cleaner customer experience
    // ✅ Follows Amazon/DoorDash/Uber Eats pattern
    //
    // Email Flow:
    // 1. Order submitted → Immediate confirmation email with tracking link ✉️
    // 2. Status changes → Customer checks tracking page (no new email) 📱
    // 3. Customer has permanent access to order details via tracking link
    //
    // If you need to re-enable status update emails, see:
    // /api/send-order-status-email/route.ts (still available but not called)

    console.log(`✅ Order ${updatedOrder.id} status updated: ${previousStatus} → ${body.status} (no email sent)`)

    return NextResponse.json(
      {
        success: true,
        order: updatedOrder,
        message: 'Order status updated successfully'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/orders/[id] - Delete an order
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // First check if order exists
    const { data: existingOrder, error: fetchError } = await supabase
      .from('orders')
      .select('id')
      .eq('id', id)
      .single()

    if (fetchError || !existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Delete the order
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to delete order', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Order deleted successfully'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
