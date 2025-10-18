-- ====================================
-- Add scheduled_time column to orders table
-- ====================================
-- Run this SQL in your Supabase SQL Editor
-- ====================================

-- Add scheduled_time column to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS scheduled_time TIMESTAMP WITH TIME ZONE;

-- Add comment to document the column
COMMENT ON COLUMN orders.scheduled_time IS 'Customer-selected pickup or delivery time (must be at least 20 minutes from order time)';
