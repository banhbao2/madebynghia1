/**
 * Formatting utilities for consistent date, time, and currency formatting across the application
 * Uses German locale (de-DE) for all formatting
 */

/**
 * Format a date as DD.MM.YYYY
 * @example formatDate(new Date()) // "19.10.2025"
 */
export function formatDate(date: Date): string {
  return date.toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/**
 * Format a time as HH:MM
 * @example formatTime(new Date()) // "14:30"
 */
export function formatTime(date: Date): string {
  return date.toLocaleString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format a date and time as DD.MM.YYYY, HH:MM
 * @example formatDateTime(new Date()) // "19.10.2025, 14:30"
 */
export function formatDateTime(date: Date): string {
  return date.toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format a date with full weekday name
 * @example formatDateTimeLong(new Date()) // "Freitag, 19.10.2025, 14:30"
 */
export function formatDateTimeLong(date: Date): string {
  return date.toLocaleString('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format a currency amount with Euro symbol
 * @example formatCurrency(19.99) // "19.99€"
 */
export function formatCurrency(amount: number): string {
  return `${amount.toFixed(2)}€`
}

/**
 * Format a currency amount with thousands separator
 * @example formatCurrencyLong(1234.56) // "1.234,56 €"
 */
export function formatCurrencyLong(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

/**
 * Format a phone number in German format
 * @example formatPhone("+491234567890") // "+49 123 456 7890"
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')

  if (cleaned.startsWith('49')) {
    // German international format
    return `+49 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`
  }

  if (cleaned.startsWith('0')) {
    // German national format
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`
  }

  return phone
}

// Named export object for convenience
export const formatters = {
  date: formatDate,
  time: formatTime,
  dateTime: formatDateTime,
  dateTimeLong: formatDateTimeLong,
  currency: formatCurrency,
  currencyLong: formatCurrencyLong,
  phone: formatPhone,
}
