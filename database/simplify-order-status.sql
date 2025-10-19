-- ====================================
-- Simplify Order Status Workflow
-- ====================================
-- Run this SQL in your Supabase SQL Editor
-- ====================================

-- Drop the old constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Add new simplified constraint with only 3 statuses
ALTER TABLE orders ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending', 'preparing', 'completed', 'cancelled'));

-- Comment to explain the simplified workflow
COMMENT ON CONSTRAINT orders_status_check ON orders IS
  'Simplified workflow: pending (new order) -> preparing (accepted/cooking) -> completed (customer picked up) OR cancelled';
