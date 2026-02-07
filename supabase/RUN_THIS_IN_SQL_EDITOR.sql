-- =============================================================================
-- Run this entire file in Supabase Dashboard → SQL Editor → New query
-- This creates the users table and policies so Profile save/load works (fixes 404).
-- =============================================================================

-- 1. Users table (skip if already exists)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  full_name text,
  phone_number text,
  address text,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies so we can re-run this script safely
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;

-- 3. Create policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. Add profile_picture column (skip if already exists)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS profile_picture text;

-- Done. Profile page should now load and save. Create the storage bucket
-- in Dashboard → Storage → New bucket → name: profile_pictures, Public ON,
-- then add policies (see SUPABASE_STORAGE_SETUP.md) for picture upload.
