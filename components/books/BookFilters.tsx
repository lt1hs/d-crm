import React from 'react';
import { BookFilter, BookSortBy, BookSortOrder } from '../../types/book';
import { BOOK_CATEGORIES, BOOK_LANGUAGES } from '../../data/bookCategories';
import { IconSearch, IconFilter, IconSort } from '../Icons';

interface BookFiltersProps {
  filter: BookFilter;
  onFilterChange: (filter: BookFilter) => void;
  sortBy: BookSortBy;
  sortOrder: BookSortOrder;
  onSortChange: (sortBy: BookSortBy, sortOrder: BookSortOrder) => void;
}

const BookFilters: React.FC<BookFiltersProps> = ({
  filter,
  onFilterChange,
  sortBy,
  sortOrder,
  onSortChange,
}) => {
  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-md border border-gray-200/50 dark:border-gray-700/50 p-3">
      <div className="flex items-center gap-2 mb-3">
        <IconFilter className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Filters & Search
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Search */}
        <div className="lg:col-span-2">
          <label htmlFor="search" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search
          </label>
          <div className="relative">
            <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              id="search"
              type="text"
              value={filter.search || ''}
              onChange={(e) => onFilterChange({ ...filter, search: e.target.value || undefined })}
              placeholder="Title, author, ISBN..."
              className="w-full pl-8 pr-2.5 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
            className="w-full px-2.5 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {BOOK_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Language */}
        <div>
          <label htmlFor="language" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Language
          </label>
          <select
            id="language"
            value={filter.language || ''}
            onChange={(e) => onFilterChange({ ...filter, language: e.target.value || undefined })}
            className="w-full px-2.5 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Languages</option>
            {BOOK_LANGUAGES.map((language) => (
              <option key={language.code} value={language.code}>
                {language.name}
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
            value={filter.isActive === undefined ? '' : filter.isActive ? 'active' : 'inactive'}
            onChange={(e) => {
              const value = e.target.value;
              onFilterChange({
                ...filter,
                isActive: value === '' ? undefined : value === 'active'
              });
            }}
            className="w-full px-2.5 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label htmlFor="sort" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            <IconSort className="inline w-3 h-3 mr-1" />
            Sort By
          </label>
          <select
            id="sort"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split('-') as [BookSortBy, BookSortOrder];
              onSortChange(by, order);
            }}
            className="w-full px-2.5 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="author-asc">Author A-Z</option>
            <option value="author-desc">Author Z-A</option>
            <option value="publishedYear-desc">Year (New-Old)</option>
            <option value="publishedYear-asc">Year (Old-New)</option>
          </select>
        </div>
      </div>

      {/* Active Filters Count */}
      {(filter.search || filter.category || filter.language || filter.isActive !== undefined) && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {[filter.search, filter.category, filter.language, filter.isActive !== undefined].filter(Boolean).length} active filters
            </span>
            <button
              onClick={() => onFilterChange({})}
              className="text-xs text-red-600 hover:text-red-700 font-medium"
              type="button"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookFilters;
