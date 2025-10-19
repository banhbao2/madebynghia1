import { MenuGridSkeleton } from '@/components/MenuItemSkeleton'

/**
 * Loading state for Admin Menu Page
 */
export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center animate-pulse">
        <div>
          <div className="h-8 bg-gray-200 rounded w-56 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-80"></div>
        </div>
        <div className="h-12 w-48 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Category Filter Skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-2 animate-pulse">
        {['All', 'Pho', 'Sushi', 'Appetizers', 'Drinks'].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 rounded-lg w-28 flex-shrink-0"></div>
        ))}
      </div>

      {/* Search Bar Skeleton */}
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded-xl w-full max-w-md"></div>
      </div>

      {/* Menu Items Grid Skeleton */}
      <MenuGridSkeleton count={12} />
    </div>
  )
}
