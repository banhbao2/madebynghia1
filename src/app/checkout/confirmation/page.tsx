'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useRouter } from 'next/navigation'
import { formatTime, formatDateTime } from '@/lib/formatters'

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const orderId = searchParams.get('orderId')
  const email = searchParams.get('email')
  const name = searchParams.get('name')
  const orderType = searchParams.get('orderType') as 'delivery' | 'pickup' | null
  const total = searchParams.get('total')

  // Calculate estimated time
  const estimatedMinutes = orderType === 'delivery' ? 45 : 30
  const estimatedTime = new Date(Date.now() + estimatedMinutes * 60000)
  const estimatedTimeString = formatTime(estimatedTime)

  // Redirect if no order ID
  useEffect(() => {
    if (!orderId) {
      router.push('/menu')
    }
  }, [orderId, router])

  if (!orderId) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-50">
      <Header />
      <div className="pt-[60px] md:pt-[68px]">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-3xl mx-auto">
            {/* Success Animation */}
            <div className="text-center mb-8 animate-scale-in">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-float">
                <svg className="w-12 h-12 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
                <span className="gradient-text">Bestellung erfolgreich aufgegeben!</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-2">
                Vielen Dank, <span className="font-bold text-gray-900">{name || 'Kunde'}</span>!
              </p>

              <p className="text-base text-gray-600">
                Eine Bestätigungsmail wurde an <span className="font-semibold text-gray-900">{email}</span> gesendet
              </p>
            </div>

            {/* Order Type & Estimated Time - PROMINENT */}
            <div className={`mb-8 rounded-3xl p-6 md:p-8 border-3 shadow-2xl animate-fade-in-up animation-delay-200 ${
              orderType === 'delivery'
                ? 'bg-gradient-to-br from-blue-50 via-blue-100 to-teal-100 border-blue-300'
                : 'bg-gradient-to-br from-orange-50 via-orange-100 to-red-100 border-orange-300'
            }`}>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                    orderType === 'delivery' ? 'bg-blue-500' : 'bg-orange-500'
                  }`}>
                    <span className="text-4xl">{orderType === 'delivery' ? '🚚' : '🏪'}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Bestellart</p>
                    <p className="text-2xl md:text-3xl font-extrabold text-gray-900">
                      {orderType === 'delivery' ? 'Lieferung' : 'Abholung'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {orderType === 'delivery' ? 'Geschätzte Lieferung' : 'Bereit zur Abholung'}
                  </p>
                  <p className="text-3xl md:text-4xl font-extrabold gradient-text">
                    {estimatedTimeString} Uhr
                  </p>
                  <p className="text-sm text-gray-600 font-medium mt-1">
                    (~{estimatedMinutes} Minuten)
                  </p>
                </div>
              </div>

              {orderType === 'pickup' && (
                <div className="mt-6 pt-6 border-t-2 border-orange-200">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📍</span>
                    <div>
                      <p className="font-bold text-gray-900 mb-1">Abholadresse:</p>
                      <p className="text-gray-700 font-medium">
                        Hauptstraße 123<br />
                        Ihre Stadt, 10115
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Wir rufen Sie an, sobald Ihre Bestellung zur Abholung bereit ist!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {orderType === 'delivery' && (
                <div className="mt-6 pt-6 border-t-2 border-blue-200">
                  <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-4">
                    <span className="text-2xl">🎉</span>
                    <p className="text-sm text-gray-700 font-medium">
                      <span className="font-bold text-green-600">Kostenlose Lieferung!</span> Ihr Essen wird direkt zu Ihnen nach Hause geliefert.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Order Details Card */}
            <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8 border-2 border-gray-100 animate-fade-in-up animation-delay-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📦</span>
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900">Bestelldetails</h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Bestellnummer</span>
                  <span className="font-mono font-bold text-gray-900 bg-gray-100 px-4 py-2 rounded-lg">
                    #{orderId.slice(-8).toUpperCase()}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Bestelldatum</span>
                  <span className="font-semibold text-gray-900">
                    {formatDateTime(new Date())}
                  </span>
                </div>

                {total && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Gesamtbetrag</span>
                    <span className="font-bold text-xl text-gray-900">{total}€</span>
                  </div>
                )}

                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600 font-medium">Status</span>
                  <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                    In Bearbeitung
                  </span>
                </div>
              </div>
            </div>

            {/* What's Next Timeline */}
            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-3xl p-6 md:p-8 mb-8 border-2 border-purple-200 animate-fade-in-up animation-delay-400">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">⏱️</span>
                <h3 className="text-2xl font-extrabold text-gray-900">Was passiert jetzt?</h3>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 shadow-lg">
                      ✓
                    </div>
                    <div className="absolute top-10 left-5 w-0.5 h-12 bg-gradient-to-b from-green-500 to-blue-500"></div>
                  </div>
                  <div className="pt-1">
                    <p className="font-extrabold text-gray-900 text-lg">Bestellung erhalten!</p>
                    <p className="text-sm text-gray-600 mt-1">Ihre Bestellung wurde erfolgreich in unser System übermittelt</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 shadow-lg animate-pulse">
                      👨‍🍳
                    </div>
                    <div className="absolute top-10 left-5 w-0.5 h-12 bg-gradient-to-b from-blue-500 to-orange-500"></div>
                  </div>
                  <div className="pt-1">
                    <p className="font-extrabold text-gray-900 text-lg">Zubereitung läuft</p>
                    <p className="text-sm text-gray-600 mt-1">Unser Küchen-Team bereitet Ihre Speisen frisch zu</p>
                    <div className="mt-2 bg-white/60 backdrop-blur-sm rounded-lg px-3 py-2 inline-block">
                      <p className="text-xs font-bold text-blue-600">AKTUELLER SCHRITT</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 shadow-lg">
                      {orderType === 'delivery' ? '🚚' : '📦'}
                    </div>
                  </div>
                  <div className="pt-1">
                    <p className="font-extrabold text-gray-900 text-lg">
                      {orderType === 'delivery' ? 'Unterwegs zu Ihnen' : 'Bereit zur Abholung'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {orderType === 'delivery'
                        ? 'Ihre Bestellung wird zu Ihnen geliefert'
                        : 'Sie erhalten eine Benachrichtigung zur Abholung'}
                    </p>
                    <div className="mt-3 bg-white rounded-xl p-4 border-2 border-orange-200">
                      <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <span className="text-xl">🕐</span>
                        Voraussichtlich um <span className="text-red-600">{estimatedTimeString} Uhr</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8 animate-fade-in-up animation-delay-500">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="font-bold text-gray-900 mb-2">Wichtige Hinweise:</p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Sie erhalten eine E-Mail-Bestätigung an {email}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Wir informieren Sie, sobald Ihre Bestellung {orderType === 'delivery' ? 'unterwegs ist' : 'abholbereit ist'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Bei Fragen kontaktieren Sie uns gerne telefonisch oder per E-Mail</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 animate-fade-in-up animation-delay-600">
              <Link
                href="/menu"
                className="block w-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-4 rounded-xl hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] active:scale-95 transition-all font-bold text-lg text-center"
              >
                Weiter einkaufen
              </Link>
            </div>

            {/* Help Section */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4 font-medium">Fragen zu Ihrer Bestellung?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+493012345678"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 rounded-xl hover:border-red-500 hover:bg-red-50 transition font-medium text-gray-700 shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +49 30 12345678
                </a>
                <a
                  href="mailto:hallo@nghiademo.com"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 rounded-xl hover:border-red-500 hover:bg-red-50 transition font-medium text-gray-700 shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  hallo@nghiademo.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Laden...</p>
        </div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  )
}
