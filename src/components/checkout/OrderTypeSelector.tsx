interface OrderTypeSelectorProps {
  value: 'delivery' | 'pickup'
  onChange: (type: 'delivery' | 'pickup') => void
  disabled?: boolean
}

export default function OrderTypeSelector({ value, onChange, disabled = false }: OrderTypeSelectorProps) {
  return (
    <div>
      <label className="block text-lg font-bold text-gray-900 mb-4">
        1. Bestellart wählen
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onChange('delivery')}
          disabled={disabled}
          className={`group relative p-6 border-3 rounded-2xl transition-all ${
            value === 'delivery'
              ? 'border-red-500 bg-red-50 shadow-lg'
              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
          } ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
        >
          <div className="text-4xl mb-3">🚚</div>
          <div className="font-bold text-lg text-gray-900">Lieferung</div>
          <p className="text-sm text-gray-600 mt-1">30-45 Min</p>
          {value === 'delivery' && (
            <div className="absolute top-3 right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={() => onChange('pickup')}
          disabled={disabled}
          className={`group relative p-6 border-3 rounded-2xl transition-all ${
            value === 'pickup'
              ? 'border-red-500 bg-red-50 shadow-lg'
              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
          } ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
        >
          <div className="text-4xl mb-3">🏪</div>
          <div className="font-bold text-lg text-gray-900">Abholung</div>
          <p className="text-sm text-gray-600 mt-1">20-30 Min</p>
          {value === 'pickup' && (
            <div className="absolute top-3 right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </button>
      </div>
    </div>
  )
}
