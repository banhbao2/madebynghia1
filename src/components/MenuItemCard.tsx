import { MenuItem } from '@/lib/menuData'

interface MenuItemCardProps {
  item: MenuItem
  showImage?: boolean
  variant?: 'compact' | 'detailed'
}

export default function MenuItemCard({
  item,
  showImage = false,
  variant = 'detailed'
}: MenuItemCardProps) {
  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group">
        {showImage && (
          <div className="relative h-48 bg-gray-200">
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            {item.popular && (
              <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Popular
              </div>
            )}
          </div>
        )}
        <div className="p-4">
          <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
          <p className="text-red-600 font-bold text-lg">${item.price.toFixed(2)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
            {item.popular && (
              <span className="text-yellow-500 text-sm">⭐</span>
            )}
          </div>
          <p className="text-gray-600 mt-2">{item.description}</p>
          {item.customizations && (
            <div className="mt-3 text-sm text-gray-500">
              <span className="font-semibold">Customizable:</span>{' '}
              {item.customizations.map(c => c.label).join(', ')}
            </div>
          )}
        </div>
        <div className="ml-4">
          <p className="text-red-600 font-bold text-xl whitespace-nowrap">
            ${item.price.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}
