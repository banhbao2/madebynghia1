'use client'

import { TimeSlot } from '@/types/reservation'

interface TimeSlotPickerProps {
  slots: TimeSlot[]
  selectedTime: string
  onSelectTime: (time: string) => void
  loading?: boolean
}

/**
 * Time slot picker component with grouped periods
 * Groups slots by meal period (lunch, afternoon, dinner)
 */
export default function TimeSlotPicker({ slots, selectedTime, onSelectTime, loading }: TimeSlotPickerProps) {
  // Period definitions
  const PERIODS = {
    lunch: { icon: '🌤️', label: 'Mittagessen', hours: [11, 15] },
    afternoon: { icon: '☕', label: 'Nachmittag', hours: [15, 17] },
    dinner: { icon: '🌙', label: 'Abendessen', hours: [17, 23] }
  } as const

  // Group slots by meal period
  const groupSlotsByPeriod = () => {
    const groups: Record<string, TimeSlot[]> = {
      lunch: [],
      afternoon: [],
      dinner: []
    }

    slots.forEach((slot) => {
      const hour = parseInt(slot.time.split(':')[0])

      if (hour >= PERIODS.lunch.hours[0] && hour < PERIODS.lunch.hours[1]) {
        groups.lunch.push(slot)
      } else if (hour >= PERIODS.afternoon.hours[0] && hour < PERIODS.afternoon.hours[1]) {
        groups.afternoon.push(slot)
      } else if (hour >= PERIODS.dinner.hours[0] && hour < PERIODS.dinner.hours[1]) {
        groups.dinner.push(slot)
      }
    })

    return groups
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-red-600 mb-4" />
        <p className="text-gray-600">Verfügbare Zeiten werden geladen...</p>
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <div className="text-6xl mb-4">📅</div>
        <p className="text-gray-700 font-medium text-lg">Keine verfügbaren Zeitfenster</p>
        <p className="text-gray-500 text-sm mt-2">Bitte wählen Sie ein anderes Datum</p>
      </div>
    )
  }

  const groupedSlots = groupSlotsByPeriod()

  return (
    <div className="space-y-6">
      {Object.entries(groupedSlots).map(([period, periodSlots]) => {
        if (periodSlots.length === 0) return null

        const { icon, label } = PERIODS[period as keyof typeof PERIODS]

        return (
          <div key={period}>
            {/* Period Header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl" aria-hidden="true">{icon}</span>
              <h3 className="font-semibold text-gray-900 text-base">{label}</h3>
            </div>

            {/* Time Slot Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {periodSlots.map((slot) => {
                const isSelected = selectedTime === slot.time
                const isAvailable = slot.available

                return (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() => isAvailable && onSelectTime(slot.time)}
                    disabled={!isAvailable}
                    className={`
                      py-3
                      px-2
                      rounded-lg
                      font-medium
                      text-sm
                      transition-all
                      ${isSelected
                        ? 'bg-red-600 text-white shadow-lg scale-105 ring-2 ring-red-300'
                        : isAvailable
                          ? 'bg-white border-2 border-gray-200 text-gray-700 hover:border-red-500 hover:text-red-600 hover:shadow-md active:scale-95'
                          : 'bg-gray-50 border border-gray-100 text-gray-400 cursor-not-allowed'
                      }
                    `}
                    aria-label={`${slot.time} Uhr ${isAvailable ? 'verfügbar' : 'nicht verfügbar'}`}
                    aria-pressed={isSelected}
                  >
                    {slot.time} Uhr
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Selected Time Confirmation */}
      {selectedTime && (
        <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-xl p-4">
          <p className="text-sm text-green-800 font-medium mb-1">
            ✓ Ausgewählte Zeit
          </p>
          <p className="text-green-700 font-semibold text-lg">
            {selectedTime} Uhr
          </p>
        </div>
      )}
    </div>
  )
}
