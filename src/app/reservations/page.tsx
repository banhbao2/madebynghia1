'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TimeSlotPicker from '@/components/TimeSlotPicker'
import { createClient } from '@/lib/supabase-browser'
import { ReservationFormData, TimeSlot } from '@/types/reservation'

export default function ReservationsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [mounted, setMounted] = useState(false)

  // Fix hydration by only rendering date formatting on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get today's date (for default value)
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  // Form state
  const [formData, setFormData] = useState<ReservationFormData>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    reservation_date: getTodayDate(), // Default to today
    reservation_time: '',
    party_size: 2,
    special_requests: '',
  })

  // UI state
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showTimeSlots, setShowTimeSlots] = useState(false)

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  // Get maximum date (30 days from now)
  const getMaxDate = () => {
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 30)
    return maxDate.toISOString().split('T')[0]
  }

  // Check if a time slot is in the future
  const isTimeInFuture = (timeString: string) => {
    const selectedDate = formData.reservation_date
    const today = getTodayDate()

    // If not today, all times are valid
    if (selectedDate !== today) {
      return true
    }

    // If today, check if time is at least 30 minutes from now
    const now = new Date()
    const [hours, minutes] = timeString.split(':').map(Number)
    const slotTime = new Date()
    slotTime.setHours(hours, minutes, 0, 0)

    // Add 30 minute buffer
    const minTime = new Date(now.getTime() + 30 * 60000)

    return slotTime >= minTime
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
      const response = await fetch(
        `/api/reservations/availability?date=${formData.reservation_date}`
      )
      const data = await response.json()

      if (response.ok) {
        // Filter slots to only show future times if today is selected
        let slots = data.slots || []
        if (formData.reservation_date === getTodayDate()) {
          slots = slots.filter((slot: TimeSlot) => isTimeInFuture(slot.time))
        }

        setAvailableSlots(slots)
        setShowTimeSlots(true)
      } else {
        console.error('API Error:', data.error)
        alert(`Fehler beim Laden der Zeitfenster: ${data.error || 'Unbekannter Fehler'}`)
      }
    } catch (error) {
      console.error('Error fetching slots:', error)
      alert('Verfügbare Zeitfenster konnten nicht geladen werden. Bitte versuchen Sie es erneut.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.reservation_date || !formData.reservation_time || !formData.party_size) {
      alert('Bitte füllen Sie alle erforderlichen Felder aus.')
      return
    }

    if (!formData.customer_name || !formData.customer_email || !formData.customer_phone) {
      alert('Bitte geben Sie Ihre Kontaktdaten ein.')
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
        throw new Error(data.error || 'Fehler beim Erstellen der Reservierung')
      }

      // Redirect to confirmation page
      router.push(`/reservations/confirmation?id=${data.reservation.id}`)
    } catch (error) {
      console.error('Error creating reservation:', error)
      alert(error instanceof Error ? error.message : 'Fehler beim Erstellen der Reservierung')
    } finally {
      setSubmitting(false)
    }
  }

  // Helper: Format time for display (24-hour format for German)
  const formatTimeDisplay = (time: string) => {
    return `${time} Uhr`
  }

  // Helper: Format date safely (avoid hydration errors)
  const formatDateDisplay = (dateString: string) => {
    if (!mounted) return '' // Return empty during SSR

    const date = new Date(dateString)
    return date.toLocaleDateString('de-DE', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />

      <div className="pt-[60px] md:pt-[68px]">
      {/* Hero Section - Mobile optimized */}
      <section className="relative bg-gradient-to-br from-red-600 to-orange-600 text-white py-12 sm:py-16 md:py-20 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6">
            Tisch reservieren
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-red-50 max-w-2xl mx-auto px-2">
            Buchen Sie Ihren Platz und genießen Sie ein unvergessliches kulinarisches Erlebnis
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 overflow-x-hidden">
              {/* Step 1: Date & Party Size - Mobile optimized */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-6 md:p-8 border border-gray-100">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <span className="bg-red-600 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-lg font-bold flex-shrink-0">1</span>
                  <span>Datum & Personenanzahl</span>
                </h2>

                <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reservierungsdatum *
                    </label>
                    <input
                      type="date"
                      value={formData.reservation_date}
                      onChange={(e) =>
                        setFormData({ ...formData, reservation_date: e.target.value, reservation_time: '' })
                      }
                      min={getMinDate()}
                      max={getMaxDate()}
                      className="w-full px-4 py-3.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base sm:text-lg transition touch-manipulation"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1.5">
                      📅 Sie können ab heute bis zu 30 Tage im Voraus buchen
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Anzahl der Personen *
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[2, 3, 4, 5, 6, 8, 10, 12].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setFormData({ ...formData, party_size: size })}
                          className={`py-3.5 sm:py-3 rounded-xl font-semibold text-base sm:text-lg transition-all touch-manipulation active:scale-95 ${
                            formData.party_size === size
                              ? 'bg-red-600 text-white shadow-lg scale-105'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Für Gruppen größer als 12 Personen rufen Sie uns bitte direkt an
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2: Time Selection - Mobile optimized */}
              {showTimeSlots && (
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-6 md:p-8 border border-gray-100">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6 flex items-center gap-2 sm:gap-3">
                    <span className="bg-red-600 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-lg font-bold flex-shrink-0">2</span>
                    <span>Wählen Sie Ihre Uhrzeit</span>
                  </h2>

                  <TimeSlotPicker
                    slots={availableSlots}
                    selectedTime={formData.reservation_time}
                    onSelectTime={(time) => setFormData({ ...formData, reservation_time: time })}
                    loading={loading}
                  />
                </div>
              )}

              {/* Step 3: Contact Information - Mobile optimized */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-6 md:p-8 border border-gray-100">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <span className="bg-red-600 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-lg font-bold flex-shrink-0">3</span>
                  <span>Ihre Kontaktdaten</span>
                </h2>

                <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vollständiger Name *
                    </label>
                    <input
                      type="text"
                      value={formData.customer_name}
                      onChange={(e) =>
                        setFormData({ ...formData, customer_name: e.target.value })
                      }
                      className="w-full px-4 py-3.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition touch-manipulation text-base"
                      placeholder="Max Mustermann"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-Mail-Adresse *
                    </label>
                    <input
                      type="email"
                      value={formData.customer_email}
                      onChange={(e) =>
                        setFormData({ ...formData, customer_email: e.target.value })
                      }
                      className="w-full px-4 py-3.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition touch-manipulation text-base"
                      placeholder="max@beispiel.de"
                      inputMode="email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefonnummer *
                    </label>
                    <input
                      type="tel"
                      value={formData.customer_phone}
                      onChange={(e) =>
                        setFormData({ ...formData, customer_phone: e.target.value })
                      }
                      className="w-full px-4 py-3.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition touch-manipulation text-base"
                      placeholder="+49 30 12345678"
                      inputMode="tel"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Besondere Wünsche (Optional)
                    </label>
                    <textarea
                      value={formData.special_requests}
                      onChange={(e) =>
                        setFormData({ ...formData, special_requests: e.target.value })
                      }
                      className="w-full px-4 py-3.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition touch-manipulation text-base"
                      rows={3}
                      placeholder="Allergien, Ernährungseinschränkungen, besondere Anlässe..."
                    />
                  </div>
                </div>
              </div>

              {/* Summary & Submit - Always visible, updates dynamically */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-6 md:p-8 border-2 border-green-200">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">📋</span>
                  <span>Reservierungszusammenfassung</span>
                </h3>

                {/* Summary Cards - Stack on mobile to prevent horizontal scroll */}
                <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-3 md:gap-4 mb-5 sm:mb-6">
                  {/* Date Card */}
                  <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
                    <p className="text-xs text-gray-500 font-medium mb-1">DATUM</p>
                    <p className="text-gray-900 font-bold text-sm sm:text-base break-words">
                      {mounted ? formatDateDisplay(formData.reservation_date) : formData.reservation_date}
                    </p>
                  </div>

                  {/* Time Card */}
                  <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
                    <p className="text-xs text-gray-500 font-medium mb-1">UHRZEIT</p>
                    <p className="text-gray-900 font-bold text-sm sm:text-base">
                      {formData.reservation_time ? formatTimeDisplay(formData.reservation_time) : '–'}
                    </p>
                  </div>

                  {/* Party Size Card */}
                  <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
                    <p className="text-xs text-gray-500 font-medium mb-1">PERSONEN</p>
                    <p className="text-gray-900 font-bold text-sm sm:text-base">
                      {formData.party_size} {formData.party_size === 1 ? 'Person' : 'Personen'}
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={
                    submitting ||
                    !formData.reservation_time ||
                    !formData.customer_name ||
                    !formData.customer_email ||
                    !formData.customer_phone
                  }
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 sm:px-8 py-4 rounded-xl text-base sm:text-lg font-bold hover:from-red-700 hover:to-red-800 active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2 touch-manipulation"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      Wird gesendet...
                    </>
                  ) : (
                    <>
                      <span>Reservierung bestätigen</span>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </>
                  )}
                </button>

                {/* Helper text */}
                {!formData.reservation_time && (
                  <p className="text-sm text-gray-600 text-center mt-3">
                    Bitte wählen Sie eine Uhrzeit aus
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </div>
  )
}
