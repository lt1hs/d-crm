import React from 'react';
import { MagazineFilter, MagazineSortBy, MagazineSortOrder, MagazineIssue } from '../../types/magazine';
import { MAGAZINE_CATEGORIES, MAGAZINE_STATUSES } from '../../data/magazineCategories';
import { IconSearch, IconFilter, IconSort, IconCalendar } from '../Icons';

interface MagazineFiltersProps {
  filter: MagazineFilter;
  onFilterChange: (filter: MagazineFilter) => void;
  sortBy: MagazineSortBy;
  sortOrder: MagazineSortOrder;
  onSortChange: (sortBy: MagazineSortBy, sortOrder: MagazineSortOrder) => void;
}

const MagazineFilters: React.FC<MagazineFiltersProps> = ({
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
              placeholder="Title, editor, tags..."
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
            {MAGAZINE_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
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
            onChange={(e) => onFilterChange({ ...filter, status: (e.target.value || undefined) as MagazineIssue['status'] | undefined })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            {MAGAZINE_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.icon} {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date From */}
        <div>
          <label htmlFor="dateFrom" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            <IconCalendar className="w-3 h-3 inline mr-1" />
            From Date
          </label>
          <input
            id="dateFrom"
            type="date"
            value={filter.dateFrom || ''}
            onChange={(e) => onFilterChange({ ...filter, dateFrom: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
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
              onChange={(e) => onSortChange(e.target.value as MagazineSortBy, sortOrder)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="issueNumber">Issue #</option>
              <option value="publishDate">Publish Date</option>
              <option value="title">Title</option>
              <option value="views">Views</option>
              <option value="downloads">Downloads</option>
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

      {/* Quick Filters */}
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-500 dark:text-gray-400">Quick filters:</span>
        <button
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
          onClick={() => onFilterChange({ ...filter, isPublic: filter.isPublic ? undefined : true })}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            filter.isPublic
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          🌐 Public
        </button>
        {(filter.search || filter.category || filter.status || filter.isFeatured || filter.isPublic || filter.dateFrom || filter.dateTo) && (
          <button
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

export default MagazineFilters;
