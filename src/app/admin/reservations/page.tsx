'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { Reservation, ReservationStatus } from '@/types/reservation'

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')

  const supabase = createClient()

  useEffect(() => {
    fetchReservations()
  }, [])

  useEffect(() => {
    filterReservations()
  }, [reservations, selectedStatus, selectedDate])

  const fetchReservations = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('reservation_date', { ascending: true })
        .order('reservation_time', { ascending: true })

      if (error) throw error

      setReservations(data || [])
    } catch (error) {
      console.error('Error fetching reservations:', error)
      alert('Failed to load reservations')
    } finally {
      setLoading(false)
    }
  }

  const filterReservations = () => {
    let filtered = [...reservations]

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((r) => r.status === selectedStatus)
    }

    if (selectedDate) {
      filtered = filtered.filter((r) => r.reservation_date === selectedDate)
    }

    setFilteredReservations(filtered)
  }

  const updateReservationStatus = async (id: string, status: ReservationStatus) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id)

      if (error) throw error

      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      )

      if (selectedReservation?.id === id) {
        setSelectedReservation({ ...selectedReservation, status })
      }

      alert('Reservation status updated successfully!')
    } catch (error) {
      console.error('Error updating reservation:', error)
      alert('Failed to update reservation')
    }
  }

  const deleteReservation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reservation?')) return

    try {
      const { error } = await supabase.from('reservations').delete().eq('id', id)

      if (error) throw error

      setReservations((prev) => prev.filter((r) => r.id !== id))
      if (selectedReservation?.id === id) {
        setSelectedReservation(null)
      }

      alert('Reservation deleted successfully!')
    } catch (error) {
      console.error('Error deleting reservation:', error)
      alert('Failed to delete reservation')
    }
  }

  const getStatusColor = (status: ReservationStatus) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-gray-100 text-gray-800',
      no_show: 'bg-orange-100 text-orange-800',
    }
    return colors[status]
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  const statusFilters = [
    { value: 'all', label: 'All', count: reservations.length },
    {
      value: 'pending',
      label: 'Pending',
      count: reservations.filter((r) => r.status === 'pending').length,
    },
    {
      value: 'confirmed',
      label: 'Confirmed',
      count: reservations.filter((r) => r.status === 'confirmed').length,
    },
    {
      value: 'completed',
      label: 'Completed',
      count: reservations.filter((r) => r.status === 'completed').length,
    },
    {
      value: 'cancelled',
      label: 'Cancelled',
      count: reservations.filter((r) => r.status === 'cancelled').length,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
          <p className="text-gray-600 mt-1">Manage restaurant reservations</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchReservations}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Date Filter */}
          <div className="flex-1">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedStatus(filter.value)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                  selectedStatus === filter.value
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Reservations</p>
          <p className="text-2xl font-bold text-gray-900">{reservations.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {reservations.filter((r) => r.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Confirmed</p>
          <p className="text-2xl font-bold text-green-600">
            {reservations.filter((r) => r.status === 'confirmed').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Today</p>
          <p className="text-2xl font-bold text-blue-600">
            {
              reservations.filter(
                (r) => r.reservation_date === new Date().toISOString().split('T')[0]
              ).length
            }
          </p>
        </div>
      </div>

      {/* Reservations List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Party Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No reservations found
                  </td>
                </tr>
              ) : (
                filteredReservations.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedReservation(reservation)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(reservation.reservation_date)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(reservation.reservation_time)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {reservation.customer_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reservation.customer_phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {reservation.party_size}{' '}
                        {reservation.party_size === 1 ? 'guest' : 'guests'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          reservation.status
                        )}`}
                      >
                        {reservation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedReservation(reservation)
                        }}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        View Details →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedReservation && (
        <ReservationDetailModal
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
          onUpdateStatus={updateReservationStatus}
          onDelete={deleteReservation}
          formatDate={formatDate}
          formatTime={formatTime}
          getStatusColor={getStatusColor}
        />
      )}
    </div>
  )
}

// Reservation Detail Modal
function ReservationDetailModal({
  reservation,
  onClose,
  onUpdateStatus,
  onDelete,
  formatDate,
  formatTime,
  getStatusColor,
}: {
  reservation: Reservation
  onClose: () => void
  onUpdateStatus: (id: string, status: ReservationStatus) => void
  onDelete: (id: string) => void
  formatDate: (date: string) => string
  formatTime: (time: string) => string
  getStatusColor: (status: ReservationStatus) => string
}) {
  const statusOptions: ReservationStatus[] = [
    'pending',
    'confirmed',
    'completed',
    'cancelled',
    'no_show',
  ]

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-2xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Reservation Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                reservation.status
              )}`}
            >
              {reservation.status.toUpperCase()}
            </span>
            <span className="text-xs text-gray-500">ID: {reservation.id.slice(0, 8)}</span>
          </div>

          {/* Reservation Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 font-medium mb-1">DATE</p>
              <p className="font-bold text-gray-900">{formatDate(reservation.reservation_date)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 font-medium mb-1">TIME</p>
              <p className="font-bold text-gray-900">{formatTime(reservation.reservation_time)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 font-medium mb-1">PARTY SIZE</p>
              <p className="font-bold text-gray-900">
                {reservation.party_size} {reservation.party_size === 1 ? 'Guest' : 'Guests'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 font-medium mb-1">TABLE</p>
              <p className="font-bold text-gray-900">{reservation.table_number || 'Not assigned'}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-600">Name:</span>{' '}
                <span className="font-medium">{reservation.customer_name}</span>
              </p>
              <p>
                <span className="text-gray-600">Email:</span>{' '}
                <span className="font-medium">{reservation.customer_email}</span>
              </p>
              <p>
                <span className="text-gray-600">Phone:</span>{' '}
                <span className="font-medium">{reservation.customer_phone}</span>
              </p>
            </div>
          </div>

          {/* Special Requests */}
          {reservation.special_requests && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Special Requests</h3>
              <p className="text-sm text-gray-600">{reservation.special_requests}</p>
            </div>
          )}

          {/* Update Status */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Update Status</h3>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    if (confirm(`Change status to "${status}"?`)) {
                      onUpdateStatus(reservation.id, status)
                    }
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    reservation.status === status
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(reservation.id)}
            className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
          >
            Delete Reservation
          </button>
        </div>
      </div>
    </div>
  )
}
