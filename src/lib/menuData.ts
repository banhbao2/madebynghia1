// Type definitions for menu items
// Menu data is now stored in Supabase database

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: 'pho' | 'sushi' | 'appetizers' | 'drinks'
  image: string
  customizations?: {
    label: string
    options: string[]
  }[]
  popular?: boolean
  is_available?: boolean
  sort_order?: number
}

export interface Category {
  id: string
  name: string
  sort_order?: number
  is_active?: boolean
}
