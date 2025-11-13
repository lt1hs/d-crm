import React from 'react';
import { Infographic } from '../../types/infographic';
import { INFOGRAPHIC_CATEGORIES } from '../../data/infographicCategories';
import { getStatusColor, formatDate, formatNumber, getDimensionsText } from '../../utils/infographicHelpers';
import { IconEdit, IconTrash, IconStar, IconEye, IconDownload, IconHeart, IconShare } from '../Icons';

interface InfographicCardProps {
  infographic: Infographic;
  onEdit: (infographic: Infographic) => void;
  onDelete: (infographicId: string) => void;
  onToggleFeatured: (infographicId: string) => void;
  onChangeStatus: (infographicId: string, status: Infographic['status']) => void;
}

const InfographicCard: React.FC<InfographicCardProps> = ({
  infographic,
  onEdit,
  onDelete,
  onToggleFeatured,
  onChangeStatus,
}) => {
  const category = INFOGRAPHIC_CATEGORIES.find(c => c.id === infographic.category);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-lg transition-all overflow-hidden">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-900">
        <img
          src={infographic.thumbnailUrl || infographic.imageUrl}
          alt={infographic.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect fill='%2310b981' width='300' height='400'/%3E%3Ctext fill='white' font-size='48' font-family='Arial' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3E📊%3C/text%3E%3C/svg%3E`;
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {infographic.isFeatured && (
            <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded flex items-center gap-1">
              <IconStar className="w-3 h-3" />
              Featured
            </span>
          )}
          {category && (
            <span className="px-2 py-1 bg-emerald-600 text-white text-xs font-medium rounded">
              {category.icon} {category.name}
            </span>
          )}
        </div>

        {/* Format Badge */}
        <div className="absolute top-2 right-2">
          <span className="px-3 py-1 bg-black/70 text-white text-sm font-bold rounded uppercase">
            {infographic.format}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute bottom-2 left-2">
          <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(infographic.status)}`}>
            {infographic.status.charAt(0).toUpperCase() + infographic.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
          {infographic.title}
        </h3>
        
        {/* Designer & Date */}
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          By {infographic.designer} • {formatDate(infographic.createdDate)}
        </p>

        {/* Description */}
        {infographic.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
            {infographic.description}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
          {infographic.dimensions && (
            <span>{getDimensionsText(infographic.dimensions)}</span>
          )}
          {infographic.fileSize && (
            <span>{infographic.fileSize.toFixed(1)} MB</span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <IconEye className="w-3 h-3" />
            {formatNumber(infographic.views)}
          </span>
          <span className="flex items-center gap-1">
            <IconDownload className="w-3 h-3" />
            {formatNumber(infographic.downloads)}
          </span>
          <span className="flex items-center gap-1">
            <IconHeart className="w-3 h-3" />
            {formatNumber(infographic.likes)}
          </span>
          <span className="flex items-center gap-1">
            <IconShare className="w-3 h-3" />
            {formatNumber(infographic.shares)}
          </span>
        </div>

        {/* Tags */}
        {infographic.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {infographic.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
              >
                {tag}
              </span>
            ))}
            {infographic.tags.length > 3 && (
              <span className="px-2 py-0.5 text-gray-500 dark:text-gray-400 text-xs">
                +{infographic.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <select
            value={infographic.status}
            onChange={(e) => onChangeStatus(infographic.id, e.target.value as Infographic['status'])}
            className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            aria-label="Change infographic status"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>

          <button
            type="button"
            onClick={() => onToggleFeatured(infographic.id)}
            className={`p-2 rounded-lg transition-colors ${
              infographic.isFeatured
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
            title={infographic.isFeatured ? 'Remove from featured' : 'Add to featured'}
          >
            <IconStar className="w-4 h-4" />
          </button>

          <div className="flex-1"></div>

          <button
            type="button"
            onClick={() => onEdit(infographic)}
            className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
            title="Edit"
          >
            <IconEdit className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm(`Delete "${infographic.title}"?`)) {
                onDelete(infographic.id);
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

export default InfographicCard;
