import React from 'react';
import { Activity } from '../../types/activity';
import { ACTIVITY_CATEGORIES } from '../../data/activityCategories';
import { getStatusColor, getTypeIcon, formatDateTime, formatNumber } from '../../utils/activityHelpers';
import { IconEdit, IconTrash, IconStar, IconEye, IconUsers, IconMapPin, IconClock } from '../Icons';

interface ActivityCardProps {
  activity: Activity;
  onEdit: (activity: Activity) => void;
  onDelete: (activityId: string) => void;
  onToggleFeatured: (activityId: string) => void;
  onChangeStatus: (activityId: string, status: Activity['status']) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onEdit,
  onDelete,
  onToggleFeatured,
  onChangeStatus,
}) => {
  const category = ACTIVITY_CATEGORIES.find(c => c.id === activity.category);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Cover Image */}
        <div className="md:w-64 h-48 md:h-auto flex-shrink-0 relative overflow-hidden bg-gray-100 dark:bg-gray-900">
          <img
            src={activity.coverImage}
            alt={activity.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%236b7280' width='400' height='300'/%3E%3Ctext fill='white' font-size='24' font-family='Arial' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E`;
            }}
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {activity.isFeatured && (
              <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded flex items-center gap-1">
                <IconStar className="w-3 h-3" />
                Featured
              </span>
            )}
            <span className="px-2 py-1 bg-purple-600 text-white text-xs font-medium rounded">
              {getTypeIcon(activity.type)} {activity.type}
            </span>
          </div>

          {/* Status Badge */}
          <div className="absolute bottom-2 left-2">
            <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(activity.status)}`}>
              {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
            </span>
          </div>

          {/* Media Count */}
          {activity.media.length > 0 && (
            <div className="absolute bottom-2 right-2">
              <span className="px-2 py-1 bg-black/60 text-white text-xs font-medium rounded">
                📎 {activity.media.length} media
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              {/* Category */}
              {category && (
                <span className="inline-block px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-medium rounded mb-2">
                  {category.icon} {category.name}
                </span>
              )}
              
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                {activity.title}
              </h3>
              
              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                {activity.description}
              </p>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <span className="flex items-center gap-1">
              <IconClock className="w-3 h-3" />
              {formatDateTime(activity.startDate, activity.startTime)}
            </span>
            {activity.location && (
              <span className="flex items-center gap-1">
                <IconMapPin className="w-3 h-3" />
                {activity.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              👤 {activity.organizer}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <span className="flex items-center gap-1">
              <IconEye className="w-3 h-3" />
              {formatNumber(activity.views)} views
            </span>
            <span className="flex items-center gap-1">
              <IconUsers className="w-3 h-3" />
              {activity.attendees} attendees
            </span>
            {activity.maxParticipants > 0 && (
              <span className="text-xs">
                Max: {activity.maxParticipants}
              </span>
            )}
          </div>

          {/* Tags */}
          {activity.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {activity.tags.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
                >
                  #{tag}
                </span>
              ))}
              {activity.tags.length > 4 && (
                <span className="px-2 py-0.5 text-gray-500 dark:text-gray-400 text-xs">
                  +{activity.tags.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            {/* Status Dropdown */}
            <select
              value={activity.status}
              onChange={(e) => onChangeStatus(activity.id, e.target.value as Activity['status'])}
              className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              aria-label="Change activity status"
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button
              onClick={() => onToggleFeatured(activity.id)}
              className={`p-2 rounded-lg transition-colors ${
                activity.isFeatured
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
              title={activity.isFeatured ? 'Remove from featured' : 'Add to featured'}
            >
              <IconStar className="w-4 h-4" />
            </button>

            <div className="flex-1"></div>

            <button
              onClick={() => onEdit(activity)}
              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="Edit"
            >
              <IconEdit className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (confirm(`Delete "${activity.title}"?`)) {
                  onDelete(activity.id);
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
    </div>
  );
};

export default ActivityCard;
