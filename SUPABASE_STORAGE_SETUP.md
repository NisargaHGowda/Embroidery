# Supabase Storage Setup (Profile Pictures)

If profile picture upload shows **"Failed to upload"** or **"bucket not found"**, create the bucket and policies in Supabase.

## 1. Create the bucket

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project.
2. Go to **Storage** in the left sidebar.
3. Click **New bucket**.
4. **Name:** `profile_pictures` (must be exactly this).
5. Turn **Public bucket** ON (so profile images can be shown without auth).
6. Click **Create bucket**.

## 2. Add storage policies

1. In **Storage**, open the **profile_pictures** bucket.
2. Go to **Policies** (or **Configuration** → Policies).
3. Add these policies (or run the SQL below in **SQL Editor**).

### Option A: Using the Dashboard policy editor

- **Policy 1 – Upload**  
  - Operation: **INSERT**  
  - Target: **Authenticated users**  
  - WITH CHECK: `bucket_id = 'profile_pictures'`

- **Policy 2 – Read**  
  - Operation: **SELECT**  
  - Target: **Public** (or “All users”)  
  - USING: `bucket_id = 'profile_pictures'`

### Option B: Using SQL (SQL Editor)

```sql
-- Allow logged-in users to upload
CREATE POLICY "Authenticated users can upload profile pictures"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile_pictures');

-- Allow anyone to view (public bucket)
CREATE POLICY "Profile pictures are publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile_pictures');

-- Allow users to update/delete (optional, for replacing/removing picture)
CREATE POLICY "Users can update own profile pictures"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'profile_pictures');

CREATE POLICY "Users can delete own profile pictures"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'profile_pictures');
```

After this, profile picture upload in the app should work. Ensure you are **logged in** when uploading.
