interface CheckoutButtonProps {
  isSubmitting: boolean
  isMobile?: boolean
  onSubmit: (e: React.FormEvent) => void
}

export default function CheckoutButton({ isSubmitting, isMobile = false, onSubmit }: CheckoutButtonProps) {
  const className = isMobile
    ? "lg:hidden w-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-4 rounded-xl hover:shadow-lg transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
    : "hidden lg:flex w-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-4 rounded-xl hover:shadow-lg transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center gap-3"

  return (
    <button
      type="submit"
      onClick={onSubmit}
      disabled={isSubmitting}
      className={className}
    >
      {isSubmitting ? (
        <>
          <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Wird verarbeitet...
        </>
      ) : (
        <>
          Bestellung aufgeben
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </>
      )}
    </button>
  )
}
