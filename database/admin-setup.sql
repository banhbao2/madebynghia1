-- ====================================
-- Admin & Restaurant Settings Setup
-- ====================================
-- Run this SQL in your Supabase SQL Editor
-- ====================================

-- 1. Create admin_users table (maps Supabase auth users to admin roles)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create restaurant_settings table
CREATE TABLE IF NOT EXISTS restaurant_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_name TEXT NOT NULL DEFAULT 'Nghia Demo',
  restaurant_description TEXT DEFAULT 'Demo Restaurant Website',
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,

  -- Business hours (stored as JSON)
  business_hours JSONB DEFAULT '{
    "monday": {"open": "11:00", "close": "21:00", "closed": false},
    "tuesday": {"open": "11:00", "close": "21:00", "closed": false},
    "wednesday": {"open": "11:00", "close": "21:00", "closed": false},
    "thursday": {"open": "11:00", "close": "21:00", "closed": false},
    "friday": {"open": "11:00", "close": "22:00", "closed": false},
    "saturday": {"open": "11:00", "close": "22:00", "closed": false},
    "sunday": {"open": "12:00", "close": "20:00", "closed": false}
  }'::jsonb,

  -- Delivery settings
  delivery_enabled BOOLEAN DEFAULT true,
  delivery_fee DECIMAL(10, 2) DEFAULT 5.00,
  delivery_minimum DECIMAL(10, 2) DEFAULT 15.00,
  free_delivery_threshold DECIMAL(10, 2) DEFAULT 30.00,

  -- Pickup settings
  pickup_enabled BOOLEAN DEFAULT true,

  -- Tax settings
  tax_rate DECIMAL(5, 4) DEFAULT 0.0875,

  -- Branding
  primary_color TEXT DEFAULT '#DC2626',
  logo_url TEXT,

  -- Social media
  facebook_url TEXT,
  instagram_url TEXT,
  twitter_url TEXT,

  -- Notifications
  notification_email TEXT,
  order_notification_enabled BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Insert default restaurant settings (only one row should exist)
INSERT INTO restaurant_settings (restaurant_name)
VALUES ('Pho & Sushi')
ON CONFLICT DO NOTHING;

-- 4. Create updated_at trigger for admin_users
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. Create updated_at trigger for restaurant_settings
DROP TRIGGER IF EXISTS update_restaurant_settings_updated_at ON restaurant_settings;
CREATE TRIGGER update_restaurant_settings_updated_at
  BEFORE UPDATE ON restaurant_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies for admin_users
-- Only authenticated users can see admin_users
CREATE POLICY "Authenticated users can view admin_users"
  ON admin_users FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Only the user themselves can update their own profile
CREATE POLICY "Users can update own profile"
  ON admin_users FOR UPDATE
  USING (auth.uid() = id);

-- 8. Create RLS policies for restaurant_settings
-- Anyone can read restaurant settings (for displaying on website)
CREATE POLICY "Public can read restaurant settings"
  ON restaurant_settings FOR SELECT
  USING (true);

-- Only authenticated admins can update settings
CREATE POLICY "Admins can update restaurant settings"
  ON restaurant_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- 9. Update menu_items policies to allow admin management
DROP POLICY IF EXISTS "Admins can insert menu items" ON menu_items;
CREATE POLICY "Admins can insert menu items"
  ON menu_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.is_active = true
    )
  );

DROP POLICY IF EXISTS "Admins can update menu items" ON menu_items;
CREATE POLICY "Admins can update menu items"
  ON menu_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.is_active = true
    )
  );

DROP POLICY IF EXISTS "Admins can delete menu items" ON menu_items;
CREATE POLICY "Admins can delete menu items"
  ON menu_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- 10. Update orders table policies (if exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'orders') THEN
    DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
    CREATE POLICY "Admins can view all orders"
      ON orders FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM admin_users
          WHERE admin_users.id = auth.uid()
          AND admin_users.is_active = true
        )
      );

    DROP POLICY IF EXISTS "Admins can update orders" ON orders;
    CREATE POLICY "Admins can update orders"
      ON orders FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM admin_users
          WHERE admin_users.id = auth.uid()
          AND admin_users.is_active = true
        )
      );
  END IF;
END $$;

-- ====================================
-- IMPORTANT: Create Your First Admin User
-- ====================================
-- After running this script:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add user" and create a user with your email
-- 3. Copy the user's UUID
-- 4. Run this SQL (replace the UUID and email):
--
-- INSERT INTO admin_users (id, email, full_name, role)
-- VALUES (
--   'your-user-uuid-here',
--   'your-email@example.com',
--   'Your Name',
--   'super_admin'
-- );
-- ====================================
