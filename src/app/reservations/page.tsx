'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { ReservationFormData, TimeSlot } from '@/types/reservation'

export default function ReservationsPage() {
  const router = useRouter()
  const supabase = createClient()

  // Form state
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [formData, setFormData] = useState<ReservationFormData>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    reservation_date: '',
    reservation_time: '',
    party_size: 2,
    special_requests: '',
  })

  // UI state
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  // Get maximum date (30 days from now)
  const getMaxDate = () => {
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 30)
    return maxDate.toISOString().split('T')[0]
  }

  // Fetch available time slots when date changes
  useEffect(() => {
    if (formData.reservation_date) {
      fetchAvailableSlots()
    }
  }, [formData.reservation_date])

  const fetchAvailableSlots = async () => {
    setLoading(true)
    try {
      console.log('Fetching slots for date:', formData.reservation_date)
      const response = await fetch(
        `/api/reservations/availability?date=${formData.reservation_date}`
      )
      const data = await response.json()

      console.log('API Response:', { ok: response.ok, status: response.status, data })

      if (response.ok) {
        console.log('Setting available slots:', data.slots?.length || 0, 'slots')
        setAvailableSlots(data.slots || [])
      } else {
        console.error('API Error:', data.error)
        alert(`Error loading time slots: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error fetching slots:', error)
      alert('Failed to load available time slots. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step < 3) {
      setStep((step + 1) as 1 | 2 | 3)
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create reservation')
      }

      // Redirect to confirmation page
      router.push(`/reservations/confirmation?id=${data.reservation.id}`)
    } catch (error) {
      console.error('Error creating reservation:', error)
      alert(error instanceof Error ? error.message : 'Failed to create reservation')
    } finally {
      setSubmitting(false)
    }
  }

  const canProceed = () => {
    if (step === 1) {
      return formData.reservation_date && formData.party_size > 0
    }
    if (step === 2) {
      return formData.reservation_time
    }
    if (step === 3) {
      return (
        formData.customer_name &&
        formData.customer_email &&
        formData.customer_phone
      )
    }
    return false
  }

  // Helper: Format time for display (12-hour format)
  const formatTimeDisplay = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  // Helper: Get meal period
  const getMealPeriod = (time: string) => {
    const hour = parseInt(time.split(':')[0])
    if (hour >= 11 && hour < 15) return 'lunch'
    if (hour >= 15 && hour < 17) return 'afternoon'
    if (hour >= 17 && hour < 22) return 'dinner'
    return 'other'
  }

  // Helper: Group slots by meal period
  const groupSlotsByPeriod = (slots: TimeSlot[]) => {
    const groups: { [key: string]: TimeSlot[] } = {
      lunch: [],
      afternoon: [],
      dinner: [],
    }

    slots.forEach((slot) => {
      const period = getMealPeriod(slot.time)
      if (groups[period]) {
        groups[period].push(slot)
      }
    })

    return groups
  }

  // Render time slots grouped by period
  const renderTimeSlotsByPeriod = (slots: TimeSlot[]) => {
    const groups = groupSlotsByPeriod(slots)

    const periodLabels = {
      lunch: { icon: '🌤️', label: 'Lunch', color: 'amber' },
      afternoon: { icon: '☕', label: 'Afternoon', color: 'orange' },
      dinner: { icon: '🌙', label: 'Dinner', color: 'indigo' },
    }

    return (
      <div className="space-y-6">
        {Object.entries(groups).map(([period, periodSlots]) => {
          if (periodSlots.length === 0) return null

          const { icon, label, color } = periodLabels[period as keyof typeof periodLabels]

          return (
            <div key={period}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{icon}</span>
                <h3 className="font-semibold text-gray-900">{label}</h3>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {periodSlots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() =>
                      slot.available && setFormData({ ...formData, reservation_time: slot.time })
                    }
                    disabled={!slot.available}
                    className={`py-3 px-2 rounded-lg font-medium text-sm transition-all ${
                      formData.reservation_time === slot.time
                        ? 'bg-red-600 text-white shadow-lg scale-105 ring-2 ring-red-300'
                        : slot.available
                        ? 'bg-white border-2 border-gray-200 text-gray-700 hover:border-red-500 hover:text-red-600 hover:shadow-md'
                        : 'bg-gray-50 border border-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {formatTimeDisplay(slot.time)}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reserve a Table</h1>
              <p className="text-gray-600 mt-1">Book your dining experience with us</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-900 transition"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                    step >= s
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 transition ${
                      step > s ? 'bg-red-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-3">
            <span
              className={`text-sm font-medium ${
                step === 1 ? 'text-red-600' : 'text-gray-500'
              }`}
            >
              Date & Party
            </span>
            <span className="text-gray-300">|</span>
            <span
              className={`text-sm font-medium ${
                step === 2 ? 'text-red-600' : 'text-gray-500'
              }`}
            >
              Time
            </span>
            <span className="text-gray-300">|</span>
            <span
              className={`text-sm font-medium ${
                step === 3 ? 'text-red-600' : 'text-gray-500'
              }`}
            >
              Your Info
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} suppressHydrationWarning>
              {/* Step 1: Date & Party Size */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reservation Date *
                    </label>
                    <input
                      type="date"
                      value={formData.reservation_date}
                      suppressHydrationWarning
                      onChange={(e) =>
                        setFormData({ ...formData, reservation_date: e.target.value })
                      }
                      min={getMinDate()}
                      max={getMaxDate()}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-lg"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Select a date up to 30 days in advance
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Party Size *
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {[2, 3, 4, 5, 6, 8, 10, 12].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setFormData({ ...formData, party_size: size })}
                          className={`py-3 rounded-lg font-semibold transition ${
                            formData.party_size === size
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      For parties larger than 12, please call us directly
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Time Selection */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-4">
                      What time would you like to dine? ⏰
                    </label>

                    {loading ? (
                      <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-red-600"></div>
                        <p className="text-gray-600 mt-2">Loading available times...</p>
                      </div>
                    ) : availableSlots.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <div className="text-4xl mb-2">📅</div>
                        <p className="text-gray-700 font-medium">No available time slots</p>
                        <p className="text-gray-500 text-sm mt-1">Please try a different date</p>
                      </div>
                    ) : (
                      renderTimeSlotsByPeriod(availableSlots)
                    )}
                  </div>

                  {formData.reservation_time && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm text-green-800 font-medium mb-1">
                        ✓ Reservation Details
                      </p>
                      <p className="text-green-700">
                        {new Date(formData.reservation_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                        })}{' '}
                        at <strong>{formatTimeDisplay(formData.reservation_time)}</strong> for{' '}
                        <strong>{formData.party_size}</strong>{' '}
                        {formData.party_size === 1 ? 'guest' : 'guests'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Contact Information */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.customer_name}
                      onChange={(e) =>
                        setFormData({ ...formData, customer_name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.customer_email}
                      onChange={(e) =>
                        setFormData({ ...formData, customer_email: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.customer_phone}
                      onChange={(e) =>
                        setFormData({ ...formData, customer_phone: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      value={formData.special_requests}
                      onChange={(e) =>
                        setFormData({ ...formData, special_requests: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      rows={3}
                      placeholder="Allergies, dietary restrictions, special occasions..."
                    />
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800 font-medium mb-2">
                      📋 Reservation Summary
                    </p>
                    <div className="text-sm text-green-700 space-y-1">
                      <p>
                        <strong>Date:</strong>{' '}
                        {new Date(formData.reservation_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p>
                        <strong>Time:</strong> {formatTimeDisplay(formData.reservation_time)}
                      </p>
                      <p>
                        <strong>Party Size:</strong> {formData.party_size}{' '}
                        {formData.party_size === 1 ? 'guest' : 'guests'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-8">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep((step - 1) as 1 | 2 | 3)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                  >
                    ← Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!canProceed() || submitting}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {submitting
                    ? 'Submitting...'
                    : step === 3
                    ? 'Confirm Reservation'
                    : 'Continue →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
