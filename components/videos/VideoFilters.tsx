import React from 'react';
import { VideoFilter, VideoSortBy, VideoSortOrder, Video } from '../../types/video';
import { VIDEO_CATEGORIES, VIDEO_TYPES, VIDEO_STATUSES, VIDEO_PLATFORMS } from '../../data/videoCategories';
import { IconSearch, IconFilter, IconSort } from '../Icons';

interface VideoFiltersProps {
  filter: VideoFilter;
  onFilterChange: (filter: VideoFilter) => void;
  sortBy: VideoSortBy;
  sortOrder: VideoSortOrder;
  onSortChange: (sortBy: VideoSortBy, sortOrder: VideoSortOrder) => void;
}

const VideoFilters: React.FC<VideoFiltersProps> = ({
  filter,
  onFilterChange,
  sortBy,
  sortOrder,
  onSortChange,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center gap-2 mb-4">
        <IconFilter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Filters & Search
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label htmlFor="search" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search
          </label>
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="search"
              type="text"
              value={filter.search || ''}
              onChange={(e) => onFilterChange({ ...filter, search: e.target.value || undefined })}
              placeholder="Title, presenter, tags..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            id="category"
            value={filter.category || ''}
            onChange={(e) => onFilterChange({ ...filter, category: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {VIDEO_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div>
          <label htmlFor="type" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Type
          </label>
          <select
            id="type"
            value={filter.type || ''}
            onChange={(e) => onFilterChange({ ...filter, type: (e.target.value || undefined) as Video['type'] | undefined })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            {VIDEO_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.icon} {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Platform */}
        <div>
          <label htmlFor="platform" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Platform
          </label>
          <select
            id="platform"
            value={filter.platform || ''}
            onChange={(e) => onFilterChange({ ...filter, platform: (e.target.value || undefined) as Video['platform'] | undefined })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Platforms</option>
            {VIDEO_PLATFORMS.map((platform) => (
              <option key={platform.value} value={platform.value}>
                {platform.icon} {platform.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            id="status"
            value={filter.status || ''}
            onChange={(e) => onFilterChange({ ...filter, status: (e.target.value || undefined) as Video['status'] | undefined })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            {VIDEO_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.icon} {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label htmlFor="sortBy" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            <IconSort className="inline w-3 h-3 mr-1" />
            Sort By
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as VideoSortBy, sortOrder)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="publishDate">Publish Date</option>
            <option value="recordedDate">Recorded Date</option>
            <option value="title">Title</option>
            <option value="views">Views</option>
            <option value="likes">Likes</option>
            <option value="duration">Duration</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label htmlFor="sortOrder" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Order
          </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => onSortChange(sortBy, e.target.value as VideoSortOrder)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onFilterChange({ ...filter, isFeatured: filter.isFeatured ? undefined : true })}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              filter.isFeatured
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-2 border-yellow-500'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            ⭐ Featured Only
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ ...filter, isPublic: filter.isPublic ? undefined : true })}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              filter.isPublic
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-2 border-green-500'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            🌐 Public Only
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({})}
            className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
          >
            🔄 Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoFilters;
