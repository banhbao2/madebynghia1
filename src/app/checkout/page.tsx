'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { operatingHours } from '@/lib/constants'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart, subtotal, tax, total, itemCount } = useCart()
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    street: '',
    houseNumber: '',
    city: '',
    notes: '',
    honeypot: ''
  })
  const [submissionTime, setSubmissionTime] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>('')

  // Track if order was submitted to prevent redirect after clearing cart
  const [orderSubmitted, setOrderSubmitted] = useState(false)

  // Helper function to parse time string (e.g., "11:00") and set it to a specific date
  const setTimeOnDate = (date: Date, timeString: string): Date => {
    const [hours, minutes] = timeString.split(':').map(Number)
    const newDate = new Date(date)
    newDate.setHours(hours, minutes, 0, 0)
    return newDate
  }

  // Check if a time is within operating hours for a given day
  const isWithinOperatingHours = (date: Date): boolean => {
    const dayOfWeek = date.getDay() // 0 = Sunday, 1 = Monday, etc.
    const hours = operatingHours[dayOfWeek as keyof typeof operatingHours]

    if (!hours) return false

    const openTime = setTimeOnDate(date, hours.open)
    const closeTime = setTimeOnDate(date, hours.close)

    return date >= openTime && date <= closeTime
  }

  // Generate time slots starting 20 minutes from now, only during operating hours
  const generateTimeSlots = () => {
    const slots: { value: string; label: string; date: Date }[] = []
    const now = new Date()
    const minTime = new Date(now.getTime() + 20 * 60000) // 20 minutes from now

    // Round up to next 15-minute interval
    const roundedMinutes = Math.ceil(minTime.getMinutes() / 15) * 15
    minTime.setMinutes(roundedMinutes)
    minTime.setSeconds(0)
    minTime.setMilliseconds(0)

    // Generate slots for the next 7 days
    const daysToCheck = 7
    let currentDay = new Date(minTime)
    currentDay.setHours(0, 0, 0, 0)

    for (let dayOffset = 0; dayOffset < daysToCheck; dayOffset++) {
      const checkDate = new Date(currentDay.getTime() + dayOffset * 24 * 60 * 60000)
      const dayOfWeek = checkDate.getDay()
      const hours = operatingHours[dayOfWeek as keyof typeof operatingHours]

      if (!hours) continue // Skip if restaurant is closed this day

      // Get opening and closing times for this day
      const openTime = setTimeOnDate(checkDate, hours.open)
      const closeTime = setTimeOnDate(checkDate, hours.close)

      // For today, start from minTime or opening time (whichever is later)
      let startTime: Date
      if (dayOffset === 0) {
        startTime = minTime > openTime ? minTime : openTime
      } else {
        startTime = openTime
      }

      // Generate 15-minute slots from opening to closing
      let currentSlot = new Date(startTime)

      // Round to next 15-minute interval
      const minutes = currentSlot.getMinutes()
      const roundedMinutes = Math.ceil(minutes / 15) * 15
      currentSlot.setMinutes(roundedMinutes)
      currentSlot.setSeconds(0)
      currentSlot.setMilliseconds(0)

      while (currentSlot <= closeTime) {
        const value = currentSlot.toISOString()
        const isToday = currentSlot.toDateString() === now.toDateString()
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60000)
        const isTomorrow = currentSlot.toDateString() === tomorrow.toDateString()

        let label = currentSlot.toLocaleTimeString('de-DE', {
          hour: '2-digit',
          minute: '2-digit'
        })

        if (isToday) {
          label += ' (Heute)'
        } else if (isTomorrow) {
          label += ' (Morgen)'
        } else {
          label += ` (${currentSlot.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' })})`
        }

        slots.push({ value, label, date: new Date(currentSlot) })
        currentSlot = new Date(currentSlot.getTime() + 15 * 60000) // Add 15 minutes
      }
    }

    return slots
  }

  const [timeSlots, setTimeSlots] = useState<{ value: string; label: string; date: Date }[]>([])
  const [closedMessage, setClosedMessage] = useState<string>('')

  // Initialize time slots and set default selection
  useEffect(() => {
    const slots = generateTimeSlots()
    setTimeSlots(slots)

    if (slots.length > 0 && !selectedTime) {
      setSelectedTime(slots[0].value)
      setClosedMessage('')
    } else if (slots.length === 0) {
      // Check if we're currently closed or opening soon
      const now = new Date()
      const dayOfWeek = now.getDay()
      const todayHours = operatingHours[dayOfWeek as keyof typeof operatingHours]

      if (todayHours) {
        const openTime = setTimeOnDate(now, todayHours.open)
        const closeTime = setTimeOnDate(now, todayHours.close)

        if (now < openTime) {
          setClosedMessage(`Wir öffnen heute um ${todayHours.open} Uhr. Bestellungen können ab dann aufgegeben werden.`)
        } else if (now > closeTime) {
          // Find next opening day
          let nextDay = (dayOfWeek + 1) % 7
          let daysChecked = 0
          while (daysChecked < 7) {
            const nextDayHours = operatingHours[nextDay as keyof typeof operatingHours]
            if (nextDayHours) {
              const dayName = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'][nextDay]
              setClosedMessage(`Wir haben heute geschlossen. Nächste Öffnung: ${dayName} um ${nextDayHours.open} Uhr.`)
              break
            }
            nextDay = (nextDay + 1) % 7
            daysChecked++
          }
        }
      } else {
        setClosedMessage('Wir haben heute geschlossen. Bitte versuchen Sie es an einem anderen Tag.')
      }
    }
  }, [])

  // Redirect if cart is empty (but not if order was just submitted)
  useEffect(() => {
    if (itemCount === 0 && !orderSubmitted) {
      router.push('/menu')
    }
  }, [itemCount, router, orderSubmitted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    // Spam prevention checks
    if (formData.honeypot) {
      setError('Ungültige Übermittlung erkannt.')
      setIsSubmitting(false)
      return
    }

    const timeTaken = Date.now() - submissionTime
    if (timeTaken < 3000) {
      setError('Bitte nehmen Sie sich Zeit, um das Formular auszufüllen.')
      setIsSubmitting(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Bitte geben Sie eine gültige E-Mail-Adresse ein.')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_email: formData.email,
          delivery_address: orderType === 'delivery'
            ? `${formData.street} ${formData.houseNumber}, ${formData.city}`.trim()
            : undefined,
          order_type: orderType,
          scheduled_time: selectedTime,
          special_notes: formData.notes || undefined,
          items: items,
          subtotal: subtotal,
          tax: tax,
          total: total
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Bestellung konnte nicht aufgegeben werden')
      }

      // Send confirmation email
      if (formData.email) {
        try {
          const orderDate = new Date().toLocaleString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })

          const scheduledTimeFormatted = selectedTime ? new Date(selectedTime).toLocaleString('de-DE', {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) : undefined

          await fetch('/api/send-order-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              customerEmail: formData.email,
              customerName: formData.name,
              orderNumber: data.order.id.slice(-8),
              orderType,
              items: items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                customizations: item.selectedCustomizations
              })),
              subtotal,
              tax,
              total,
              scheduledTime: scheduledTimeFormatted,
              deliveryAddress: orderType === 'delivery'
                ? `${formData.street} ${formData.houseNumber}, ${formData.city}`.trim()
                : undefined,
              orderDate
            })
          })
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError)
        }
      }

      // Mark order as submitted to prevent redirect from empty cart
      setOrderSubmitted(true)

      // Clear cart and redirect to confirmation page with order details
      clearCart()
      router.push(`/checkout/confirmation?orderId=${data.order.id}&email=${encodeURIComponent(formData.email)}&name=${encodeURIComponent(formData.name)}&orderType=${orderType}&total=${total.toFixed(2)}`)

    } catch (err) {
      console.error('Error submitting order:', err)
      setError(err instanceof Error ? err.message : 'Bestellung konnte nicht aufgegeben werden. Bitte versuchen Sie es erneut.')
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value.trim()
    setFormData(prev => ({ ...prev, [e.target.name]: value }))

    if (submissionTime === 0) {
      setSubmissionTime(Date.now())
    }
  }

  if (itemCount === 0) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <div className="pt-[60px] md:pt-[68px]">

        {/* Progress Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-center gap-2 md:gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <span className="hidden sm:inline text-sm font-medium text-gray-900">Warenkorb</span>
              </div>
              <div className="w-12 md:w-20 h-1 bg-red-500"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <span className="hidden sm:inline text-sm font-medium text-gray-900">Kasse</span>
              </div>
              <div className="w-12 md:w-20 h-1 bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <span className="hidden sm:inline text-sm font-medium text-gray-500">Bestätigung</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Zurück zum Menü
            </Link>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8">
                    <span className="gradient-text">Checkout</span>
                  </h1>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Order Type Selection */}
                    <div>
                      <label className="block text-lg font-bold text-gray-900 mb-4">
                        1. Bestellart wählen
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setOrderType('delivery')}
                          className={`group relative p-6 border-3 rounded-2xl transition-all ${
                            orderType === 'delivery'
                              ? 'border-red-500 bg-red-50 shadow-lg'
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                          }`}
                        >
                          <div className="text-4xl mb-3">🚚</div>
                          <div className="font-bold text-lg text-gray-900">Lieferung</div>
                          <p className="text-sm text-gray-600 mt-1">30-45 Min</p>
                          {orderType === 'delivery' && (
                            <div className="absolute top-3 right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setOrderType('pickup')}
                          className={`group relative p-6 border-3 rounded-2xl transition-all ${
                            orderType === 'pickup'
                              ? 'border-red-500 bg-red-50 shadow-lg'
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                          }`}
                        >
                          <div className="text-4xl mb-3">🏪</div>
                          <div className="font-bold text-lg text-gray-900">Abholung</div>
                          <p className="text-sm text-gray-600 mt-1">20-30 Min</p>
                          {orderType === 'pickup' && (
                            <div className="absolute top-3 right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Time Selection */}
                    <div>
                      <label className="block text-lg font-bold text-gray-900 mb-4">
                        2. {orderType === 'delivery' ? 'Lieferzeit' : 'Abholzeit'} wählen
                      </label>

                      {closedMessage ? (
                        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                          <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="font-semibold text-yellow-800 mb-1">Restaurant geschlossen</p>
                            <p className="text-sm text-yellow-700">{closedMessage}</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <select
                              value={selectedTime}
                              onChange={(e) => setSelectedTime(e.target.value)}
                              required
                              disabled={timeSlots.length === 0}
                              className="w-full border-2 border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-base appearance-none bg-white cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                              {timeSlots.length === 0 ? (
                                <option value="">Keine verfügbaren Zeitfenster</option>
                              ) : (
                                timeSlots.map((slot) => (
                                  <option key={slot.value} value={slot.value}>
                                    {slot.label}
                                  </option>
                                ))
                              )}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2 flex items-start gap-2">
                            <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <span>
                              Nur Zeiten während der Öffnungszeiten verfügbar (mindestens 20 Minuten im Voraus).
                              {orderType === 'delivery' ? ' Lieferzeit: 30-45 Minuten.' : ' Vorbereitungszeit: 20-30 Minuten.'}
                            </span>
                          </p>
                        </>
                      )}
                    </div>

                    {/* Contact Information */}
                    <div>
                      <label className="block text-lg font-bold text-gray-900 mb-4">
                        3. Kontaktinformationen
                      </label>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                            Vollständiger Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-base"
                            placeholder="Max Mustermann"
                          />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                              Telefonnummer *
                            </label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              required
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-base"
                              placeholder="+49 123 456789"
                            />
                          </div>

                          <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                              E-Mail *
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              required
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-base"
                              placeholder="ihre@email.de"
                            />
                          </div>
                        </div>

                        {/* Honeypot */}
                        <input
                          type="text"
                          name="honeypot"
                          value={formData.honeypot}
                          onChange={handleInputChange}
                          style={{ display: 'none' }}
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </div>
                    </div>

                    {/* Delivery Address */}
                    {orderType === 'delivery' && (
                      <div>
                        <label className="block text-lg font-bold text-gray-900 mb-4">
                          4. Lieferadresse
                        </label>
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2">
                              <label htmlFor="street" className="block text-sm font-semibold text-gray-700 mb-2">
                                Straße *
                              </label>
                              <input
                                type="text"
                                id="street"
                                name="street"
                                required
                                value={formData.street}
                                onChange={handleInputChange}
                                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-base"
                                placeholder="Hauptstraße"
                              />
                            </div>
                            <div>
                              <label htmlFor="houseNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                                Nr. *
                              </label>
                              <input
                                type="text"
                                id="houseNumber"
                                name="houseNumber"
                                required
                                value={formData.houseNumber}
                                onChange={handleInputChange}
                                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-base"
                                placeholder="123"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                              Stadt *
                            </label>
                            <input
                              type="text"
                              id="city"
                              name="city"
                              required
                              value={formData.city}
                              onChange={handleInputChange}
                              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-base"
                              placeholder="Ihre Stadt"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Pickup Info */}
                    {orderType === 'pickup' && (
                      <div className="bg-gradient-to-br from-blue-50 to-teal-50 border-2 border-blue-200 rounded-2xl p-6">
                        <div className="flex items-start gap-4">
                          <div className="text-3xl">📍</div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 mb-2">Abholort</h3>
                            <p className="text-gray-700 font-medium">
                              Hauptstraße 123<br />
                              Ihre Stadt<br />
                              <span className="text-sm text-gray-600 mt-2 block">
                                Wir benachrichtigen Sie, sobald Ihre Bestellung fertig ist!
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Special Instructions */}
                    <div>
                      <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
                        Besondere Anweisungen (optional)
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={4}
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-base"
                        placeholder="Spezielle Wünsche, Allergien, Ernährungseinschränkungen..."
                      />
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
                        <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-red-700 font-medium">{error}</p>
                      </div>
                    )}

                    {/* Submit Button - Mobile */}
                    <div className="lg:hidden">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-4 rounded-xl hover:shadow-lg transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Wird verarbeitet...
                          </>
                        ) : (
                          <>
                            Bestellung aufgeben
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Column - Order Summary (Sticky on Desktop) */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Bestellübersicht</h2>

                  {/* Items */}
                  <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.cartItemId} className="flex justify-between items-start gap-3 py-3 border-b border-gray-100 last:border-0">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-600">Menge: {item.quantity}</div>
                        </div>
                        <div className="font-bold text-gray-900">{(item.price * item.quantity).toFixed(2)}€</div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-700">
                      <span>Zwischensumme</span>
                      <span className="font-semibold">{subtotal.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>MwSt (8,75%)</span>
                      <span className="font-semibold">{tax.toFixed(2)}€</span>
                    </div>
                    {orderType === 'delivery' && (
                      <div className="flex justify-between text-gray-700">
                        <span>Lieferung</span>
                        <span className="font-semibold text-green-600">Kostenlos</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xl font-extrabold text-gray-900 pt-3 border-t-2 border-gray-200">
                      <span>Gesamt</span>
                      <span className="gradient-text">{total.toFixed(2)}€</span>
                    </div>
                  </div>

                  {/* Desktop Submit Button */}
                  <button
                    type="submit"
                    form="checkout-form"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="hidden lg:flex w-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-4 rounded-xl hover:shadow-lg transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Wird verarbeitet...
                      </>
                    ) : (
                      <>
                        Bestellung aufgeben
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </button>

                  {/* Security Badge */}
                  <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Sichere Bestellung</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}
