'use client'

import { useState, useEffect } from 'react'
import { Order, OrderStatus } from '@/types/order'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/orders')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch orders')
      }

      setOrders(data.orders)
      setFilteredOrders(data.orders)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err instanceof Error ? err.message : 'Failed to load orders')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000)
    return () => clearInterval(interval)
  }, [])

  // Filter orders by status
  useEffect(() => {
    if (selectedStatus === 'all') {
      setFilteredOrders(orders)
    } else {
      setFilteredOrders(orders.filter(order => order.status === selectedStatus))
    }
  }, [selectedStatus, orders])

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update order')
      }

      // Update local state
      setOrders(prev => prev.map(order =>
        order.id === orderId ? data.order : order
      ))

      if (selectedOrder?.id === orderId) {
        setSelectedOrder(data.order)
      }

      // Show success feedback
      alert('Order status updated successfully!')
    } catch (err) {
      console.error('Error updating order:', err)
      alert(err instanceof Error ? err.message : 'Failed to update order')
    }
  }

  // Delete order
  const deleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to permanently delete this order? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete order')
      }

      // Remove from local state
      setOrders(prev => prev.filter(order => order.id !== orderId))

      // Close modal if this order was open
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null)
      }

      // Show success feedback
      alert('Order deleted successfully!')
    } catch (err) {
      console.error('Error deleting order:', err)
      alert(err instanceof Error ? err.message : 'Failed to delete order')
    }
  }

  const statusFilters = [
    { value: 'all', label: 'All Orders', color: 'gray' },
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'accepted', label: 'Accepted', color: 'blue' },
    { value: 'preparing', label: 'Preparing', color: 'purple' },
    { value: 'ready', label: 'Ready', color: 'green' },
    { value: 'completed', label: 'Completed', color: 'gray' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' }
  ]

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchOrders}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                🔄 Refresh
              </button>
              <div className="text-sm text-gray-500">
                {filteredOrders.length} orders
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Status Filters */}
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedStatus(filter.value)}
                className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  selectedStatus === filter.value
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border'
                }`}
              >
                {filter.label}
                {filter.value !== 'all' && (
                  <span className="ml-2 text-sm">
                    ({orders.filter(o => o.status === filter.value).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-red-600"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Orders Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredOrders.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No orders found</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer p-4 border-l-4 border-red-600"
                >
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                      <p className="font-mono text-xs text-gray-400">
                        {order.id.slice(0, 8)}...
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="mb-3">
                    <p className="font-semibold text-gray-900">{order.customer_name}</p>
                    <p className="text-sm text-gray-600">{order.customer_phone}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {order.order_type === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}
                    </p>
                  </div>

                  {/* Order Items */}
                  <div className="mb-3 text-sm text-gray-600">
                    <p className="font-medium text-gray-700">{order.items.length} items</p>
                    <p className="text-xs text-gray-500 truncate">
                      {order.items.map(item => item.name).join(', ')}
                    </p>
                  </div>

                  {/* Total */}
                  <div className="pt-3 border-t flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total</span>
                    <span className="text-lg font-bold text-gray-900">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={updateOrderStatus}
          onDelete={deleteOrder}
        />
      )}
    </div>
  )
}

// Order Detail Modal Component
function OrderDetailModal({
  order,
  onClose,
  onUpdateStatus,
  onDelete
}: {
  order: Order
  onClose: () => void
  onUpdateStatus: (orderId: string, status: OrderStatus) => void
  onDelete: (orderId: string) => void
}) {
  const statusOptions: OrderStatus[] = ['pending', 'accepted', 'preparing', 'ready', 'completed', 'cancelled']

  if (!order) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-2xl w-full my-8" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Order Info */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Order ID</p>
                <p className="font-mono text-xs">{order.id}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Date</p>
                <p className="font-medium">{new Date(order.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-600">Name:</span> <span className="font-medium">{order.customer_name}</span></p>
              <p><span className="text-gray-600">Phone:</span> <span className="font-medium">{order.customer_phone}</span></p>
              {order.customer_email && (
                <p><span className="text-gray-600">Email:</span> <span className="font-medium">{order.customer_email}</span></p>
              )}
              <p><span className="text-gray-600">Type:</span> <span className="font-medium">{order.order_type === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}</span></p>
              {order.delivery_address && (
                <p><span className="text-gray-600">Address:</span> <span className="font-medium">{order.delivery_address}</span></p>
              )}
              {order.special_notes && (
                <p><span className="text-gray-600">Notes:</span> <span className="font-medium">{order.special_notes}</span></p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.items && order.items.length > 0 ? (
                order.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-start border-b pb-3">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name || 'Unknown Item'}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity || 1}</p>
                      {item.selectedCustomizations && Object.keys(item.selectedCustomizations).length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {Object.entries(item.selectedCustomizations).map(([key, value]) => (
                            <p key={key}>{key}: {String(value)}</p>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="font-medium text-gray-900">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No items found</p>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Update Status</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    if (confirm(`Change order status to "${status}"?`)) {
                      onUpdateStatus(order.id, status)
                    }
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    order.status === status
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {/* Delete Button */}
            <button
              onClick={() => onDelete(order.id)}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Order
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
