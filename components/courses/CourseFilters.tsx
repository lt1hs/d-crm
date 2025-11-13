import React from 'react';
import { CourseFilter, CourseSortBy, CourseSortOrder } from '../../types/course';
import { COURSE_CATEGORIES, COURSE_LEVELS, COURSE_STATUSES } from '../../data/courseCategories';
import { IconSearch, IconFilter, IconSort } from '../Icons';

interface CourseFiltersProps {
  filter: CourseFilter;
  onFilterChange: (filter: CourseFilter) => void;
  sortBy: CourseSortBy;
  sortOrder: CourseSortOrder;
  onSortChange: (sortBy: CourseSortBy, sortOrder: CourseSortOrder) => void;
}

const CourseFilters: React.FC<CourseFiltersProps> = ({
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
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
              placeholder="Title, instructor, tags..."
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
            {COURSE_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Level */}
        <div>
          <label htmlFor="level" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Level
          </label>
          <select
            id="level"
            value={filter.level || ''}
            onChange={(e) => onFilterChange({ ...filter, level: e.target.value as any || undefined })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Levels</option>
            {COURSE_LEVELS.map((level) => (
              <option key={level.id} value={level.id}>
                {level.label}
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
            onChange={(e) => onFilterChange({ ...filter, status: e.target.value as any || undefined })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            {COURSE_STATUSES.map((status) => (
              <option key={status.id} value={status.id}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label htmlFor="sort" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            <IconSort className="w-3 h-3 inline mr-1" />
            Sort By
          </label>
          <div className="flex gap-2">
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as CourseSortBy, sortOrder)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="title">Title</option>
              <option value="price">Price</option>
              <option value="enrolledStudents">Students</option>
              <option value="rating">Rating</option>
              <option value="createdAt">Created</option>
            </select>
            <button
              type="button"
              onClick={() => onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-500 dark:text-gray-400">Quick filters:</span>
        <button
          type="button"
          onClick={() => onFilterChange({ ...filter, isFeatured: filter.isFeatured ? undefined : true })}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            filter.isFeatured
              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          ⭐ Featured
        </button>
        <button
          type="button"
          onClick={() => onFilterChange({ ...filter, isBestseller: filter.isBestseller ? undefined : true })}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            filter.isBestseller
              ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          🏆 Bestseller
        </button>
        {(filter.search || filter.category || filter.level || filter.status || filter.isFeatured || filter.isBestseller) && (
          <button
            type="button"
            onClick={() => onFilterChange({})}
            className="px-3 py-1 text-xs text-red-600 dark:text-red-400 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseFilters;
