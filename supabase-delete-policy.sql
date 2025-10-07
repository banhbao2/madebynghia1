-- Add DELETE policy to orders table
-- Run this in Supabase SQL Editor

CREATE POLICY "Anyone can delete orders"
  ON orders
  FOR DELETE
  TO anon, authenticated
  USING (true);
