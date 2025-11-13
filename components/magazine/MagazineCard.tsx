import React from 'react';
import { MagazineIssue } from '../../types/magazine';
import { MAGAZINE_CATEGORIES } from '../../data/magazineCategories';
import { getStatusColor, formatDate, formatNumber, formatPrice } from '../../utils/magazineHelpers';
import { IconEdit, IconTrash, IconStar, IconEye, IconDownload, IconFileText } from '../Icons';

interface MagazineCardProps {
  magazine: MagazineIssue;
  onEdit: (magazine: MagazineIssue) => void;
  onDelete: (magazineId: string) => void;
  onToggleFeatured: (magazineId: string) => void;
  onChangeStatus: (magazineId: string, status: MagazineIssue['status']) => void;
}

const MagazineCard: React.FC<MagazineCardProps> = ({
  magazine,
  onEdit,
  onDelete,
  onToggleFeatured,
  onChangeStatus,
}) => {
  const category = MAGAZINE_CATEGORIES.find(c => c.id === magazine.category);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg transition-all overflow-hidden">
      {/* Cover Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-900">
        <img
          src={magazine.coverImage}
          alt={magazine.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect fill='%239333ea' width='300' height='400'/%3E%3Ctext fill='white' font-size='48' font-family='Arial' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3E%23${magazine.issueNumber}%3C/text%3E%3C/svg%3E`;
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {magazine.isFeatured && (
            <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded flex items-center gap-1">
              <IconStar className="w-3 h-3" />
              Featured
            </span>
          )}
          {category && (
            <span className="px-2 py-1 bg-purple-600 text-white text-xs font-medium rounded">
              {category.icon} {category.name}
            </span>
          )}
        </div>

        {/* Issue Number Badge */}
        <div className="absolute top-2 right-2">
          <span className="px-3 py-1 bg-black/70 text-white text-sm font-bold rounded">
            #{magazine.issueNumber}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute bottom-2 left-2">
          <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(magazine.status)}`}>
            {magazine.status.charAt(0).toUpperCase() + magazine.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
          {magazine.title}
        </h3>
        
        {/* Editor & Date */}
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          By {magazine.editor} • {formatDate(magazine.publishDate)}
        </p>

        {/* Description */}
        {magazine.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
            {magazine.description}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <IconFileText className="w-3 h-3" />
            {magazine.articles.length} articles
          </span>
          <span>{magazine.totalPages} pages</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <IconEye className="w-3 h-3" />
            {formatNumber(magazine.views)}
          </span>
          <span className="flex items-center gap-1">
            <IconDownload className="w-3 h-3" />
            {formatNumber(magazine.downloads)}
          </span>
        </div>

        {/* Price */}
        {magazine.price && (
          <div className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-3">
            {formatPrice(magazine.price, magazine.currency)}
          </div>
        )}

        {/* Tags */}
        {magazine.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {magazine.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
              >
                {tag}
              </span>
            ))}
            {magazine.tags.length > 3 && (
              <span className="px-2 py-0.5 text-gray-500 dark:text-gray-400 text-xs">
                +{magazine.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <select
            value={magazine.status}
            onChange={(e) => onChangeStatus(magazine.id, e.target.value as MagazineIssue['status'])}
            className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            aria-label="Change magazine status"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>

          <button
            onClick={() => onToggleFeatured(magazine.id)}
            className={`p-2 rounded-lg transition-colors ${
              magazine.isFeatured
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
            title={magazine.isFeatured ? 'Remove from featured' : 'Add to featured'}
          >
            <IconStar className="w-4 h-4" />
          </button>

          <div className="flex-1"></div>

          <button
            onClick={() => onEdit(magazine)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Edit"
          >
            <IconEdit className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete "${magazine.title}"?`)) {
                onDelete(magazine.id);
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

export default MagazineCard;
