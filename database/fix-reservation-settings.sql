-- Quick fix: Ensure reservation_settings has a default row
-- Run this in Supabase SQL Editor

-- Check if table exists and is empty
DO $$
BEGIN
  -- Insert default settings if none exist
  IF NOT EXISTS (SELECT 1 FROM reservation_settings LIMIT 1) THEN
    INSERT INTO reservation_settings (
      max_tables,
      max_party_size,
      slot_duration_minutes,
      booking_window_days,
      reservation_start_time,
      reservation_end_time,
      closed_days,
      auto_confirm,
      min_advance_hours
    ) VALUES (
      15,                           -- max_tables
      12,                           -- max_party_size
      30,                           -- slot_duration_minutes (30 min intervals)
      30,                           -- booking_window_days
      '11:00:00',                   -- reservation_start_time
      '21:00:00',                   -- reservation_end_time
      '[]'::jsonb,                  -- closed_days (empty array)
      false,                        -- auto_confirm
      2                             -- min_advance_hours
    );

    RAISE NOTICE 'Default reservation settings inserted successfully!';
  ELSE
    RAISE NOTICE 'Reservation settings already exist.';
  END IF;
END $$;

-- Verify the settings
SELECT * FROM reservation_settings;
