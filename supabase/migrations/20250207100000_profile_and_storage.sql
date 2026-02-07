-- Add profile_picture to users
ALTER TABLE users
ADD COLUMN IF NOT EXISTS profile_picture text;

-- Allow users to create their own row (e.g. when completing profile after signup)
CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Storage bucket for profile pictures (public read, 5MB limit)
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile_pictures', 'profile_pictures', true)
ON CONFLICT (id) DO NOTHING;

-- Authenticated users can upload to profile_pictures
CREATE POLICY "Authenticated users can upload profile pictures"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile_pictures');

-- Anyone can view profile pictures (public bucket)
CREATE POLICY "Profile pictures are publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile_pictures');

-- Users can update/delete their own uploads (path contains their user id)
CREATE POLICY "Users can update own profile pictures"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profile_pictures');

CREATE POLICY "Users can delete own profile pictures"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profile_pictures');
