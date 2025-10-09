'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { Reservation } from '@/types/reservation'

function ConfirmationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reservationId = searchParams.get('id')

  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    if (reservationId) {
      fetchReservation()
    }
  }, [reservationId])

  const fetchReservation = async () => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('id', reservationId)
        .single()

      if (error) throw error

      setReservation(data)
    } catch (error) {
      console.error('Error fetching reservation:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-red-600"></div>
      </div>
    )
  }

  if (!reservation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Reservation Not Found
          </h1>
          <button
            onClick={() => router.push('/')}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            ← Return to Home
          </button>
        </div>
      </div>
    )
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Reservation Confirmed!
            </h1>
            <p className="text-gray-600">
              We've sent a confirmation email to{' '}
              <span className="font-medium">{reservation.customer_email}</span>
            </p>
          </div>

          {/* Reservation Details Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6 text-white">
              <h2 className="text-2xl font-bold mb-1">Reservation Details</h2>
              <p className="text-red-100 text-sm">Confirmation ID: {reservation.id.slice(0, 8)}</p>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              {/* Status Badge */}
              <div className="flex justify-center">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    reservation.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {reservation.status === 'confirmed'
                    ? '✓ Confirmed'
                    : '⏳ Pending Confirmation'}
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📅</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">DATE</p>
                      <p className="font-bold text-gray-900">
                        {formatDate(reservation.reservation_date)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">🕐</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">TIME</p>
                      <p className="font-bold text-gray-900">
                        {formatTime(reservation.reservation_time)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">👥</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">PARTY SIZE</p>
                      <p className="font-bold text-gray-900">
                        {reservation.party_size}{' '}
                        {reservation.party_size === 1 ? 'Guest' : 'Guests'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">👤</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">NAME</p>
                      <p className="font-bold text-gray-900">{reservation.customer_name}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span>{' '}
                    {reservation.customer_email}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Phone:</span>{' '}
                    {reservation.customer_phone}
                  </p>
                </div>
              </div>

              {/* Special Requests */}
              {reservation.special_requests && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Special Requests</h3>
                  <p className="text-gray-600 text-sm">{reservation.special_requests}</p>
                </div>
              )}

              {/* Important Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  📌 Important Information
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Please arrive 10 minutes before your reservation time</li>
                  <li>• Your table will be held for 15 minutes past reservation time</li>
                  <li>
                    • To cancel or modify, please call us at least 2 hours in advance
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 px-8 py-6 border-t flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push('/')}
                className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                Return to Home
              </button>
              <button
                onClick={() => router.push('/menu')}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
              >
                View Menu
              </button>
            </div>
          </div>

          {/* Add to Calendar */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Add this reservation to your{' '}
              <button className="text-red-600 hover:text-red-700 font-medium underline">
                Google Calendar
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-red-600"></div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  )
}
