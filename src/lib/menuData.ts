import menuData from '@/data/menu.json'

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
}

export interface Category {
  id: string
  name: string
}

// Import from JSON file - edit menu.json to update menu items
export const menuItems: MenuItem[] = menuData.items as MenuItem[]
export const categories = menuData.categories as readonly Category[]
