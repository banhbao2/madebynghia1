-- ====================================
-- Pho & Sushi Menu Database Schema
-- ====================================
-- Run this SQL in your Supabase SQL Editor
-- ====================================

-- 1. Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('pho', 'sushi', 'appetizers', 'drinks')),
  image TEXT NOT NULL,
  customizations JSONB DEFAULT '[]'::jsonb,
  popular BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create trigger for menu_items
DROP TRIGGER IF EXISTS update_menu_items_updated_at ON menu_items;
CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. Enable Row Level Security (RLS)
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 6. Create policies for public read access
CREATE POLICY "Allow public read access to menu_items"
  ON menu_items FOR SELECT
  USING (is_available = true);

CREATE POLICY "Allow public read access to categories"
  ON categories FOR SELECT
  USING (is_active = true);

-- 7. Insert categories
INSERT INTO categories (id, name, sort_order) VALUES
  ('all', 'All Items', 0),
  ('pho', 'Phở', 1),
  ('sushi', 'Sushi', 2),
  ('appetizers', 'Appetizers', 3),
  ('drinks', 'Drinks', 4)
ON CONFLICT (id) DO NOTHING;

-- 8. Insert menu items
INSERT INTO menu_items (id, name, description, price, category, image, popular, customizations, sort_order) VALUES
  ('pho-tai', 'Phở Tái', 'Traditional beef pho with rare steak in aromatic broth', 13.99, 'pho', '/pho-tai.jpg', true,
   '[{"label": "Noodle Type", "options": ["Regular", "Extra Noodles", "No Noodles"]}, {"label": "Spice Level", "options": ["Mild", "Medium", "Spicy"]}]'::jsonb, 1),

  ('pho-ga', 'Phở Gà', 'Chicken pho with tender chicken breast in clear broth', 12.99, 'pho', '/pho-ga.jpg', false,
   '[{"label": "Noodle Type", "options": ["Regular", "Extra Noodles", "No Noodles"]}]'::jsonb, 2),

  ('pho-dac-biet', 'Phở Đặc Biệt', 'Special combination pho with various cuts of beef', 15.99, 'pho', '/pho-special.jpg', true, '[]'::jsonb, 3),

  ('pho-vegetarian', 'Phở Chay', 'Vegetarian pho with tofu and mixed vegetables', 11.99, 'pho', '/pho-veg.jpg', false, '[]'::jsonb, 4),

  ('california-roll', 'California Roll', 'Crab, avocado, cucumber with sesame seeds', 8.99, 'sushi', '/california-roll.jpg', true, '[]'::jsonb, 5),

  ('spicy-tuna-roll', 'Spicy Tuna Roll', 'Fresh tuna with spicy mayo and scallions', 10.99, 'sushi', '/spicy-tuna.jpg', true, '[]'::jsonb, 6),

  ('dragon-roll', 'Dragon Roll', 'Eel, cucumber topped with avocado and eel sauce', 14.99, 'sushi', '/dragon-roll.jpg', false, '[]'::jsonb, 7),

  ('salmon-nigiri', 'Salmon Nigiri (5pc)', 'Fresh salmon over seasoned rice', 12.99, 'sushi', '/salmon-nigiri.jpg', false, '[]'::jsonb, 8),

  ('rainbow-roll', 'Rainbow Roll', 'California roll topped with assorted fish', 15.99, 'sushi', '/rainbow-roll.jpg', true, '[]'::jsonb, 9),

  ('sashimi-platter', 'Sashimi Platter', 'Chef''s selection of fresh sashimi (12pc)', 24.99, 'sushi', '/sashimi-platter.jpg', false, '[]'::jsonb, 10),

  ('spring-rolls', 'Fresh Spring Rolls (2pc)', 'Rice paper rolls with shrimp, pork, and fresh herbs', 6.99, 'appetizers', '/spring-rolls.jpg', true,
   '[{"label": "Protein", "options": ["Shrimp & Pork", "Shrimp Only", "Vegetarian"]}]'::jsonb, 11),

  ('fried-spring-rolls', 'Fried Spring Rolls (4pc)', 'Crispy rolls with pork and vegetables', 7.99, 'appetizers', '/fried-spring-rolls.jpg', false, '[]'::jsonb, 12),

  ('gyoza', 'Gyoza (6pc)', 'Pan-fried pork dumplings', 7.99, 'appetizers', '/gyoza.jpg', false,
   '[{"label": "Style", "options": ["Pan-Fried", "Steamed"]}]'::jsonb, 13),

  ('edamame', 'Edamame', 'Steamed soybeans with sea salt', 5.99, 'appetizers', '/edamame.jpg', false, '[]'::jsonb, 14),

  ('miso-soup', 'Miso Soup', 'Traditional Japanese soup with tofu and seaweed', 3.99, 'appetizers', '/miso-soup.jpg', false, '[]'::jsonb, 15),

  ('vietnamese-coffee', 'Vietnamese Iced Coffee', 'Strong coffee with sweetened condensed milk', 4.99, 'drinks', '/viet-coffee.jpg', true, '[]'::jsonb, 16),

  ('thai-tea', 'Thai Iced Tea', 'Sweet and creamy Thai tea', 4.49, 'drinks', '/thai-tea.jpg', false, '[]'::jsonb, 17),

  ('bubble-tea', 'Bubble Tea', 'Milk tea with tapioca pearls', 5.49, 'drinks', '/bubble-tea.jpg', false,
   '[{"label": "Flavor", "options": ["Original", "Taro", "Mango", "Strawberry"]}, {"label": "Sugar Level", "options": ["25%", "50%", "75%", "100%"]}]'::jsonb, 18),

  ('green-tea', 'Hot Green Tea', 'Traditional Japanese green tea', 2.99, 'drinks', '/green-tea.jpg', false, '[]'::jsonb, 19),

  ('soft-drink', 'Soft Drink', 'Coke, Sprite, or other sodas', 2.49, 'drinks', '/soft-drink.jpg', false,
   '[{"label": "Type", "options": ["Coke", "Diet Coke", "Sprite", "Fanta"]}]'::jsonb, 20)
ON CONFLICT (id) DO NOTHING;

-- ====================================
-- Setup Complete!
-- ====================================
-- You can now manage your menu items from the Supabase dashboard
-- Go to: Table Editor > menu_items to add/edit/delete items
-- ====================================
