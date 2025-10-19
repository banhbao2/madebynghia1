'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { Order } from '@/types/order'
import Head from 'next/head'
import { toast } from 'sonner'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())

  const supabase = createClient()

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/orders')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch orders')
      }

      // Sort by scheduled_time (earliest first - most urgent!)
      const sorted = (data.orders || []).sort((a: Order, b: Order) => {
        if (!a.scheduled_time) return 1
        if (!b.scheduled_time) return -1
        return new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime()
      })

      setOrders(sorted)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err instanceof Error ? err.message : 'Failed to load orders')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()

    // Set up real-time subscription
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          console.log('Order change detected:', payload)
          fetchOrders() // Refresh to maintain sort order
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Update order status
  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update order')
      }

      // Refresh orders
      fetchOrders()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update order')
    }
  }

  // Toggle order expansion
  const toggleExpand = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev)
      if (newSet.has(orderId)) {
        newSet.delete(orderId)
      } else {
        newSet.add(orderId)
      }
      return newSet
    })
  }

  // Group orders by status
  const newOrders = orders.filter(o => o.status === 'pending')
  const preparingOrders = orders.filter(o => o.status === 'preparing')
  const completedOrders = orders.filter(o => o.status === 'completed')
  const cancelledOrders = orders.filter(o => o.status === 'cancelled')

  // Get time until pickup (for urgency indicator)
  const getTimeUntilPickup = (scheduledTime: string | null) => {
    if (!scheduledTime) return null
    const now = new Date()
    const pickup = new Date(scheduledTime)
    const diffMinutes = Math.floor((pickup.getTime() - now.getTime()) / (1000 * 60))
    return diffMinutes
  }

  const getUrgencyBadge = (minutes: number | null) => {
    if (minutes === null) return null

    // Helper function to format time as hours and minutes
    const formatTimeRemaining = (mins: number) => {
      const absMins = Math.abs(mins)
      const hours = Math.floor(absMins / 60)
      const remainingMins = absMins % 60

      // Always show hours if >= 60 minutes
      if (hours > 0) {
        return `${hours}h ${remainingMins}m`
      }
      return `${absMins}m`
    }

    // Overdue orders (negative minutes)
    if (minutes < 0) {
      return <span className="px-1.5 py-0.5 bg-red-600 text-white text-xs font-bold rounded">⚠️ {formatTimeRemaining(minutes)}</span>
    }

    // Urgent - less than 15 minutes
    if (minutes < 15) {
      return <span className="px-1.5 py-0.5 bg-orange-600 text-white text-xs font-bold rounded">🔥 {formatTimeRemaining(minutes)}</span>
    }

    // Warning - less than 30 minutes
    if (minutes < 30) {
      return <span className="px-1.5 py-0.5 bg-yellow-600 text-white text-xs font-bold rounded">⏰ {formatTimeRemaining(minutes)}</span>
    }

    // Normal - 30+ minutes
    return <span className="px-1.5 py-0.5 bg-green-600 text-white text-xs font-bold rounded">✓ {formatTimeRemaining(minutes)}</span>
  }

  // Safe date formatters
  const formatTime = (dateString: string | null) => {
    if (!dateString) return null
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return null
      return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
    } catch {
      return null
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return null
      return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
    } catch {
      return null
    }
  }

  // Compact Order Card Component
  const OrderCard = ({ order }: { order: Order }) => {
    const minutesUntil = getTimeUntilPickup(order.scheduled_time)
    const isUrgent = minutesUntil !== null && minutesUntil < 30
    const isExpanded = expandedOrders.has(order.id)
    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)

    return (
      <div className={`bg-white rounded-lg shadow border-l-4 mb-2 transition-all hover:shadow-md ${
        isUrgent ? 'border-red-500' : 'border-gray-300'
      }`}>
        {/* Compact Header - Always Visible */}
        <div className="p-2">
          <div className="flex items-center justify-between gap-2">
            {/* Time */}
            <div className="flex-shrink-0">
              {order.scheduled_time ? (
                <div>
                  <p className="text-lg font-black text-gray-900 leading-none">
                    {formatTime(order.scheduled_time) || 'ASAP'}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(order.scheduled_time)}</p>
                </div>
              ) : (
                <p className="text-base font-bold text-gray-900">ASAP</p>
              )}
            </div>

            {/* Customer & Type */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-gray-900 truncate">{order.customer_name}</p>
              <p className="text-xs text-gray-600">{order.order_type === 'delivery' ? '🚚' : '🏪'} • {itemCount} items</p>
            </div>

            {/* Total */}
            <div className="flex-shrink-0 text-right">
              <p className="text-lg font-black text-gray-900">${order.total.toFixed(2)}</p>
              {getUrgencyBadge(minutesUntil)}
            </div>

            {/* Expand Button */}
            <button
              onClick={() => toggleExpand(order.id)}
              className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition"
            >
              <svg className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Quick Actions - Always Visible */}
          <div className="mt-2 flex gap-1">
            {order.status === 'pending' && (
              <>
                <button
                  onClick={() => updateStatus(order.id, 'preparing')}
                  className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-bold text-xs"
                >
                  ✅ Accept
                </button>
                <button
                  onClick={() => updateStatus(order.id, 'cancelled')}
                  className="px-3 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-xs font-medium"
                >
                  ❌
                </button>
              </>
            )}

            {order.status === 'preparing' && (
              <>
                <button
                  onClick={() => updateStatus(order.id, 'completed')}
                  className="flex-1 px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition font-bold text-xs"
                >
                  ✓ Done
                </button>
                <button
                  onClick={() => updateStatus(order.id, 'pending')}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition text-xs"
                >
                  ←
                </button>
                <button
                  onClick={() => updateStatus(order.id, 'cancelled')}
                  className="px-3 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-xs"
                >
                  ❌
                </button>
              </>
            )}

            {order.status === 'completed' && (
              <button
                onClick={() => updateStatus(order.id, 'preparing')}
                className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition text-xs"
              >
                ← Back
              </button>
            )}

            {order.status === 'cancelled' && (
              <button
                onClick={() => updateStatus(order.id, 'pending')}
                className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition text-xs"
              >
                ← Restore
              </button>
            )}
          </div>
        </div>

        {/* Expanded Details - Collapsible */}
        {isExpanded && (
          <div className="border-t bg-gray-50 p-3 space-y-2">
            {/* Phone */}
            <div>
              <p className="text-xs text-gray-500 font-medium">PHONE</p>
              <p className="text-sm text-gray-900">{order.customer_phone}</p>
            </div>

            {/* Items */}
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">ITEMS</p>
              <div className="space-y-1">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="text-sm text-gray-800">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <span className="font-bold text-red-600">{item.quantity}x</span> {item.name}
                        {item.selectedCustomizations && Object.keys(item.selectedCustomizations).length > 0 && (
                          <div className="text-xs text-gray-500 ml-4">
                            {Object.entries(item.selectedCustomizations).map(([key, value]) => (
                              <span key={key} className="mr-2">• {value}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="font-bold text-gray-900 flex-shrink-0">${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Notes */}
            {order.special_notes && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                <p className="text-xs font-bold text-yellow-800">📝 SPECIAL REQUEST</p>
                <p className="text-sm text-yellow-900 mt-1">{order.special_notes}</p>
              </div>
            )}

            {/* Delivery Address */}
            {order.delivery_address && (
              <div>
                <p className="text-xs text-gray-500 font-medium">DELIVERY ADDRESS</p>
                <p className="text-sm text-gray-900">📍 {order.delivery_address}</p>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // Update page title
  useEffect(() => {
    document.title = `Orders (${newOrders.length}) - Admin Panel`
  }, [newOrders.length])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Floating Refresh Button - Bottom Right */}
      <button
        onClick={fetchOrders}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all duration-200 group"
        title="Refresh orders"
      >
        <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span className="font-medium text-sm">Refresh</span>
      </button>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* KANBAN BOARD - Desktop */}
      {!isLoading && !error && (
        <>
          {/* Desktop View (>= 768px) */}
          <div className="hidden md:block container mx-auto px-2 pt-2 pb-2">
            <div className="grid grid-cols-3 gap-2">
              {/* Column 1: New Orders */}
              <div>
                <div className="bg-red-600 text-white rounded-t-md px-2 py-1 flex items-center justify-between text-sm font-bold">
                  <span>🔔 New</span>
                  <span className="bg-white text-red-600 px-1.5 py-0.5 rounded-full text-xs">{newOrders.length}</span>
                </div>
                <div className="bg-red-50 rounded-b-md p-2 min-h-[calc(100vh-60px)] max-h-[calc(100vh-60px)] overflow-y-auto">
                  {newOrders.length === 0 ? (
                    <p className="text-center text-gray-500 py-8 text-sm">No new orders</p>
                  ) : (
                    newOrders.map(order => <OrderCard key={order.id} order={order} />)
                  )}
                </div>
              </div>

              {/* Column 2: Preparing */}
              <div>
                <div className="bg-blue-600 text-white rounded-t-md px-2 py-1 flex items-center justify-between text-sm font-bold">
                  <span>👨‍🍳 Preparing</span>
                  <span className="bg-white text-blue-600 px-1.5 py-0.5 rounded-full text-xs">{preparingOrders.length}</span>
                </div>
                <div className="bg-blue-50 rounded-b-md p-2 min-h-[calc(100vh-60px)] max-h-[calc(100vh-60px)] overflow-y-auto">
                  {preparingOrders.length === 0 ? (
                    <p className="text-center text-gray-500 py-8 text-sm">No orders preparing</p>
                  ) : (
                    preparingOrders.map(order => <OrderCard key={order.id} order={order} />)
                  )}
                </div>
              </div>

              {/* Column 3: Done & Cancelled */}
              <div>
                <div className="bg-green-600 text-white rounded-t-md px-2 py-1 flex items-center justify-between text-sm font-bold">
                  <span>✅ Done</span>
                  <span className="bg-white text-green-600 px-1.5 py-0.5 rounded-full text-xs">{completedOrders.length + cancelledOrders.length}</span>
                </div>
                <div className="bg-green-50 rounded-b-md p-2 min-h-[calc(100vh-60px)] max-h-[calc(100vh-60px)] overflow-y-auto">
                  {completedOrders.length === 0 && cancelledOrders.length === 0 ? (
                    <p className="text-center text-gray-500 py-8 text-sm">No completed orders</p>
                  ) : (
                    <>
                      {completedOrders.map(order => (
                        <div key={order.id} className="opacity-60">
                          <OrderCard order={order} />
                        </div>
                      ))}
                      {cancelledOrders.map(order => (
                        <div key={order.id} className="opacity-40">
                          <OrderCard order={order} />
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile View (< 768px) - Horizontal Scroll */}
          <div className="md:hidden px-1 pt-1 pb-2">
            <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory">
              {/* New Orders */}
              <div className="flex-shrink-0 w-[90vw] snap-center">
                <div className="bg-red-600 text-white rounded-t-md px-2 py-1 flex items-center justify-between text-sm font-bold">
                  <span>🔔 New</span>
                  <span className="bg-white text-red-600 px-1.5 py-0.5 rounded-full text-xs">{newOrders.length}</span>
                </div>
                <div className="bg-red-50 rounded-b-md p-2 max-h-[calc(100vh-80px)] overflow-y-auto">
                  {newOrders.length === 0 ? (
                    <p className="text-center text-gray-500 py-8 text-sm">No new orders</p>
                  ) : (
                    newOrders.map(order => <OrderCard key={order.id} order={order} />)
                  )}
                </div>
              </div>

              {/* Preparing */}
              <div className="flex-shrink-0 w-[90vw] snap-center">
                <div className="bg-blue-600 text-white rounded-t-md px-2 py-1 flex items-center justify-between text-sm font-bold">
                  <span>👨‍🍳 Preparing</span>
                  <span className="bg-white text-blue-600 px-1.5 py-0.5 rounded-full text-xs">{preparingOrders.length}</span>
                </div>
                <div className="bg-blue-50 rounded-b-md p-2 max-h-[calc(100vh-80px)] overflow-y-auto">
                  {preparingOrders.length === 0 ? (
                    <p className="text-center text-gray-500 py-8 text-sm">No orders preparing</p>
                  ) : (
                    preparingOrders.map(order => <OrderCard key={order.id} order={order} />)
                  )}
                </div>
              </div>

              {/* Done & Cancelled */}
              <div className="flex-shrink-0 w-[90vw] snap-center">
                <div className="bg-green-600 text-white rounded-t-md px-2 py-1 flex items-center justify-between text-sm font-bold">
                  <span>✅ Done</span>
                  <span className="bg-white text-green-600 px-1.5 py-0.5 rounded-full text-xs">{completedOrders.length + cancelledOrders.length}</span>
                </div>
                <div className="bg-green-50 rounded-b-md p-2 max-h-[calc(100vh-80px)] overflow-y-auto">
                  {completedOrders.length === 0 && cancelledOrders.length === 0 ? (
                    <p className="text-center text-gray-500 py-8 text-sm">No completed orders</p>
                  ) : (
                    <>
                      {completedOrders.map(order => (
                        <div key={order.id} className="opacity-60">
                          <OrderCard order={order} />
                        </div>
                      ))}
                      {cancelledOrders.map(order => (
                        <div key={order.id} className="opacity-40">
                          <OrderCard order={order} />
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-gray-500 mt-1">← Swipe →</p>
          </div>
        </>
      )}
    </div>
  )
}
