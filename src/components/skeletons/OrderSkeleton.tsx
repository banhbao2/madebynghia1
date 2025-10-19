/**
 * Order Card Skeleton for Admin Orders Page
 */

export default function OrderSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
        <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-40"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-36"></div>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <div className="h-5 bg-gray-200 rounded w-24"></div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  )
}

export function OrderListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <OrderSkeleton key={index} />
      ))}
    </div>
  )
}
