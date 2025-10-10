-- ====================================
-- Reservation Workflow Simplification
-- Run this in your Supabase SQL Editor
-- ====================================

-- 1. Add expires_at column for auto-expiring pending reservations
ALTER TABLE reservations
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

-- 2. Set expires_at for existing pending reservations (48 hours from creation)
UPDATE reservations
SET expires_at = created_at + INTERVAL '48 hours'
WHERE status = 'pending' AND expires_at IS NULL;

-- 3. Create trigger to automatically set expires_at on new pending reservations
CREATE OR REPLACE FUNCTION set_reservation_expiry()
RETURNS TRIGGER AS $$
BEGIN
  -- Only set expiry for new pending reservations
  IF NEW.status = 'pending' AND NEW.expires_at IS NULL THEN
    NEW.expires_at = NEW.created_at + INTERVAL '48 hours';
  END IF;

  -- Clear expiry if status changes from pending
  IF OLD.status = 'pending' AND NEW.status != 'pending' THEN
    NEW.expires_at = NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_reservation_expiry_trigger ON reservations;
CREATE TRIGGER set_reservation_expiry_trigger
  BEFORE INSERT OR UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION set_reservation_expiry();

-- 4. Create function to auto-complete past reservations
CREATE OR REPLACE FUNCTION auto_complete_past_reservations()
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  -- Mark confirmed reservations as completed if date is in the past
  UPDATE reservations
  SET status = 'completed'
  WHERE status = 'confirmed'
    AND reservation_date < CURRENT_DATE;

  GET DIAGNOSTICS updated_count = ROW_COUNT;

  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- 5. Create function to auto-expire old pending reservations
CREATE OR REPLACE FUNCTION auto_expire_pending_reservations()
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  -- Cancel pending reservations that have expired
  UPDATE reservations
  SET status = 'cancelled',
      admin_notes = COALESCE(admin_notes || ' | ', '') || 'Auto-cancelled: No response within 48 hours'
  WHERE status = 'pending'
    AND expires_at IS NOT NULL
    AND expires_at < NOW();

  GET DIAGNOSTICS updated_count = ROW_COUNT;

  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- 6. Create index for expiration queries
CREATE INDEX IF NOT EXISTS idx_reservations_expires_at ON reservations(expires_at)
WHERE status = 'pending';

-- ====================================
-- CRON JOBS SETUP (using pg_cron extension)
-- ====================================

-- Note: pg_cron requires enabling the extension first
-- Run this in Supabase Dashboard -> Database -> Extensions
-- Enable: pg_cron

-- Enable pg_cron extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily job to auto-complete past reservations (runs at 2 AM daily)
SELECT cron.schedule(
  'auto-complete-past-reservations',
  '0 2 * * *', -- 2 AM every day
  $$SELECT auto_complete_past_reservations()$$
);

-- Schedule hourly job to auto-expire pending reservations
SELECT cron.schedule(
  'auto-expire-pending-reservations',
  '0 * * * *', -- Every hour at minute 0
  $$SELECT auto_expire_pending_reservations()$$
);

-- ====================================
-- VERIFICATION QUERIES
-- ====================================

-- Check cron jobs are scheduled
SELECT * FROM cron.job WHERE jobname LIKE '%reservation%';

-- Manually test the functions
-- SELECT auto_complete_past_reservations();
-- SELECT auto_expire_pending_reservations();

-- View pending reservations with expiry
-- SELECT id, customer_name, reservation_date, status, created_at, expires_at
-- FROM reservations
-- WHERE status = 'pending'
-- ORDER BY expires_at;

-- ====================================
-- ROLLBACK (if needed)
-- ====================================

/*
-- To remove cron jobs:
SELECT cron.unschedule('auto-complete-past-reservations');
SELECT cron.unschedule('auto-expire-pending-reservations');

-- To remove functions:
DROP FUNCTION IF EXISTS auto_complete_past_reservations();
DROP FUNCTION IF EXISTS auto_expire_pending_reservations();
DROP FUNCTION IF EXISTS set_reservation_expiry();

-- To remove trigger:
DROP TRIGGER IF EXISTS set_reservation_expiry_trigger ON reservations;

-- To remove column:
ALTER TABLE reservations DROP COLUMN IF EXISTS expires_at;
*/
