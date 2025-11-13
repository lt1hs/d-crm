import React from 'react';
import { Slide } from '../../types/slider';
import { IconEdit, IconTrash, IconGripVertical, IconExternalLink } from '../Icons';

interface SlideListItemProps {
  slide: Slide;
  onEdit: (slide: Slide) => void;
  onDelete: (slideId: string) => void;
}

const SlideListItem: React.FC<SlideListItemProps> = ({ slide, onEdit, onDelete }) => {
  return (
    <div
      className={`
        flex items-center gap-4 p-4 rounded-lg border
        ${slide.isActive 
          ? 'bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600' 
          : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60'
        }
        hover:shadow-md transition-all
      `}
    >
      {/* Drag Handle */}
      <button 
        className="cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        aria-label="Drag to reorder"
      >
        <IconGripVertical className="w-5 h-5" />
      </button>

      {/* Image Thumbnail */}
      <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
        <img 
          src={slide.imageUrl} 
          alt={slide.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
          }}
        />
      </div>

      {/* Slide Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {slide.title}
          </h3>
          {slide.linkUrl && (
            <IconExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0" />
          )}
        </div>
        {slide.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
            {slide.description}
          </p>
        )}
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Order: #{slide.order}
          </span>
          {slide.linkText && (
            <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
              {slide.linkText}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(slide)}
          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          title="Edit"
        >
          <IconEdit className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            if (confirm(`Delete slide "${slide.title}"?`)) {
              onDelete(slide.id);
            }
          }}
          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          title="Delete"
        >
          <IconTrash className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SlideListItem;
