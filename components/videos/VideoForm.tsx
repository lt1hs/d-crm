import React, { useState, useEffect } from 'react';
import { Video } from '../../types/video';
import { VIDEO_CATEGORIES, VIDEO_TYPES, VIDEO_PLATFORMS, VIDEO_QUALITIES, VIDEO_LANGUAGES } from '../../data/videoCategories';
import { generateVideoId, generateSlug } from '../../utils/videoHelpers';
import { IconX, IconSave } from '../Icons';

interface VideoFormProps {
  video: Video | null;
  onSave: (video: Video) => void;
  onCancel: () => void;
}

const VideoForm: React.FC<VideoFormProps> = ({ video, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Video>>({
    title: '',
    description: '',
    thumbnailUrl: '',
    videoUrl: '',
    embedUrl: '',
    category: VIDEO_CATEGORIES[0].id,
    type: 'tutorial',
    status: 'draft',
    isFeatured: false,
    isPublic: true,
    presenter: '',
    department: '',
    duration: 0,
    publishDate: new Date().toISOString().split('T')[0],
    quality: 'auto',
    platform: 'youtube',
    language: 'en',
    tags: [],
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
  });

  const [tagInput, setTagInput] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);

  useEffect(() => {
    if (video) {
      setFormData(video);
      setDurationMinutes(Math.floor(video.duration / 60));
      setDurationSeconds(video.duration % 60);
    }
  }, [video]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date().toISOString();
    const totalDuration = (durationMinutes * 60) + durationSeconds;
    
    const videoData: Video = {
      id: video?.id || generateVideoId(),
      title: formData.title || '',
      slug: generateSlug(formData.title || ''),
      description: formData.description || '',
      thumbnailUrl: formData.thumbnailUrl || '',
      videoUrl: formData.videoUrl || '',
      embedUrl: formData.embedUrl,
      category: formData.category || VIDEO_CATEGORIES[0].id,
      type: formData.type || 'tutorial',
      status: formData.status || 'draft',
      isFeatured: formData.isFeatured || false,
      isPublic: formData.isPublic !== undefined ? formData.isPublic : true,
      presenter: formData.presenter,
      department: formData.department,
      duration: totalDuration,
      publishDate: formData.publishDate || new Date().toISOString().split('T')[0],
      recordedDate: formData.recordedDate,
      quality: formData.quality || 'auto',
      platform: formData.platform || 'youtube',
      language: formData.language || 'en',
      tags: formData.tags || [],
      views: formData.views || 0,
      likes: formData.likes || 0,
      comments: formData.comments || 0,
      shares: formData.shares || 0,
      transcript: formData.transcript,
      relatedVideos: formData.relatedVideos,
      playlist: formData.playlist,
      createdAt: video?.createdAt || now,
      updatedAt: now,
    };

    onSave(videoData);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(tag => tag !== tagToRemove) || [],
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0 flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-red-50 to-white dark:from-gray-800 dark:to-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {video ? 'Edit Video' : 'Add New Video'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <IconX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title *
          </label>
          <input
            id="title"
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Enter video title"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Brief description of the video"
          />
        </div>

        {/* Thumbnail URL */}
        <div>
          <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Thumbnail URL *
          </label>
          <input
            id="thumbnailUrl"
            type="url"
            required
            value={formData.thumbnailUrl}
            onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="https://example.com/thumbnail.jpg"
          />
        </div>

        {/* Video URL */}
        <div>
          <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Video URL *
          </label>
          <input
            id="videoUrl"
            type="url"
            required
            value={formData.videoUrl}
            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>

        {/* Embed URL */}
        <div>
          <label htmlFor="embedUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Embed URL
          </label>
          <input
            id="embedUrl"
            type="url"
            value={formData.embedUrl || ''}
            onChange={(e) => setFormData({ ...formData, embedUrl: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="https://youtube.com/embed/..."
          />
        </div>

        {/* Category & Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category *
            </label>
            <select
              id="category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {VIDEO_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type *
            </label>
            <select
              id="type"
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Video['type'] })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {VIDEO_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Platform & Quality */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Platform *
            </label>
            <select
              id="platform"
              required
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value as Video['platform'] })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {VIDEO_PLATFORMS.map((platform) => (
                <option key={platform.value} value={platform.value}>
                  {platform.icon} {platform.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="quality" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quality *
            </label>
            <select
              id="quality"
              required
              value={formData.quality}
              onChange={(e) => setFormData({ ...formData, quality: e.target.value as Video['quality'] })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {VIDEO_QUALITIES.map((quality) => (
                <option key={quality.value} value={quality.value}>
                  {quality.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Presenter & Department */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="presenter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Presenter
            </label>
            <input
              id="presenter"
              type="text"
              value={formData.presenter || ''}
              onChange={(e) => setFormData({ ...formData, presenter: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Presenter name"
            />
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Department
            </label>
            <input
              id="department"
              type="text"
              value={formData.department || ''}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Department name"
            />
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Duration *
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                min="0"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Minutes"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Minutes</p>
            </div>
            <div>
              <input
                type="number"
                min="0"
                max="59"
                value={durationSeconds}
                onChange={(e) => setDurationSeconds(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Seconds"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Seconds</p>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Publish Date *
            </label>
            <input
              id="publishDate"
              type="date"
              required
              value={formData.publishDate}
              onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="recordedDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Recorded Date
            </label>
            <input
              id="recordedDate"
              type="date"
              value={formData.recordedDate || ''}
              onChange={(e) => setFormData({ ...formData, recordedDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Language */}
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Language *
          </label>
          <select
            id="language"
            required
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {VIDEO_LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tagInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              id="tagInput"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Add a tag"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags?.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-red-900 dark:hover:text-red-200"
                >
                  <IconX className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Playlist */}
        <div>
          <label htmlFor="playlist" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Playlist
          </label>
          <input
            id="playlist"
            type="text"
            value={formData.playlist || ''}
            onChange={(e) => setFormData({ ...formData, playlist: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Playlist name or ID"
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status *
          </label>
          <select
            id="status"
            required
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Video['status'] })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Checkboxes */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Featured Video</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Public Access</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            <IconSave className="w-4 h-4" />
            {video ? 'Update Video' : 'Create Video'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default VideoForm;
