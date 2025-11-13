import React from 'react';
import { Publication } from '../../types/publication';
import { PUBLICATION_CATEGORIES } from '../../data/publicationCategories';
import { getStatusColor, formatDate, formatNumber, formatFileSize } from '../../utils/publicationHelpers';
import { IconEdit, IconTrash, IconStar, IconEye, IconDownload, IconFileText } from '../Icons';

interface PublicationCardProps {
  publication: Publication;
  onEdit: (publication: Publication) => void;
  onDelete: (publicationId: string) => void;
  onToggleFeatured: (publicationId: string) => void;
  onChangeStatus: (publicationId: string, status: Publication['status']) => void;
}

const PublicationCard: React.FC<PublicationCardProps> = ({
  publication,
  onEdit,
  onDelete,
  onToggleFeatured,
  onChangeStatus,
}) => {
  const category = PUBLICATION_CATEGORIES.find(c => c.id === publication.category);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg transition-all overflow-hidden">
      {/* Cover Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-900">
        <img
          src={publication.coverImage}
          alt={publication.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect fill='%236366f1' width='300' height='400'/%3E%3Ctext fill='white' font-size='48' font-family='Arial' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3E📄%3C/text%3E%3C/svg%3E`;
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {publication.isFeatured && (
            <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded flex items-center gap-1">
              <IconStar className="w-3 h-3" />
              Featured
            </span>
          )}
          {category && (
            <span className="px-2 py-1 bg-indigo-600 text-white text-xs font-medium rounded">
              {category.icon} {category.name}
            </span>
          )}
        </div>

        {/* Type Badge */}
        <div className="absolute top-2 right-2">
          <span className="px-3 py-1 bg-black/70 text-white text-sm font-bold rounded">
            {publication.type.charAt(0).toUpperCase() + publication.type.slice(1)}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute bottom-2 left-2">
          <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(publication.status)}`}>
            {publication.status.charAt(0).toUpperCase() + publication.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
          {publication.title}
        </h3>
        
        {/* Author & Date */}
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          By {publication.author} • {formatDate(publication.publishDate)}
        </p>

        {/* Description */}
        {publication.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
            {publication.description}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
          {publication.pageCount && (
            <span className="flex items-center gap-1">
              <IconFileText className="w-3 h-3" />
              {publication.pageCount} pages
            </span>
          )}
          {publication.fileSize && (
            <span>{formatFileSize(publication.fileSize)}</span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <IconEye className="w-3 h-3" />
            {formatNumber(publication.views)}
          </span>
          <span className="flex items-center gap-1">
            <IconDownload className="w-3 h-3" />
            {formatNumber(publication.downloads)}
          </span>
        </div>

        {/* Tags */}
        {publication.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {publication.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
              >
                {tag}
              </span>
            ))}
            {publication.tags.length > 3 && (
              <span className="px-2 py-0.5 text-gray-500 dark:text-gray-400 text-xs">
                +{publication.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <select
            value={publication.status}
            onChange={(e) => onChangeStatus(publication.id, e.target.value as Publication['status'])}
            className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            aria-label="Change publication status"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>

          <button
            type="button"
            onClick={() => onToggleFeatured(publication.id)}
            className={`p-2 rounded-lg transition-colors ${
              publication.isFeatured
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
            title={publication.isFeatured ? 'Remove from featured' : 'Add to featured'}
          >
            <IconStar className="w-4 h-4" />
          </button>

          <div className="flex-1"></div>

          <button
            type="button"
            onClick={() => onEdit(publication)}
            className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
            title="Edit"
          >
            <IconEdit className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm(`Delete "${publication.title}"?`)) {
                onDelete(publication.id);
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

export default PublicationCard;
