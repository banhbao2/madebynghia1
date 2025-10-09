'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    pendingOrders: 0,
    menuItems: 0,
    todayReservations: 0,
    pendingReservations: 0,
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [recentReservations, setRecentReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const supabase = createClient()

      // Fetch menu items count
      const { count: menuCount } = await supabase
        .from('menu_items')
        .select('*', { count: 'exact', head: true })

      // Fetch orders data (if orders table exists)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      let todayOrders = 0
      let todayRevenue = 0
      let pendingOrders = 0
      let orders: any[] = []

      try {
        const { data: ordersData, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)

        if (!error && ordersData) {
          orders = ordersData

          // Calculate today's stats
          const todayOrdersData = ordersData.filter((order: any) => {
            const orderDate = new Date(order.created_at)
            return orderDate >= today
          })

          todayOrders = todayOrdersData.length
          todayRevenue = todayOrdersData.reduce((sum: number, order: any) => sum + (order.total || 0), 0)
          pendingOrders = ordersData.filter((order: any) => order.status === 'pending').length
        }
      } catch (e) {
        console.log('Orders table may not exist yet')
      }

      // Fetch reservations data
      let todayReservations = 0
      let pendingReservations = 0
      let reservations: any[] = []

      try {
        const todayDate = today.toISOString().split('T')[0]

        const { data: reservationsData, error: resError } = await supabase
          .from('reservations')
          .select('*')
          .order('reservation_date', { ascending: true })
          .order('reservation_time', { ascending: true })
          .limit(5)

        if (!resError && reservationsData) {
          reservations = reservationsData

          // Calculate today's reservation stats
          todayReservations = reservationsData.filter(
            (res: any) => res.reservation_date === todayDate
          ).length

          pendingReservations = reservationsData.filter(
            (res: any) => res.status === 'pending'
          ).length
        }
      } catch (e) {
        console.log('Reservations table may not exist yet')
      }

      setStats({
        todayOrders,
        todayRevenue,
        pendingOrders,
        menuItems: menuCount || 0,
        todayReservations,
        pendingReservations,
      })
      setRecentOrders(orders)
      setRecentReservations(reservations)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Today's Orders",
      value: stats.todayOrders,
      icon: '📝',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: "Today's Revenue",
      value: `$${stats.todayRevenue.toFixed(2)}`,
      icon: '💰',
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: '⏱️',
      color: 'bg-orange-50 text-orange-600',
    },
    {
      title: "Today's Reservations",
      value: stats.todayReservations,
      icon: '📅',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Pending Reservations',
      value: stats.pendingReservations,
      icon: '🔔',
      color: 'bg-yellow-50 text-yellow-600',
    },
    {
      title: 'Menu Items',
      value: stats.menuItems,
      icon: '🍽️',
      color: 'bg-pink-50 text-pink-600',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="p-6">
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{order.customer_name}</p>
                      <p className="text-sm text-gray-600">
                        {order.order_type === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${order.total?.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'ready' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No orders yet today</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-3">
            <Link
              href="/admin/menu"
              className="flex items-center gap-3 p-4 bg-red-50 rounded-lg hover:bg-red-100 transition group"
            >
              <span className="text-2xl">➕</span>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-red-600">Add Menu Item</p>
                <p className="text-sm text-gray-600">Create new dish</p>
              </div>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition group"
            >
              <span className="text-2xl">📋</span>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-blue-600">View Orders</p>
                <p className="text-sm text-gray-600">Manage all orders</p>
              </div>
            </Link>

            <Link
              href="/admin/reservations"
              className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition group"
            >
              <span className="text-2xl">📅</span>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-purple-600">Reservations</p>
                <p className="text-sm text-gray-600">Manage bookings</p>
              </div>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition group"
            >
              <span className="text-2xl">⚙️</span>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-orange-600">Settings</p>
                <p className="text-sm text-gray-600">Restaurant info</p>
              </div>
            </Link>

            <a
              href="/"
              target="_blank"
              className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition group"
            >
              <span className="text-2xl">🌐</span>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-green-600">View Website</p>
                <p className="text-sm text-gray-600">See customer view</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
