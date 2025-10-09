# Database Setup

This folder contains SQL migration scripts for the Supabase database.

## Initial Setup

Run `supabase-setup.sql` in your Supabase SQL Editor to:
- Create `menu_items` and `categories` tables
- Set up Row Level Security (RLS) policies
- Insert initial menu data

## Managing Menu Items

### Via Supabase Dashboard
1. Go to **Table Editor** > **menu_items**
2. Add, edit, or delete items directly
3. Changes are instantly reflected on the website

### Menu Item Fields
- `id` - Unique identifier (e.g., "pho-tai")
- `name` - Display name
- `description` - Item description
- `price` - Price (decimal)
- `category` - One of: pho, sushi, appetizers, drinks
- `image` - Image path (e.g., "/pho-tai.jpg")
- `customizations` - JSON array of customization options
- `popular` - Boolean, shows "Popular" badge
- `is_available` - Boolean, hide/show item
- `sort_order` - Integer for ordering

### Example: Adding a New Item

```sql
INSERT INTO menu_items (id, name, description, price, category, image, popular, customizations, sort_order)
VALUES (
  'new-item',
  'New Dish',
  'Delicious new item',
  12.99,
  'pho',
  '/new-item.jpg',
  false,
  '[]'::jsonb,
  21
);
```

## Categories

Categories are managed in the `categories` table. Default categories:
- All Items
- Phở
- Sushi
- Appetizers
- Drinks
