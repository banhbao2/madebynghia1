interface TimeSlotPickerProps {
  orderType: 'delivery' | 'pickup'
  selectedTime: string
  timeSlots: { value: string; label: string; date: Date }[]
  closedMessage: string
  onSelect: (time: string) => void
  disabled?: boolean
}

export default function TimeSlotPicker({
  orderType,
  selectedTime,
  timeSlots,
  closedMessage,
  onSelect,
  disabled = false
}: TimeSlotPickerProps) {
  return (
    <div>
      <label className="block text-lg font-bold text-gray-900 mb-4">
        2. {orderType === 'delivery' ? 'Lieferzeit' : 'Abholzeit'} wählen
      </label>

      {closedMessage ? (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold text-yellow-800 mb-1">Restaurant geschlossen</p>
            <p className="text-sm text-yellow-700">{closedMessage}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <select
              value={selectedTime}
              onChange={(e) => onSelect(e.target.value)}
              required
              disabled={disabled || timeSlots.length === 0}
              className="w-full border-2 border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-base appearance-none bg-white cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {timeSlots.length === 0 ? (
                <option value="">Keine verfügbaren Zeitfenster</option>
              ) : (
                timeSlots.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))
              )}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2 flex items-start gap-2">
            <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>
              Nur Zeiten während der Öffnungszeiten verfügbar (mindestens 20 Minuten im Voraus).
              {orderType === 'delivery' ? ' Lieferzeit: 30-45 Minuten.' : ' Vorbereitungszeit: 20-30 Minuten.'}
            </span>
          </p>
        </>
      )}
    </div>
  )
}
