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
              placeholder="Title, author, ISBN..."
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
            {BOOK_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Languages</option>
            {BOOK_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
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
                isActive: value === '' ? undefined : value === 'active',
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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
              onChange={(e) => onSortChange(e.target.value as BookSortBy, sortOrder)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="createdAt">Date Added</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="publishedDate">Published</option>
              <option value="rating">Rating</option>
            </select>
            <button
              onClick={() => onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(filter.search || filter.category || filter.language || filter.isActive !== undefined) && (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500 dark:text-gray-400">Active filters:</span>
          {filter.search && (
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs">
              Search: {filter.search}
            </span>
          )}
          {filter.category && (
            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-xs">
              {BOOK_CATEGORIES.find(c => c.id === filter.category)?.name}
            </span>
          )}
          {filter.language && (
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs">
              {BOOK_LANGUAGES.find(l => l.code === filter.language)?.name}
            </span>
          )}
          {filter.isActive !== undefined && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
              {filter.isActive ? 'Active' : 'Inactive'}
            </span>
          )}
          <button
            onClick={() => onFilterChange({})}
            className="px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default BookFilters;
