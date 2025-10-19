import { ReservationListSkeleton } from '@/components/skeletons/ReservationSkeleton'

/**
 * Loading state for Admin Reservations Page
 */
export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center animate-pulse">
        <div>
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-72"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      {/* Filter Tabs Skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-2 animate-pulse">
        {['Alle', 'Ausstehend', 'Bestätigt', 'Abgeschlossen'].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 rounded-lg w-32 flex-shrink-0"></div>
        ))}
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>

      {/* Calendar Skeleton */}
      <div className="bg-white rounded-xl shadow p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>

      {/* Reservations List Skeleton */}
      <ReservationListSkeleton count={6} />
    </div>
  )
}
