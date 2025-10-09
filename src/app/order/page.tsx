'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OrderPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to unified menu page
    router.replace('/menu')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Redirecting to menu...</p>
      </div>
    </div>
  )
}