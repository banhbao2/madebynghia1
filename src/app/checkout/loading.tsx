import Header from '@/components/Header'

/**
 * Loading state for Checkout Page
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <div className="pt-[60px] md:pt-[68px]">
        {/* Progress Bar Skeleton */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
              <div className="h-px w-12 bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form Skeleton */}
              <div className="lg:col-span-2 space-y-6">
                {/* Order Type Skeleton */}
                <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-12 bg-gray-200 rounded-xl"></div>
                    <div className="h-12 bg-gray-200 rounded-xl"></div>
                  </div>
                </div>

                {/* Customer Info Skeleton */}
                <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
                  <div className="space-y-4">
                    <div className="h-12 bg-gray-200 rounded-xl"></div>
                    <div className="h-12 bg-gray-200 rounded-xl"></div>
                    <div className="h-12 bg-gray-200 rounded-xl"></div>
                  </div>
                </div>

                {/* Delivery Address Skeleton */}
                <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 h-12 bg-gray-200 rounded-xl"></div>
                      <div className="h-12 bg-gray-200 rounded-xl"></div>
                    </div>
                    <div className="h-12 bg-gray-200 rounded-xl"></div>
                  </div>
                </div>
              </div>

              {/* Order Summary Skeleton */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
                  <div className="space-y-3 mb-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="flex justify-between mb-2">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <div className="h-6 bg-gray-200 rounded w-24"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="h-14 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
