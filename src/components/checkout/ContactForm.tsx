import TrustSignal from '@/components/TrustSignal'

interface ContactFormProps {
  formData: {
    name: string
    phone: string
    email: string
    honeypot: string
  }
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

export default function ContactForm({ formData, onChange, disabled = false }: ContactFormProps) {
  return (
    <div>
      <label className="block text-lg font-bold text-gray-900 mb-4">
        3. Kontaktinformationen
      </label>

      {/* Trust Signals - Critical Moment */}
      <div className="space-y-2 mb-4">
        <TrustSignal variant="data-protection" size="sm" />
        <TrustSignal variant="no-spam" size="sm" />
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            Vollständiger Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={onChange}
            disabled={disabled}
            className={`w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-base ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
            placeholder="Max Mustermann"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
              Telefonnummer *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={onChange}
              disabled={disabled}
              className={`w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-base ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
              placeholder="+49 123 456789"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              E-Mail *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={onChange}
              disabled={disabled}
              className={`w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-base ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
              placeholder="ihre@email.de"
            />
          </div>
        </div>

        {/* Honeypot */}
        <input
          type="text"
          name="honeypot"
          value={formData.honeypot}
          onChange={onChange}
          style={{ display: 'none' }}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
    </div>
  )
}
