import React, { useState } from 'react';
import { NewsPost } from '../../types/news';
import { Edit, Trash2, Eye, Clock, User, Image as ImageIcon, CheckCircle } from '../Icons';
import { getStatusColor, getStatusLabel } from '../../utils/newsHelpers';
import NewsPriorityBadge from './NewsPriorityBadge';
import NewsPreview from './NewsPreview';

interface NewsCardProps {
  post: NewsPost;
  onEdit: () => void;
  onDelete: () => void;
  onViewWorkflow: () => void;
  canEdit: boolean;
  canDelete: boolean;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({
  post,
  onEdit,
  onDelete,
  onViewWorkflow,
  canEdit,
  canDelete,
  isSelected = false,
  onSelect,
}) => {
  const [showPreview, setShowPreview] = useState(false);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <div className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Selection Checkbox */}
            {onSelect && (
              <div className="pt-1">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => onSelect(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  aria-label="Select post"
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              {/* Title and Status */}
              <div className="flex items-start gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 flex-1">
                  {post.title}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(post.status)}`}>
                  {getStatusLabel(post.status)}
                </span>
              </div>

              {/* Priority and Deadline */}
              <div className="mb-3">
                <NewsPriorityBadge priority={post.priority} deadline={post.overallDeadline} />
              </div>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {post.excerpt}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>Author: {post.authorName}</span>
              </div>
              
              {post.designerName && (
                <div className="flex items-center gap-1">
                  <ImageIcon className="w-4 h-4" />
                  <span>Designer: {post.designerName}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDate(post.updatedAt)}</span>
              </div>

              {post.images.length > 0 && (
                <span className="text-blue-600">
                  {post.images.length} image(s)
                </span>
              )}
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Latest Comment */}
            {post.comments.length > 0 && (
              <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{post.comments[post.comments.length - 1].username}:</span>{' '}
                  {post.comments[post.comments.length - 1].comment}
                </p>
              </div>
            )}
          </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                title="Preview"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={onViewWorkflow}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                title="View Workflow"
              >
                <CheckCircle className="w-5 h-5" />
              </button>
              {canEdit && (
                <button
                  type="button"
                  onClick={onEdit}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                  title="Edit"
                >
                  <Edit className="w-5 h-5" />
                </button>
              )}
              {canDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <NewsPreview post={post} onClose={() => setShowPreview(false)} />
      )}
    </>
  );
};

export default NewsCard;
