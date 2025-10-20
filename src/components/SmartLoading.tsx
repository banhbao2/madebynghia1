interface SmartLoadingProps {
  context:
    | 'menu'           // "Bereite dein Menü vor..."
    | 'checkout'       // "Berechne Lieferzeit..."
    | 'reservation'    // "Suche nach verfügbaren Tischen..."
    | 'order'          // "Sende deine Bestellung..."
    | 'availability'   // "Prüfe Verfügbarkeit..."
    | 'processing'     // "Verarbeite deine Anfrage..."
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const loadingMessages = {
  menu: {
    icon: '🍜',
    message: 'Bereite dein Menü vor...',
    subtext: 'Frische Gerichte werden geladen'
  },
  checkout: {
    icon: '🚚',
    message: 'Berechne Lieferzeit...',
    subtext: 'Optimale Route wird ermittelt'
  },
  reservation: {
    icon: '🔍',
    message: 'Suche nach verfügbaren Tischen...',
    subtext: 'Prüfe Kapazitäten in Echtzeit'
  },
  order: {
    icon: '📤',
    message: 'Sende deine Bestellung...',
    subtext: 'Sichere Übertragung läuft'
  },
  availability: {
    icon: '📅',
    message: 'Prüfe Verfügbarkeit...',
    subtext: 'Aktuelle Zeitfenster werden geladen'
  },
  processing: {
    icon: '⚡',
    message: 'Verarbeite deine Anfrage...',
    subtext: 'Einen Moment bitte'
  }
}

export default function SmartLoading({ context, className = '', size = 'md' }: SmartLoadingProps) {
  const config = loadingMessages[context]

  const sizeClasses = {
    sm: {
      spinner: 'w-8 h-8',
      icon: 'text-2xl',
      message: 'text-sm',
      subtext: 'text-xs'
    },
    md: {
      spinner: 'w-12 h-12',
      icon: 'text-3xl',
      message: 'text-base',
      subtext: 'text-sm'
    },
    lg: {
      spinner: 'w-16 h-16',
      icon: 'text-4xl',
      message: 'text-lg',
      subtext: 'text-base'
    }
  }

  const sizes = sizeClasses[size]

  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      {/* Animated spinner with icon */}
      <div className="relative mb-4">
        <div className={`${sizes.spinner} border-4 border-gray-200 border-t-red-600 rounded-full animate-spin`}></div>
        <div className={`absolute inset-0 flex items-center justify-center ${sizes.icon}`}>
          {config.icon}
        </div>
      </div>

      {/* Context-aware message */}
      <p className={`font-bold text-gray-900 mb-2 ${sizes.message} animate-pulse`}>
        {config.message}
      </p>

      {/* Subtext for transparency */}
      <p className={`text-gray-600 ${sizes.subtext}`}>
        {config.subtext}
      </p>

      {/* Progress dots animation */}
      <div className="flex gap-1.5 mt-4">
        <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  )
}
