/**
 * Loading state for Admin Dashboard
 */
export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-96"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-32"></div>
          </div>
        ))}
      </div>

      {/* Charts Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart Skeleton */}
        <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>

        {/* Orders Chart Skeleton */}
        <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Recent Activity Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Skeleton */}
        <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center pb-4 border-b">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-48"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reservations Skeleton */}
        <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center pb-4 border-b">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-40 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-56"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
