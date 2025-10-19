import Header from '@/components/Header'
import { MenuGridSkeleton } from '@/components/MenuItemSkeleton'

/**
 * Loading state for Menu Page
 * Automatically shown by Next.js while the page is loading
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <div className="pt-[60px] md:pt-[68px]">
        {/* Hero Section Skeleton */}
        <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-orange-600 text-white py-16 overflow-hidden">
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="animate-pulse">
              <div className="h-12 bg-white/20 rounded-lg w-64 mx-auto mb-4"></div>
              <div className="h-6 bg-white/20 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </section>

        {/* Category Tabs Skeleton */}
        <div className="sticky top-[60px] md:top-[68px] z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 py-4 overflow-x-auto">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-10 bg-gray-200 rounded-lg w-32 flex-shrink-0 animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items Skeleton */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="animate-pulse mb-8">
              <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>

            <MenuGridSkeleton count={9} />
          </div>
        </section>
      </div>
    </div>
  )
}
