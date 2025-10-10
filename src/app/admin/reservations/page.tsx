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
  const [showNewDataBadge, setShowNewDataBadge] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchReservations()

    // Set up real-time subscription
    console.log('🔌 Setting up Supabase Realtime subscription for reservations...')

    const channel = supabase
      .channel('reservations-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'reservations',
        },
        (payload) => {
          console.log('✅ Reservation change detected:', payload)

          if (payload.eventType === 'INSERT') {
            console.log('➕ New reservation inserted:', payload.new)
            // Add new reservation
            setReservations((prev) => {
              const newReservations = [payload.new as Reservation, ...prev]
              return newReservations.sort((a, b) => {
                const dateCompare = a.reservation_date.localeCompare(b.reservation_date)
                if (dateCompare !== 0) return dateCompare
                return a.reservation_time.localeCompare(b.reservation_time)
              })
            })
            setShowNewDataBadge(true)
            // Play notification sound or show toast
            showNotification('New reservation received!')
          } else if (payload.eventType === 'UPDATE') {
            console.log('✏️ Reservation updated:', payload.new)
            // Update existing reservation
            setReservations((prev) =>
              prev.map((r) =>
                r.id === payload.new.id ? (payload.new as Reservation) : r
              )
            )
            // Update selected reservation if it's the one being viewed
            if (selectedReservation?.id === payload.new.id) {
              setSelectedReservation(payload.new as Reservation)
            }
          } else if (payload.eventType === 'DELETE') {
            console.log('🗑️ Reservation deleted:', payload.old)
            // Remove deleted reservation
            setReservations((prev) => prev.filter((r) => r.id !== payload.old.id))
            if (selectedReservation?.id === payload.old.id) {
              setSelectedReservation(null)
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Realtime subscription status:', status)
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to reservations realtime updates!')
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Realtime subscription error - check if realtime is enabled in Supabase')
        }
      })

    // Cleanup subscription on unmount
    return () => {
      console.log('🔌 Cleaning up Supabase Realtime subscription...')
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    filterReservations()
  }, [reservations, selectedStatus, selectedDate])

  const showNotification = (message: string) => {
    // Simple browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pho & Sushi - Admin', {
        body: message,
        icon: '/favicon.ico',
      })
    }
  }

  const clearNewDataBadge = () => {
    // Trigger fade-out animation
    setIsAnimatingOut(true)
    // After animation completes, remove the badge
    setTimeout(() => {
      setShowNewDataBadge(false)
      setIsAnimatingOut(false)
    }, 300) // Match this with CSS animation duration
  }

  // Auto-dismiss badge after 8 seconds
  useEffect(() => {
    if (showNewDataBadge) {
      const timer = setTimeout(() => {
        clearNewDataBadge()
      }, 8000) // 8 seconds

      return () => clearTimeout(timer)
    }
  }, [showNewDataBadge])

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
    }
    return colors[status]
  }

  const sendReservationEmail = async (
    reservation: Reservation,
    type: 'confirmed' | 'declined',
    reason?: string
  ) => {
    try {
      // Format date for display
      const formattedDate = new Date(reservation.reservation_date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

      // Format time for display
      const [hours, minutes] = reservation.reservation_time.split(':')
      const hour = parseInt(hours)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour % 12 || 12
      const formattedTime = `${displayHour}:${minutes} ${ampm}`

      await fetch('/api/send-reservation-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          customerEmail: reservation.customer_email,
          customerName: reservation.customer_name,
          reservationDate: formattedDate,
          reservationTime: formattedTime,
          partySize: reservation.party_size,
          specialRequests: reservation.special_requests,
          reason,
        }),
      })
    } catch (error) {
      console.error('Failed to send email:', error)
      // Don't throw - email failure shouldn't block the status update
    }
  }

  const acceptReservation = async (id: string) => {
    try {
      const reservation = reservations.find(r => r.id === id)
      if (!reservation) {
        console.error('Reservation not found:', id)
        alert('Reservation not found')
        return
      }

      console.log('Accepting reservation:', id)

      // Update status to confirmed
      await updateReservationStatus(id, 'confirmed')

      // Send confirmation email (don't let email failure block the accept)
      try {
        await sendReservationEmail(reservation, 'confirmed')
        console.log('Confirmation email sent successfully')
        alert('Reservation accepted and confirmation email sent!')
      } catch (emailError) {
        console.error('Email sending failed:', emailError)
        alert('Reservation accepted successfully, but email notification failed to send')
      }
    } catch (error) {
      console.error('Error accepting reservation:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Failed to accept reservation: ${errorMessage}`)
    }
  }

  const declineReservation = async (id: string, reason?: string) => {
    try {
      const reservation = reservations.find(r => r.id === id)
      if (!reservation) {
        console.error('Reservation not found:', id)
        alert('Reservation not found')
        return
      }

      console.log('Declining reservation:', id, 'with reason:', reason)

      const notes = reason ? `Declined: ${reason}` : 'Declined by admin'

      // Update status in database
      const { data, error } = await supabase
        .from('reservations')
        .update({
          status: 'cancelled',
          admin_notes: notes
        })
        .eq('id', id)
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Failed to update reservation')
      }

      console.log('Database updated successfully:', data)

      // Update local state
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'cancelled', admin_notes: notes } : r))
      )

      if (selectedReservation?.id === id) {
        setSelectedReservation({ ...selectedReservation, status: 'cancelled', admin_notes: notes })
      }

      // Send decline email (don't let email failure block the decline)
      try {
        await sendReservationEmail(reservation, 'declined', reason)
        console.log('Decline email sent successfully')
        alert('Reservation declined and notification email sent!')
      } catch (emailError) {
        console.error('Email sending failed:', emailError)
        alert('Reservation declined successfully, but email notification failed to send')
      }
    } catch (error) {
      console.error('Error declining reservation:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Failed to decline reservation: ${errorMessage}`)
    }
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
      {/* New Data Badge */}
      {showNewDataBadge && (
        <div
          className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
            isAnimatingOut
              ? 'opacity-0 translate-y-2'
              : 'opacity-100 translate-y-0 animate-bounce'
          }`}
        >
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <span className="animate-pulse">🔔</span>
            <span className="font-semibold">New reservation received!</span>
            <button
              onClick={clearNewDataBadge}
              className="ml-2 text-white hover:text-gray-200 transition-colors"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
          {/* Progress bar showing time until auto-dismiss */}
          <div className="mt-1 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white animate-shrink-width"
              style={{ animation: 'shrinkWidth 8s linear forwards' }}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-600">Manage restaurant reservations</p>
            <span className="text-xs text-green-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live updates
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              clearNewDataBadge()
              fetchReservations()
            }}
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
                    onClick={() => {
                      setSelectedReservation(reservation)
                      // Dismiss notification when user clicks on a reservation
                      if (showNewDataBadge) {
                        clearNewDataBadge()
                      }
                    }}
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
          onAccept={acceptReservation}
          onDecline={declineReservation}
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
  onAccept,
  onDecline,
  onDelete,
  formatDate,
  formatTime,
  getStatusColor,
}: {
  reservation: Reservation
  onClose: () => void
  onAccept: (id: string) => void
  onDecline: (id: string, reason?: string) => void
  onDelete: (id: string) => void
  formatDate: (date: string) => string
  formatTime: (time: string) => string
  getStatusColor: (status: ReservationStatus) => string
}) {
  const [declineReason, setDeclineReason] = useState('')
  const [showDeclineForm, setShowDeclineForm] = useState(false)

  const handleAccept = () => {
    if (confirm('Accept this reservation?')) {
      onAccept(reservation.id)
      onClose()
    }
  }

  const handleDecline = () => {
    if (declineReason.trim()) {
      onDecline(reservation.id, declineReason)
      setShowDeclineForm(false)
      setDeclineReason('')
      onClose()
    } else {
      alert('Please provide a reason for declining')
    }
  }

  const isPending = reservation.status === 'pending'

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
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{reservation.special_requests}</p>
            </div>
          )}

          {/* Admin Notes */}
          {reservation.admin_notes && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Admin Notes</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{reservation.admin_notes}</p>
            </div>
          )}

          {/* Expiry Info for Pending */}
          {isPending && reservation.expires_at && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                ⏱️ <strong>Auto-expires:</strong>{' '}
                {new Date(reservation.expires_at).toLocaleString()}
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                This reservation will be automatically cancelled if not accepted before expiry.
              </p>
            </div>
          )}

          {/* Action Buttons - Only for Pending */}
          {isPending && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Actions</h3>

              {!showDeclineForm ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAccept}
                    className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2"
                  >
                    ✓ Accept
                  </button>
                  <button
                    onClick={() => setShowDeclineForm(true)}
                    className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold flex items-center justify-center gap-2"
                  >
                    ✗ Decline
                  </button>
                </div>
              ) : (
                <div className="space-y-3 bg-red-50 p-4 rounded-lg border border-red-200">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-900">Reason for declining:</span>
                    <textarea
                      value={declineReason}
                      onChange={(e) => setDeclineReason(e.target.value)}
                      placeholder="e.g., Fully booked, Outside operating hours, etc."
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      rows={3}
                    />
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDecline}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                    >
                      Confirm Decline
                    </button>
                    <button
                      onClick={() => {
                        setShowDeclineForm(false)
                        setDeclineReason('')
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Status Info for Non-Pending */}
          {!isPending && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Current Status:</strong>{' '}
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(reservation.status)}`}>
                  {reservation.status.toUpperCase()}
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {reservation.status === 'confirmed' && 'This reservation has been accepted and confirmed.'}
                {reservation.status === 'cancelled' && 'This reservation has been cancelled.'}
                {reservation.status === 'completed' && 'This reservation has been completed.'}
              </p>
            </div>
          )}

          {/* Delete Button */}
          <div className="pt-4 border-t">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this reservation? This cannot be undone.')) {
                  onDelete(reservation.id)
                  onClose()
                }
              }}
              className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold"
            >
              🗑️ Delete Reservation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
