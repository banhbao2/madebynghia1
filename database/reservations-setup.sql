-- ====================================
-- Reservation System Setup
-- ====================================
-- Run this SQL in your Supabase SQL Editor
-- ====================================

-- 1. Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Customer Information
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,

  -- Reservation Details
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  party_size INTEGER NOT NULL CHECK (party_size > 0 AND party_size <= 20),

  -- Status Management
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),

  -- Optional Details
  special_requests TEXT,
  table_number TEXT,

  -- Admin Notes
  admin_notes TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_date_time ON reservations(reservation_date, reservation_time);

-- 3. Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_reservations_updated_at ON reservations;
CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 4. Create reservation_settings table (for capacity management)
CREATE TABLE IF NOT EXISTS reservation_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Capacity Settings
  max_tables INTEGER DEFAULT 15,
  max_party_size INTEGER DEFAULT 12,

  -- Time Slot Settings
  slot_duration_minutes INTEGER DEFAULT 30, -- Time between slots
  booking_window_days INTEGER DEFAULT 30, -- How far in advance customers can book

  -- Operating Hours for Reservations
  reservation_start_time TIME DEFAULT '11:00:00',
  reservation_end_time TIME DEFAULT '21:00:00',

  -- Days Closed (JSON array of day names)
  closed_days JSONB DEFAULT '[]'::jsonb,

  -- Auto-confirmation
  auto_confirm BOOLEAN DEFAULT false,

  -- Minimum advance booking (in hours)
  min_advance_hours INTEGER DEFAULT 2,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Insert default reservation settings
INSERT INTO reservation_settings (id)
VALUES (gen_random_uuid())
ON CONFLICT DO NOTHING;

-- 6. Enable Row Level Security
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservation_settings ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for reservations

-- Public can create reservations
CREATE POLICY "Anyone can create reservations"
  ON reservations FOR INSERT
  WITH CHECK (true);

-- Customers can view their own reservations (by email)
CREATE POLICY "Customers can view own reservations"
  ON reservations FOR SELECT
  USING (true); -- We'll filter by email in the app

-- Admins can view all reservations
CREATE POLICY "Admins can view all reservations"
  ON reservations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- Admins can update reservations
CREATE POLICY "Admins can update reservations"
  ON reservations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- Admins can delete reservations
CREATE POLICY "Admins can delete reservations"
  ON reservations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- 8. RLS Policies for reservation_settings

-- Public can read settings (to show available times)
CREATE POLICY "Public can read reservation settings"
  ON reservation_settings FOR SELECT
  USING (true);

-- Admins can update settings
CREATE POLICY "Admins can update reservation settings"
  ON reservation_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- ====================================
-- Done! Your reservation system is ready.
-- Next steps:
-- 1. Build the customer reservation form
-- 2. Build the admin management interface
-- 3. Add email notifications (optional)
-- ====================================
