'use client'

import Link from 'next/link'

interface AdminNavbarProps {
  title: string
  icon: string
  onRefresh?: () => void
  subtitle?: string
  badge?: {
    count: number
    color?: 'red' | 'blue' | 'green' | 'yellow'
  }
  actions?: React.ReactNode
}

export default function AdminNavbar({
  title,
  icon,
  onRefresh,
  subtitle,
  badge,
  actions
}: AdminNavbarProps) {
  const getBadgeColor = (color?: string) => {
    switch (color) {
      case 'red': return 'bg-red-600 text-white'
      case 'blue': return 'bg-blue-600 text-white'
      case 'green': return 'bg-green-600 text-white'
      case 'yellow': return 'bg-yellow-600 text-white'
      default: return 'bg-gray-600 text-white'
    }
  }

  return (
    <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-3 py-2">
        <div className="flex items-center justify-between">
          {/* Left: Back button + Title */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Link
              href="/admin"
              className="text-gray-600 hover:text-gray-900 flex-shrink-0 text-lg"
            >
              ←
            </Link>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <h1 className="text-sm font-bold text-gray-900 flex items-center gap-1 whitespace-nowrap">
                {icon} {title}
              </h1>
              {badge && badge.count > 0 && (
                <span className={`${getBadgeColor(badge.color)} px-1.5 py-0.5 rounded-full text-xs font-bold flex-shrink-0`}>
                  {badge.count}
                </span>
              )}
              {subtitle && (
                <span className="text-xs text-gray-500 hidden sm:inline truncate">
                  {subtitle}
                </span>
              )}
            </div>
          </div>

          {/* Right: Custom actions or refresh button */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {actions || (
              onRefresh && (
                <button
                  onClick={onRefresh}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium text-sm"
                >
                  🔄
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
