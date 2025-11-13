import React from 'react';
import { Testimonial } from '../../types/testimonial';
import { TESTIMONIAL_CATEGORIES } from '../../data/testimonialCategories';
import { getStatusColor, formatDate, getRatingStars, getRatingColor } from '../../utils/testimonialHelpers';
import { IconEdit, IconTrash, IconStar, IconCheck, IconQuote } from '../Icons';

interface TestimonialCardProps {
  testimonial: Testimonial;
  onEdit: (testimonial: Testimonial) => void;
  onDelete: (testimonialId: string) => void;
  onToggleFeatured: (testimonialId: string) => void;
  onChangeStatus: (testimonialId: string, status: Testimonial['status']) => void;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  onEdit,
  onDelete,
  onToggleFeatured,
  onChangeStatus,
}) => {
  const category = TESTIMONIAL_CATEGORIES.find(c => c.id === testimonial.category);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-lg transition-all overflow-hidden">
      {/* Header */}
      <div className="relative p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {testimonial.isFeatured && (
            <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded flex items-center gap-1">
              <IconStar className="w-3 h-3" />
              Featured
            </span>
          )}
          {testimonial.verified && (
            <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded flex items-center gap-1">
              <IconCheck className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(testimonial.status)}`}>
            {testimonial.status.charAt(0).toUpperCase() + testimonial.status.slice(1)}
          </span>
        </div>

        {/* Avatar & Info */}
        <div className="flex items-start gap-3 mt-8">
          <div className="flex-shrink-0">
            {testimonial.avatarUrl ? (
              <img
                src={testimonial.avatarUrl}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md"
                onError={(e) => {
                  e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect fill='%23f59e0b' width='64' height='64'/%3E%3Ctext fill='white' font-size='24' font-family='Arial' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3E${testimonial.name.charAt(0)}%3C/text%3E%3C/svg%3E`;
                }}
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-2xl font-bold border-4 border-white dark:border-gray-700 shadow-md">
                {testimonial.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate">
              {testimonial.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {testimonial.position}
            </p>
            {testimonial.company && (
              <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                {testimonial.company}
              </p>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-2">
          <span className={`text-lg ${getRatingColor(testimonial.rating)}`}>
            {getRatingStars(testimonial.rating)}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {testimonial.rating}/5
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        {category && (
          <div className="mb-3">
            <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium rounded">
              {category.icon} {category.name}
            </span>
          </div>
        )}

        {/* Testimonial Text */}
        <div className="relative mb-3">
          <IconQuote className="absolute -top-1 -left-1 w-6 h-6 text-amber-200 dark:text-amber-800" />
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-4 pl-5 italic">
            "{testimonial.testimonial}"
          </p>
        </div>

        {/* Date & Type */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span>{formatDate(testimonial.date)}</span>
          <span>•</span>
          <span className="capitalize">{testimonial.type}</span>
          {testimonial.location && (
            <>
              <span>•</span>
              <span>📍 {testimonial.location}</span>
            </>
          )}
        </div>

        {/* Tags */}
        {testimonial.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {testimonial.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
              >
                {tag}
              </span>
            ))}
            {testimonial.tags.length > 3 && (
              <span className="px-2 py-0.5 text-gray-500 dark:text-gray-400 text-xs">
                +{testimonial.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Helpful Count */}
        {testimonial.helpfulCount > 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            👍 {testimonial.helpfulCount} found this helpful
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <select
            value={testimonial.status}
            onChange={(e) => onChangeStatus(testimonial.id, e.target.value as Testimonial['status'])}
            className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            aria-label="Change testimonial status"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>

          <button
            type="button"
            onClick={() => onToggleFeatured(testimonial.id)}
            className={`p-2 rounded-lg transition-colors ${
              testimonial.isFeatured
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
            title={testimonial.isFeatured ? 'Remove from featured' : 'Add to featured'}
          >
            <IconStar className="w-4 h-4" />
          </button>

          <div className="flex-1"></div>

          <button
            type="button"
            onClick={() => onEdit(testimonial)}
            className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
            title="Edit"
          >
            <IconEdit className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm(`Delete testimonial from "${testimonial.name}"?`)) {
                onDelete(testimonial.id);
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

export default TestimonialCard;
