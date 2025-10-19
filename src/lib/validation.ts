import { z } from 'zod'

/**
 * Validation schemas for API endpoints
 * Protects against XSS, SQL injection, and malformed data
 */

// Phone number validation (international format)
const phoneRegex = /^\+?[1-9]\d{1,14}$/

// Order validation schema
export const CreateOrderSchema = z.object({
  customer_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim()
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),

  customer_phone: z
    .string()
    .regex(phoneRegex, 'Invalid phone number format')
    .trim(),

  customer_email: z
    .string()
    .email('Invalid email address')
    .max(255)
    .trim()
    .toLowerCase()
    .optional()
    .or(z.literal('')),

  delivery_address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(500, 'Address must not exceed 500 characters')
    .trim()
    .optional()
    .or(z.literal('')),

  order_type: z.enum(['delivery', 'pickup']),

  scheduled_time: z
    .string()
    .datetime()
    .optional()
    .or(z.literal(''))
    .or(z.null()),

  special_notes: z
    .string()
    .max(1000, 'Special notes must not exceed 1000 characters')
    .trim()
    .optional()
    .or(z.literal('')),

  items: z
    .array(
      z.object({
        id: z.string().min(1, 'Item ID is required'),
        name: z.string().min(1).max(200),
        quantity: z.number().int().min(1).max(99),
        price: z.number().positive(), // Client-provided, will be validated server-side
        customizations: z.record(z.string(), z.string()).optional(),
        selectedCustomizations: z.record(z.string(), z.string()).optional()
      }).passthrough() // Allow extra fields from cart
    )
    .min(1, 'Order must contain at least one item')
    .max(50, 'Order cannot exceed 50 items'),

  // These will be recalculated server-side, but we accept them for validation
  subtotal: z.number().nonnegative(),
  tax: z.number().nonnegative(),
  total: z.number().positive()
})

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>

// Reservation validation schema
export const CreateReservationSchema = z.object({
  customer_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim()
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),

  customer_email: z
    .string()
    .email('Invalid email address')
    .max(255)
    .trim()
    .toLowerCase(),

  customer_phone: z
    .string()
    .regex(phoneRegex, 'Invalid phone number format')
    .trim(),

  reservation_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),

  reservation_time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),

  party_size: z
    .number()
    .int()
    .min(1, 'Party size must be at least 1')
    .max(20, 'Party size cannot exceed 20'),

  special_requests: z
    .string()
    .max(1000, 'Special requests must not exceed 1000 characters')
    .trim()
    .optional()
    .or(z.literal(''))
})

export type CreateReservationInput = z.infer<typeof CreateReservationSchema>

/**
 * Sanitize HTML to prevent XSS attacks
 * Basic implementation - for production use a library like DOMPurify
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Validate and sanitize string input
 */
export function sanitizeString(input: string | null | undefined): string {
  if (!input) return ''
  return sanitizeHtml(input.trim())
}
