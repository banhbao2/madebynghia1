export interface RestaurantSettings {
  id: string
  restaurant_name: string
  restaurant_description: string
  phone: string | null
  email: string | null
  address: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  business_hours: {
    [key: string]: {
      open: string
      close: string
      closed: boolean
    }
  }
  delivery_enabled: boolean
  delivery_fee: number
  delivery_minimum: number
  free_delivery_threshold: number
  pickup_enabled: boolean
  tax_rate: number
  primary_color: string
  logo_url: string | null
  facebook_url: string | null
  instagram_url: string | null
  twitter_url: string | null
  notification_email: string | null
  order_notification_enabled: boolean
  created_at: string
  updated_at: string
}
