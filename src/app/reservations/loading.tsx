import Header from '@/components/Header'

/**
 * Loading state for Reservations Page
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <div className="pt-[60px] md:pt-[68px]">
        {/* Hero Section Skeleton */}
        <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 text-white py-20">
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-white/20 rounded-lg w-96 mx-auto"></div>
              <div className="h-6 bg-white/20 rounded w-[500px] mx-auto"></div>
            </div>
          </div>
        </section>

        {/* Form Section Skeleton */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column - Form */}
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>

                    {/* Date Picker Skeleton */}
                    <div className="space-y-4">
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-12 bg-gray-200 rounded-xl"></div>
                      </div>

                      {/* Party Size Skeleton */}
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-36 mb-2"></div>
                        <div className="h-12 bg-gray-200 rounded-xl"></div>
                      </div>

                      {/* Check Availability Button Skeleton */}
                      <div className="h-14 bg-gray-200 rounded-xl"></div>
                    </div>
                  </div>

                  {/* Customer Info Skeleton */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
                    <div className="space-y-4">
                      <div className="h-12 bg-gray-200 rounded-xl"></div>
                      <div className="h-12 bg-gray-200 rounded-xl"></div>
                      <div className="h-12 bg-gray-200 rounded-xl"></div>
                      <div className="h-24 bg-gray-200 rounded-xl"></div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Info */}
                <div className="space-y-6">
                  {/* Time Slots Skeleton */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
                    <div className="grid grid-cols-2 gap-3">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded-xl"></div>
                      ))}
                    </div>
                  </div>

                  {/* Info Card Skeleton */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 animate-pulse">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-gray-300 rounded"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-gray-300 rounded"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
