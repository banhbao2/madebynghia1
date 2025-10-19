import { OrderListSkeleton } from '@/components/skeletons/OrderSkeleton'

/**
 * Loading state for Admin Orders Page
 */
export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center animate-pulse">
        <div>
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Filter Tabs Skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-2 animate-pulse">
        {['Alle', 'Ausstehend', 'In Bearbeitung', 'Abgeschlossen'].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 rounded-lg w-32 flex-shrink-0"></div>
        ))}
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>

      {/* Orders List Skeleton */}
      <OrderListSkeleton count={6} />
    </div>
  )
}
