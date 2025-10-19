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

    // EMAIL WORKFLOW: Only send emails on specific status transitions
    // Customer should receive emails ONLY when:
    // 1. Order is accepted (pending → preparing)
    // 2. Order is cancelled from any status (any → cancelled)
    // 3. Already accepted order is cancelled (preparing/ready/completed → cancelled)

    const shouldSendEmail = (prevStatus: string, newStatus: string): boolean => {
      // Case 1: Order accepted (pending → preparing)
      if (prevStatus === 'pending' && newStatus === 'preparing') {
        console.log('✅ Email trigger: Order accepted (pending → preparing)')
        return true
      }

      // Case 2: Order cancelled from pending (pending → cancelled)
      if (prevStatus === 'pending' && newStatus === 'cancelled') {
        console.log('✅ Email trigger: Order declined (pending → cancelled)')
        return true
      }

      // Case 3: Order cancelled after being accepted (preparing/ready/completed → cancelled)
      if (['preparing', 'ready', 'completed'].includes(prevStatus) && newStatus === 'cancelled') {
        console.log('✅ Email trigger: Accepted order cancelled (', prevStatus, '→ cancelled)')
        return true
      }

      // Case 4: Moving backwards (completed/ready → preparing) = NO EMAIL
      if (['completed', 'ready'].includes(prevStatus) && newStatus === 'preparing') {
        console.log('⛔ Email blocked: Backwards transition (', prevStatus, '→ preparing)')
        return false
      }

      // Case 5: Internal status changes (preparing → ready, ready → completed) = NO EMAIL
      if (prevStatus === 'preparing' && newStatus === 'ready') {
        console.log('⛔ Email blocked: Internal transition (preparing → ready)')
        return false
      }

      if (prevStatus === 'ready' && newStatus === 'completed') {
        console.log('⛔ Email blocked: Internal transition (ready → completed)')
        return false
      }

      // Default: no email for other transitions
      console.log('⛔ Email blocked: Unhandled transition (', prevStatus, '→', newStatus, ')')
      return false
    }

    // Send email if transition requires it
    if (shouldSendEmail(previousStatus, body.status) && updatedOrder.customer_email) {
      try {
        const emailResponse = await fetch(`${request.nextUrl.origin}/api/send-order-status-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerEmail: updatedOrder.customer_email,
            customerName: updatedOrder.customer_name,
            orderNumber: updatedOrder.id.slice(-8),
            orderType: updatedOrder.order_type,
            items: updatedOrder.items,
            subtotal: updatedOrder.subtotal,
            tax: updatedOrder.tax,
            total: updatedOrder.total,
            scheduledTime: updatedOrder.scheduled_time,
            deliveryAddress: updatedOrder.delivery_address,
            status: body.status
          })
        })

        if (!emailResponse.ok) {
          console.error('Failed to send status email:', await emailResponse.text())
        } else {
          console.log(`📧 Status email sent to ${updatedOrder.customer_email} for order ${updatedOrder.id}`)
        }
      } catch (emailError) {
        // Log error but don't fail the status update
        console.error('Error sending status email:', emailError)
      }
    }

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
