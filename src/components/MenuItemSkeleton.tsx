export default function MenuItemSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border-l-4 border-gray-200 overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="h-48 w-full bg-gray-200"></div>

      <div className="p-6">
        {/* Title and Price Row */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            </div>
          </div>
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>

        {/* Button Skeleton */}
        <div className="h-12 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  )
}

export function MenuGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <MenuItemSkeleton key={index} />
      ))}
    </div>
  )
}
