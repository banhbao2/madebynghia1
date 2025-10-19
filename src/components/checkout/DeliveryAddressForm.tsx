interface DeliveryAddressFormProps {
  formData: {
    street: string
    houseNumber: string
    city: string
  }
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

export default function DeliveryAddressForm({ formData, onChange, disabled = false }: DeliveryAddressFormProps) {
  return (
    <div>
      <label className="block text-lg font-bold text-gray-900 mb-4">
        4. Lieferadresse
      </label>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label htmlFor="street" className="block text-sm font-semibold text-gray-700 mb-2">
              Straße *
            </label>
            <input
              type="text"
              id="street"
              name="street"
              required
              value={formData.street}
              onChange={onChange}
              disabled={disabled}
              className={`w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-base ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
              placeholder="Hauptstraße"
            />
          </div>
          <div>
            <label htmlFor="houseNumber" className="block text-sm font-semibold text-gray-700 mb-2">
              Nr. *
            </label>
            <input
              type="text"
              id="houseNumber"
              name="houseNumber"
              required
              value={formData.houseNumber}
              onChange={onChange}
              disabled={disabled}
              className={`w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-base ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
              placeholder="123"
            />
          </div>
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
            Stadt *
          </label>
          <input
            type="text"
            id="city"
            name="city"
            required
            value={formData.city}
            onChange={onChange}
            disabled={disabled}
            className={`w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-base ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
            placeholder="Ihre Stadt"
          />
        </div>
      </div>
    </div>
  )
}
