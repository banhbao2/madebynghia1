-- Verify admin_notes column exists in reservations table
-- Run this in Supabase SQL Editor to check

-- Check if admin_notes column exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'reservations'
  AND column_name = 'admin_notes';

-- If the query returns no rows, the column doesn't exist
-- Run this to add it:

-- ALTER TABLE reservations
-- ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Expected output should show:
-- column_name  | data_type | is_nullable
-- admin_notes  | text      | YES
