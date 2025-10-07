import { CartItem } from '@/context/CartContext'

export type OrderType = 'delivery' | 'pickup'

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled'

export interface Order {
  id: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  delivery_address: string | null
  order_type: OrderType
  special_notes: string | null
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  status: OrderStatus
  created_at: string
  updated_at: string
}

export interface CreateOrderRequest {
  customer_name: string
  customer_phone: string
  customer_email?: string
  delivery_address?: string
  order_type: OrderType
  special_notes?: string
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
}

export interface UpdateOrderRequest {
  status: OrderStatus
}
