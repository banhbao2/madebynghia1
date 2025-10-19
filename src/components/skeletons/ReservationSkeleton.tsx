/**
 * Reservation Card Skeleton for Admin Reservations Page
 */

export default function ReservationSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-40 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-56"></div>
        </div>
        <div className="h-8 w-28 bg-gray-200 rounded-full"></div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-32"></div>
        </div>
        <div>
          <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-24"></div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-36"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-28"></div>
        </div>
      </div>
    </div>
  )
}

export function ReservationListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <ReservationSkeleton key={index} />
      ))}
    </div>
  )
}
