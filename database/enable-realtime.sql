-- ====================================
-- Enable Supabase Realtime for Admin Dashboard
-- Run this in your Supabase SQL Editor
-- ====================================

-- Enable realtime for orders table
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- Enable realtime for reservations table
ALTER PUBLICATION supabase_realtime ADD TABLE reservations;

-- Verify realtime is enabled
SELECT tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime';

-- ====================================
-- Expected output should include:
-- orders
-- reservations
-- ====================================

-- Note: If you get an error that the publication doesn't exist,
-- you can create it with:
-- CREATE PUBLICATION supabase_realtime;
-- Then run the ALTER commands above.
