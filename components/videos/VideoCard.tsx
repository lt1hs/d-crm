import React from 'react';
import { Video } from '../../types/video';
import { VIDEO_CATEGORIES } from '../../data/videoCategories';
import { getStatusColor, formatDate, formatNumber, formatDuration, getPlatformIcon } from '../../utils/videoHelpers';
import { IconEdit, IconTrash, IconStar, IconEye, IconHeart, IconMessageCircle, IconShare, IconVideo } from '../Icons';

interface VideoCardProps {
  video: Video;
  onEdit: (video: Video) => void;
  onDelete: (videoId: string) => void;
  onToggleFeatured: (videoId: string) => void;
  onChangeStatus: (videoId: string, status: Video['status']) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onEdit,
  onDelete,
  onToggleFeatured,
  onChangeStatus,
}) => {
  const category = VIDEO_CATEGORIES.find(c => c.id === video.category);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 hover:shadow-lg transition-all overflow-hidden">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-900 group">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225'%3E%3Crect fill='%23ef4444' width='400' height='225'/%3E%3Ctext fill='white' font-size='48' font-family='Arial' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3E▶️%3C/text%3E%3C/svg%3E`;
          }}
        />
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
            <IconVideo className="w-8 h-8 text-white ml-1" />
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2">
          <span className="px-2 py-1 bg-black/80 text-white text-xs font-bold rounded">
            {formatDuration(video.duration)}
          </span>
        </div>

        {/* Platform Badge */}
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 bg-black/80 text-white text-xs font-bold rounded">
            {getPlatformIcon(video.platform)} {video.platform}
          </span>
        </div>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {video.isFeatured && (
            <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded flex items-center gap-1">
              <IconStar className="w-3 h-3" />
              Featured
            </span>
          )}
          {category && (
            <span className="px-2 py-1 bg-red-600 text-white text-xs font-medium rounded">
              {category.icon} {category.name}
            </span>
          )}
        </div>

        {/* Status Badge */}
        <div className="absolute bottom-2 left-2">
          <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(video.status)}`}>
            {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
          {video.title}
        </h3>
        
        {/* Presenter & Date */}
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          {video.presenter && `By ${video.presenter} • `}{formatDate(video.publishDate)}
        </p>

        {/* Description */}
        {video.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
            {video.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <IconEye className="w-3 h-3" />
            {formatNumber(video.views)}
          </span>
          <span className="flex items-center gap-1">
            <IconHeart className="w-3 h-3" />
            {formatNumber(video.likes)}
          </span>
          <span className="flex items-center gap-1">
            <IconMessageCircle className="w-3 h-3" />
            {formatNumber(video.comments)}
          </span>
          <span className="flex items-center gap-1">
            <IconShare className="w-3 h-3" />
            {formatNumber(video.shares)}
          </span>
        </div>

        {/* Tags */}
        {video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {video.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
              >
                {tag}
              </span>
            ))}
            {video.tags.length > 3 && (
              <span className="px-2 py-0.5 text-gray-500 dark:text-gray-400 text-xs">
                +{video.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <select
            value={video.status}
            onChange={(e) => onChangeStatus(video.id, e.target.value as Video['status'])}
            className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            aria-label="Change video status"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>

          <button
            type="button"
            onClick={() => onToggleFeatured(video.id)}
            className={`p-2 rounded-lg transition-colors ${
              video.isFeatured
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
            title={video.isFeatured ? 'Remove from featured' : 'Add to featured'}
          >
            <IconStar className="w-4 h-4" />
          </button>

          <div className="flex-1"></div>

          <button
            type="button"
            onClick={() => onEdit(video)}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Edit"
          >
            <IconEdit className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm(`Delete "${video.title}"?`)) {
                onDelete(video.id);
              }
            }}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete"
          >
            <IconTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
