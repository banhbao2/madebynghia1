export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  popular: boolean
  available: boolean
  customizations?: {
    [key: string]: {
      type: 'select' | 'multiselect' | 'text'
      options?: string[]
      required?: boolean
    }
  }
  sort_order: number
  created_at: string
  updated_at: string
}

export interface MenuCategory {
  name: string
  count: number
}
