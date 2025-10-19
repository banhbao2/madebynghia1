/**
 * Custom Error Classes for Better Error Handling
 * Provides structured errors with user-friendly messages and error codes
 */

export enum ErrorCode {
  // Network Errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',

  // Validation Errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_PHONE = 'INVALID_PHONE',
  INVALID_TIME_SLOT = 'INVALID_TIME_SLOT',
  INVALID_DATE = 'INVALID_DATE',

  // Order Errors
  ORDER_FAILED = 'ORDER_FAILED',
  ITEM_UNAVAILABLE = 'ITEM_UNAVAILABLE',
  ITEM_NOT_FOUND = 'ITEM_NOT_FOUND',
  INVALID_ORDER_TYPE = 'INVALID_ORDER_TYPE',
  MISSING_DELIVERY_ADDRESS = 'MISSING_DELIVERY_ADDRESS',

  // Reservation Errors
  RESERVATION_FAILED = 'RESERVATION_FAILED',
  TIME_SLOT_UNAVAILABLE = 'TIME_SLOT_UNAVAILABLE',
  PARTY_SIZE_INVALID = 'PARTY_SIZE_INVALID',
  BOOKING_WINDOW_EXCEEDED = 'BOOKING_WINDOW_EXCEEDED',
  MIN_ADVANCE_REQUIRED = 'MIN_ADVANCE_REQUIRED',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // Authentication
  UNAUTHORIZED = 'UNAUTHORIZED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',

  // Server Errors
  SERVER_ERROR = 'SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',

  // Unknown
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Base Application Error Class
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public userMessage: string,
    public statusCode: number = 500,
    public metadata?: Record<string, any>
  ) {
    super(message)
    this.name = 'AppError'
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

/**
 * Network-related errors
 */
export class NetworkError extends AppError {
  constructor(message: string = 'Network request failed', metadata?: Record<string, any>) {
    super(
      message,
      ErrorCode.NETWORK_ERROR,
      'Verbindung fehlgeschlagen. Bitte prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.',
      0,
      metadata
    )
    this.name = 'NetworkError'
  }
}

/**
 * Validation errors
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    userMessage: string,
    code: ErrorCode = ErrorCode.VALIDATION_ERROR,
    metadata?: Record<string, any>
  ) {
    super(message, code, userMessage, 400, metadata)
    this.name = 'ValidationError'
  }
}

/**
 * Order-related errors
 */
export class OrderError extends AppError {
  constructor(
    message: string,
    code: ErrorCode,
    userMessage: string,
    statusCode: number = 400,
    metadata?: Record<string, any>
  ) {
    super(message, code, userMessage, statusCode, metadata)
    this.name = 'OrderError'
  }
}

/**
 * Reservation-related errors
 */
export class ReservationError extends AppError {
  constructor(
    message: string,
    code: ErrorCode,
    userMessage: string,
    statusCode: number = 400,
    metadata?: Record<string, any>
  ) {
    super(message, code, userMessage, statusCode, metadata)
    this.name = 'ReservationError'
  }
}

/**
 * Rate limiting errors
 */
export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded', metadata?: Record<string, any>) {
    super(
      message,
      ErrorCode.RATE_LIMIT_EXCEEDED,
      'Zu viele Anfragen. Bitte versuchen Sie es in einigen Minuten erneut.',
      429,
      metadata
    )
    this.name = 'RateLimitError'
  }
}

/**
 * Parse API error response into structured error
 */
export function parseApiError(error: any): AppError {
  // Network error (no response)
  if (!error.response && error.message?.includes('fetch')) {
    return new NetworkError(error.message)
  }

  // Get error data from response
  const data = error.response?.data || error

  // Rate limit error
  if (error.status === 429 || data.status === 429) {
    return new RateLimitError(data.error || data.message)
  }

  // Validation error from Zod
  if (data.details && Array.isArray(data.details)) {
    const fields = data.details.map((d: any) => d.field).join(', ')
    return new ValidationError(
      `Validation failed: ${fields}`,
      `Bitte überprüfen Sie Ihre Eingaben: ${fields}`,
      ErrorCode.VALIDATION_ERROR,
      { details: data.details }
    )
  }

  // Specific error codes from API
  const errorMessage = data.error || data.message || 'Unknown error'

  // Order errors
  if (errorMessage.includes('Item unavailable') || errorMessage.includes('unavailable')) {
    return new OrderError(
      errorMessage,
      ErrorCode.ITEM_UNAVAILABLE,
      'Ein oder mehrere Artikel sind nicht mehr verfügbar. Bitte aktualisieren Sie Ihre Bestellung.',
      400
    )
  }

  if (errorMessage.includes('Item not found')) {
    return new OrderError(
      errorMessage,
      ErrorCode.ITEM_NOT_FOUND,
      'Artikel nicht gefunden. Bitte aktualisieren Sie die Seite.',
      404
    )
  }

  if (errorMessage.includes('Delivery address')) {
    return new OrderError(
      errorMessage,
      ErrorCode.MISSING_DELIVERY_ADDRESS,
      'Bitte geben Sie eine Lieferadresse an.',
      400
    )
  }

  // Reservation errors
  if (errorMessage.includes('time slot') || errorMessage.includes('Time slot')) {
    return new ReservationError(
      errorMessage,
      ErrorCode.TIME_SLOT_UNAVAILABLE,
      'Die gewählte Zeit ist nicht mehr verfügbar. Bitte wählen Sie eine andere Zeit.',
      400
    )
  }

  if (errorMessage.includes('Party size')) {
    return new ReservationError(
      errorMessage,
      ErrorCode.PARTY_SIZE_INVALID,
      'Ungültige Personenzahl. Bitte wählen Sie zwischen 1 und 20 Personen.',
      400
    )
  }

  if (errorMessage.includes('advance')) {
    return new ReservationError(
      errorMessage,
      ErrorCode.MIN_ADVANCE_REQUIRED,
      'Reservierungen müssen im Voraus gebucht werden. Bitte wählen Sie einen späteren Zeitpunkt.',
      400
    )
  }

  if (errorMessage.includes('booking window') || errorMessage.includes('days in advance')) {
    return new ReservationError(
      errorMessage,
      ErrorCode.BOOKING_WINDOW_EXCEEDED,
      'Dieser Zeitraum liegt zu weit in der Zukunft. Bitte wählen Sie einen früheren Termin.',
      400
    )
  }

  // Unauthorized
  if (error.status === 401 || data.status === 401) {
    return new AppError(
      errorMessage,
      ErrorCode.UNAUTHORIZED,
      'Zugriff verweigert. Bitte melden Sie sich an.',
      401
    )
  }

  // Server error
  if (error.status >= 500 || data.status >= 500) {
    return new AppError(
      errorMessage,
      ErrorCode.SERVER_ERROR,
      'Ein Serverfehler ist aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns.',
      500
    )
  }

  // Generic error
  return new AppError(
    errorMessage,
    ErrorCode.UNKNOWN_ERROR,
    'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    error.status || 500
  )
}

/**
 * Get user-friendly error message
 */
export function getUserErrorMessage(error: any): string {
  if (error instanceof AppError) {
    return error.userMessage
  }

  const parsedError = parseApiError(error)
  return parsedError.userMessage
}
