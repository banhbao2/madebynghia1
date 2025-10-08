// Tax and Pricing
export const TAX_RATE = 0.0875 // 8.75%
export const FREE_DELIVERY_THRESHOLD = 30

// Order Configuration
export const ORDER_SUCCESS_DISPLAY_DURATION = 3000 // milliseconds
export const ESTIMATED_PREP_TIME_MIN = 20
export const ESTIMATED_PREP_TIME_MAX = 30

// Order Types
export enum OrderType {
  DELIVERY = 'delivery',
  PICKUP = 'pickup'
}

// Order Status
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// API Endpoints
export const API_ENDPOINTS = {
  ORDERS: '/api/orders',
  ORDER_BY_ID: (id: string) => `/api/orders/${id}`
} as const

// UI Constants
export const Z_INDEX = {
  CART_SIDEBAR: 50,
  MODAL: 50,
  FLOATING_BUTTON: 30
} as const

// Form Validation
export const VALIDATION = {
  PHONE_REGEX: /^[\d\s\-\+\(\)]+$/,
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 100,
  NOTES_MAX_LENGTH: 500
} as const
