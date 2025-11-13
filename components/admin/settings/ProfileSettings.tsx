import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { UserAccount } from '../../../types/user';
import { IconUpload, IconSave } from '../../Icons';

const ProfileSettings: React.FC = () => {
  const { currentUser, logActivity } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    avatar: '',
    bio: '',
    phone: '',
    location: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullName: currentUser.fullName,
        email: currentUser.email,
        username: currentUser.username,
        avatar: currentUser.avatar || '',
        bio: '',
        phone: '',
        location: '',
      });
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      // Update user in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((u: UserAccount) =>
        u.id === currentUser?.id
          ? { ...u, fullName: formData.fullName, email: formData.email, avatar: formData.avatar }
          : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Update current user
      const updatedCurrentUser = updatedUsers.find((u: UserAccount) => u.id === currentUser?.id);
      localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));

      logActivity('update', 'profile', currentUser?.id, 'Updated profile information');

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Reload page to reflect changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Section */}
      <div>
        <label className="block text-sm font-medium mb-4">Profile Picture</label>
        <div className="flex items-center gap-6">
          <div className="relative">
            {formData.avatar ? (
              <img
                src={formData.avatar}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-200 dark:ring-gray-700"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-gray-200 dark:ring-gray-700">
                {formData.fullName.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <IconUpload className="w-4 h-4" />
              <span>Upload Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                aria-label="Upload profile picture"
              />
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
        </div>
      </div>

      {/* Avatar URL */}
      <div>
        <label className="block text-sm font-medium mb-2">Avatar URL (Optional)</label>
        <input
          type="url"
          value={formData.avatar}
          onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          placeholder="https://example.com/avatar.jpg"
        />
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium mb-2">Full Name *</label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-2">Email *</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          required
        />
      </div>

      {/* Username (Read-only) */}
      <div>
        <label className="block text-sm font-medium mb-2">Username</label>
        <input
          type="text"
          value={formData.username}
          className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-900 dark:border-gray-600 cursor-not-allowed"
          disabled
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Username cannot be changed
        </p>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium mb-2">Bio</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          rows={4}
          placeholder="Tell us about yourself..."
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium mb-2">Phone Number</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          placeholder="+1 (555) 000-0000"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium mb-2">Location</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          placeholder="City, Country"
        />
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <IconSave className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>
    </form>
  );
};

export default ProfileSettings;
