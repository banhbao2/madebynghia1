interface SpecialInstructionsProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  disabled?: boolean
}

export default function SpecialInstructions({ value, onChange, disabled = false }: SpecialInstructionsProps) {
  return (
    <div>
      <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
        Besondere Anweisungen (optional)
      </label>
      <textarea
        id="notes"
        name="notes"
        rows={4}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-base ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
        placeholder="Spezielle Wünsche, Allergien, Ernährungseinschränkungen..."
      />
    </div>
  )
}
