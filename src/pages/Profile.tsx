import React, { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState({
    full_name: '',
    phone_number: '',
    address: '',
    profile_picture: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(e.target as Node) && fileInputRef.current && !fileInputRef.current.contains(e.target as Node)) {
        setShowOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchProfile = async () => {
    if (!user?.id) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('users')
      .select('full_name, phone_number, address, profile_picture')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
    } else if (data) {
      setProfile({
        full_name: data.full_name ?? '',
        phone_number: data.phone_number ?? '',
        address: data.address ?? '',
        profile_picture: data.profile_picture ?? '',
      });
    }
    // If no row (data is null), form stays empty - user can create profile on save
    setLoading(false);
  };

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length || !user?.id) return;

    const file = files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setErrorMessage('Image must be under 5MB.');
      return;
    }
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setErrorMessage('Please use JPEG, PNG, GIF or WebP.');
      return;
    }

    setUploading(true);
    setErrorMessage('');
    const ext = file.name.split('.').pop() || 'jpg';
    const filePath = `${user.id}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from('profile_pictures')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (error) {
      const isBucketMissing = error.message?.toLowerCase().includes('not found') || error.message?.toLowerCase().includes('bucket');
      const msg = isBucketMissing
        ? "Bucket 'profile_pictures' not found. In Supabase Dashboard go to Storage → New bucket → name: profile_pictures, set Public ON. Add policy: INSERT for authenticated, SELECT for all (see SUPABASE_STORAGE_SETUP.md in project)."
        : `Upload failed: ${error.message}`;
      setErrorMessage(msg);
      console.error('Upload error:', error);
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const { data: urlData } = supabase.storage
      .from('profile_pictures')
      .getPublicUrl(filePath);

    setProfile((prev) => ({ ...prev, profile_picture: urlData.publicUrl }));
    setUploading(false);
    setShowOptions(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemovePicture = () => {
    setProfile((prev) => ({ ...prev, profile_picture: '' }));
    setShowOptions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !user?.email) return;

    setSaving(true);
    setErrorMessage('');

    const payload = {
      full_name: profile.full_name.trim() || null,
      phone_number: profile.phone_number.trim() || null,
      address: profile.address.trim() || null,
      profile_picture: profile.profile_picture.trim() || null,
    };

    // Try update first (user row may already exist from signup)
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    let error = null;
    if (existing) {
      const res = await supabase
        .from('users')
        .update(payload)
        .eq('id', user.id);
      error = res.error;
    } else {
      const res = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          ...payload,
        });
      error = res.error;
    }

    if (error) {
      const isTableMissing =
        error.message?.includes('does not exist') ||
        error.message?.toLowerCase().includes('not found') ||
        (error as { code?: string }).code === '42P01';
      const message = isTableMissing
        ? "Users table missing. In Supabase run: SQL Editor → open supabase/RUN_THIS_IN_SQL_EDITOR.sql → Run."
        : error.message || 'Failed to save profile. Try again.';
      toast.error(message, { autoClose: 8000 });
      console.error('Save error:', error);
    } else {
      toast.success('Profile saved! It will persist after refresh.');
      setErrorMessage('');
      useAuthStore.getState().fetchUser(); // refresh store so navbar shows updated name
    }
    setSaving(false);
  };

  const displayPicture = profile.profile_picture || '';
  const placeholderAvatar =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23e5e7eb' width='100' height='100'/%3E%3Ctext x='50' y='55' fill='%239ca3af' font-size='14' text-anchor='middle'%3EPhoto%3C/text%3E%3C/svg%3E";

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-2">My Profile</h1>
      <p className="text-gray-600 mb-6">
        Enter your full name and phone number, then click Save. Your profile is stored and will persist after refresh.
      </p>

      {loading ? (
        <p className="text-gray-600">Loading profile...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMessage && (
            <p className="text-red-600 bg-red-50 px-3 py-2 rounded-lg">{errorMessage}</p>
          )}

          {/* Profile Picture */}
          <div className="flex flex-col items-center" ref={optionsRef}>
            <button
              type="button"
              onClick={() => setShowOptions(!showOptions)}
              className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <img
                src={displayPicture || placeholderAvatar}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
              />
              <span className="absolute bottom-0 left-0 right-0 text-center text-xs bg-black/60 text-white py-1 rounded-b-full">
                {uploading ? 'Uploading...' : 'Change'}
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleProfilePictureUpload}
              className="hidden"
            />
            {showOptions && (
              <div className="absolute top-40 z-10 bg-white border border-gray-200 shadow-lg rounded-lg w-48 py-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full text-left text-gray-700 hover:bg-gray-100 px-3 py-2"
                >
                  Upload picture
                </button>
                <button
                  type="button"
                  onClick={handleRemovePicture}
                  className="w-full text-left text-red-600 hover:bg-gray-100 px-3 py-2"
                >
                  Remove picture
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={profile.phone_number}
              onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g. +1 234 567 8900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address (optional)</label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Address for delivery"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;
