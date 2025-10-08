interface InfoItem {
  emoji: string
  title: string
  description: string
}

const INFO_ITEMS: InfoItem[] = [
  {
    emoji: '🚚',
    title: 'Free Delivery',
    description: 'On orders over $30',
  },
  {
    emoji: '⏱️',
    title: 'Fast Preparation',
    description: 'Ready in 20-30 minutes',
  },
  {
    emoji: '✨',
    title: 'Fresh Ingredients',
    description: 'Made to order daily',
  },
]

interface InfoBannerProps {
  className?: string
}

export default function InfoBanner({ className = '' }: InfoBannerProps) {
  return (
    <div className={`grid md:grid-cols-3 gap-6 text-center ${className}`}>
      {INFO_ITEMS.map((item) => (
        <div key={item.title} className="bg-white rounded-lg p-6 shadow-md">
          <div className="text-3xl mb-2">{item.emoji}</div>
          <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
          <p className="text-sm text-gray-600">{item.description}</p>
        </div>
      ))}
    </div>
  )
}
