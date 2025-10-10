-- ====================================
-- Check if Realtime is Enabled
-- Run this in Supabase SQL Editor
-- ====================================

-- Check which tables have realtime enabled
SELECT tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime';

-- Expected output should include:
-- orders
-- reservations

-- If the output is empty or missing tables, run enable-realtime.sql
