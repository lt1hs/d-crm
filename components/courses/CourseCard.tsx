import React from 'react';
import { Course } from '../../types/course';
import { COURSE_CATEGORIES } from '../../data/courseCategories';
import { getStatusColor, getLevelColor, formatPrice, formatDuration, formatNumber } from '../../utils/courseHelpers';
import { IconEdit, IconTrash, IconStar, IconUsers, IconClock, IconBook } from '../Icons';

interface CourseCardProps {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
  onToggleFeatured: (courseId: string) => void;
  onToggleBestseller: (courseId: string) => void;
  onChangeStatus: (courseId: string, status: Course['status']) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onEdit,
  onDelete,
  onToggleFeatured,
  onChangeStatus,
}) => {
  const category = COURSE_CATEGORIES.find(c => c.id === course.category);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all overflow-hidden">
      {/* Thumbnail */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-900">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect fill='%233b82f6' width='300' height='400'/%3E%3Ctext fill='white' font-size='48' font-family='Arial' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ECourse%3C/text%3E%3C/svg%3E`;
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {course.isFeatured && (
            <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded flex items-center gap-1">
              <IconStar className="w-3 h-3" />
              Featured
            </span>
          )}
          {course.isBestseller && (
            <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded">
              🏆 Bestseller
            </span>
          )}
          {category && (
            <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
              {category.icon} {category.name}
            </span>
          )}
        </div>

        {/* Level Badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 text-xs font-medium rounded ${getLevelColor(course.level)}`}>
            {course.level.charAt(0).toUpperCase() + course.level.slice(1).replace('-', ' ')}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute bottom-2 left-2">
          <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(course.status)}`}>
            {course.status.charAt(0).toUpperCase() + course.status.slice(1).replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
          {course.title}
        </h3>
        
        {/* Instructor & Price */}
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          By {course.instructor} • {course.price === 0 ? 'FREE' : formatPrice(course.price, course.currency)}
        </p>

        {/* Description */}
        {course.shortDescription && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
            {course.shortDescription}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <IconBook className="w-3 h-3" />
            {course.lessonsCount} lessons
          </span>
          <span className="flex items-center gap-1">
            <IconClock className="w-3 h-3" />
            {formatDuration(course.duration)}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <IconStar className="w-3 h-3 text-yellow-500" />
            {course.rating.toFixed(1)} ({formatNumber(course.reviewsCount)})
          </span>
          <span className="flex items-center gap-1">
            <IconUsers className="w-3 h-3" />
            {formatNumber(course.enrolledStudents)}
          </span>
        </div>

        {/* Tags */}
        {course.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {course.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
              >
                {tag}
              </span>
            ))}
            {course.tags.length > 3 && (
              <span className="px-2 py-0.5 text-gray-500 dark:text-gray-400 text-xs">
                +{course.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <select
            value={course.status}
            onChange={(e) => onChangeStatus(course.id, e.target.value as Course['status'])}
            className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            aria-label="Change course status"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
            <option value="coming-soon">Coming Soon</option>
          </select>

          <button
            type="button"
            onClick={() => onToggleFeatured(course.id)}
            className={`p-2 rounded-lg transition-colors ${
              course.isFeatured
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
            title={course.isFeatured ? 'Remove from featured' : 'Add to featured'}
          >
            <IconStar className="w-4 h-4" />
          </button>

          <div className="flex-1"></div>

          <button
            type="button"
            onClick={() => onEdit(course)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Edit"
          >
            <IconEdit className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm(`Delete "${course.title}"?`)) {
                onDelete(course.id);
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

export default CourseCard;
