import React, { useState, useEffect } from 'react';
import { Activity, ActivityMedia } from '../../types/activity';
import { generateActivityId, generateSlug, generateMediaId } from '../../utils/activityHelpers';
import { ACTIVITY_CATEGORIES, ACTIVITY_TYPES, ACTIVITY_STATUSES, MEDIA_TYPES } from '../../data/activityCategories';
import { IconX, IconPlus, IconTrash } from '../Icons';

interface ActivityFormProps {
  activity: Activity | null;
  onSave: (activity: Activity) => void;
  onCancel: () => void;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ activity, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    type: 'meeting' as Activity['type'],
    category: 'corporate',
    coverImage: '',
    media: [] as ActivityMedia[],
    location: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    organizer: '',
    participants: [] as string[],
    maxParticipants: 0,
    tags: [] as string[],
    status: 'upcoming' as Activity['status'],
    isPublic: true,
    isFeatured: false,
    registrationRequired: false,
    registrationUrl: '',
  });

  const [tagInput, setTagInput] = useState('');
  const [participantInput, setParticipantInput] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [mediaInput, setMediaInput] = useState({ type: 'image' as ActivityMedia['type'], url: '', title: '' });

  useEffect(() => {
    if (activity) {
      setFormData({
        title: activity.title,
        slug: activity.slug,
        description: activity.description,
        content: activity.content,
        type: activity.type,
        category: activity.category,
        coverImage: activity.coverImage,
        media: activity.media,
        location: activity.location || '',
        startDate: activity.startDate,
        endDate: activity.endDate || '',
        startTime: activity.startTime || '',
        endTime: activity.endTime || '',
        organizer: activity.organizer,
        participants: activity.participants || [],
        maxParticipants: activity.maxParticipants || 0,
        tags: activity.tags,
        status: activity.status,
        isPublic: activity.isPublic,
        isFeatured: activity.isFeatured,
        registrationRequired: activity.registrationRequired,
        registrationUrl: activity.registrationUrl || '',
      });
      setImagePreview(activity.coverImage);
    }
  }, [activity]);

  useEffect(() => {
    if (formData.title && !activity) {
      setFormData(prev => ({ ...prev, slug: generateSlug(formData.title) }));
    }
  }, [formData.title, activity]);

  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, coverImage: url });
    setImagePreview(url);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const handleAddParticipant = () => {
    if (participantInput.trim() && !formData.participants.includes(participantInput.trim())) {
      setFormData({ ...formData, participants: [...formData.participants, participantInput.trim()] });
      setParticipantInput('');
    }
  };

  const handleRemoveParticipant = (participant: string) => {
    setFormData({ ...formData, participants: formData.participants.filter(p => p !== participant) });
  };

  const handleAddMedia = () => {
    if (mediaInput.url.trim()) {
      const newMedia: ActivityMedia = {
        id: generateMediaId(),
        type: mediaInput.type,
        url: mediaInput.url,
        title: mediaInput.title || undefined,
        order: formData.media.length,
      };
      setFormData({ ...formData, media: [...formData.media, newMedia] });
      setMediaInput({ type: 'image', url: '', title: '' });
    }
  };

  const handleRemoveMedia = (mediaId: string) => {
    setFormData({ ...formData, media: formData.media.filter(m => m.id !== mediaId) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const activityData: Activity = {
      id: activity?.id || generateActivityId(),
      ...formData,
      views: activity?.views || 0,
      likes: activity?.likes || 0,
      attendees: activity?.attendees || 0,
      createdAt: activity?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(activityData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {activity ? 'Edit Activity' : 'Add Activity'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {activity ? 'Update the activity details' : 'Fill in the details below'}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Close form"
        >
          <IconX className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Cover Image */}
        <div>
          <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Cover Image URL *
          </label>
          <input
            id="coverImage"
            type="text"
            value={formData.coverImage}
            onChange={(e) => handleImageUrlChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          {imagePreview && (
            <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover" onError={() => setImagePreview('')} />
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            required
          />
        </div>

        {/* Type & Category */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type *
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Activity['type'] })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {ACTIVITY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {ACTIVITY_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Start Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date *
            </label>
            <input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Time
            </label>
            <input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Location & Organizer */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="organizer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Organizer *
            </label>
            <input
              id="organizer"
              type="text"
              value={formData.organizer}
              onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status *
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Activity['status'] })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            {ACTIVITY_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.icon} {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              id="tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add a tag..."
            />
            <button type="button" onClick={handleAddTag} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Add
            </button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs flex items-center gap-1">
                  #{tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-blue-900 dark:hover:text-blue-200">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Media */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Media (Images, Videos, Articles)
          </label>
          <div className="space-y-2 mb-2">
            <select
              value={mediaInput.type}
              onChange={(e) => setMediaInput({ ...mediaInput, type: e.target.value as ActivityMedia['type'] })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              aria-label="Select media type"
            >
              {MEDIA_TYPES.map((type) => (
                <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
              ))}
            </select>
            <input
              type="text"
              value={mediaInput.url}
              onChange={(e) => setMediaInput({ ...mediaInput, url: e.target.value })}
              placeholder="Media URL"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            />
            <button type="button" onClick={handleAddMedia} className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
              <IconPlus className="w-4 h-4 inline mr-2" />
              Add Media
            </button>
          </div>
          {formData.media.length > 0 && (
            <div className="space-y-2">
              {formData.media.map((media) => (
                <div key={media.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-xs flex-1 truncate">{MEDIA_TYPES.find(t => t.value === media.type)?.icon} {media.url}</span>
                  <button type="button" onClick={() => handleRemoveMedia(media.id)} className="text-red-600 hover:text-red-700" title="Remove media">
                    <IconTrash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checkboxes */}
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isFeatured" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Featured Activity</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Public Activity</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="registrationRequired"
              checked={formData.registrationRequired}
              onChange={(e) => setFormData({ ...formData, registrationRequired: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="registrationRequired" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Registration Required</label>
          </div>
        </div>
      </form>
      
      {/* Actions */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            type="button"
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
          >
            {activity ? 'Update' : 'Add'} Activity
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityForm;
