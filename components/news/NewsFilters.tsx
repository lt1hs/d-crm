import React from 'react';
import { NewsStatus } from '../../types/news';
import { getStatusLabel } from '../../utils/newsHelpers';

interface NewsFiltersProps {
  statusFilter: NewsStatus | 'all';
  onStatusFilterChange: (status: NewsStatus | 'all') => void;
  sortBy: 'newest' | 'oldest' | 'title' | 'status';
  onSortChange: (sort: 'newest' | 'oldest' | 'title' | 'status') => void;
  viewMode: 'my_posts' | 'all' | 'pending_action';
  onViewModeChange: (mode: 'my_posts' | 'all' | 'pending_action') => void;
}

const NewsFilters: React.FC<NewsFiltersProps> = ({
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}) => {
  const statuses: (NewsStatus | 'all')[] = [
    'all',
    'draft',
    'awaiting_design',
    'in_design',
    'pending_review',
    'needs_revision',
    'approved',
    'published',
    'scheduled',
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* View Mode */}
      <div>
        <label htmlFor="view-mode-select" className="block text-sm font-medium text-gray-700 mb-2">
          View Mode
        </label>
        <select
          id="view-mode-select"
          value={viewMode}
          onChange={(e) => onViewModeChange(e.target.value as any)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Posts</option>
          <option value="my_posts">My Posts</option>
          <option value="pending_action">Pending My Action</option>
        </select>
      </div>

      {/* Status Filter */}
      <div>
        <label htmlFor="status-filter-select" className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          id="status-filter-select"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as any)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status === 'all' ? 'All Statuses' : getStatusLabel(status)}
            </option>
          ))}
        </select>
      </div>

      {/* Sort */}
      <div>
        <label htmlFor="sort-by-select" className="block text-sm font-medium text-gray-700 mb-2">
          Sort By
        </label>
        <select
          id="sort-by-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as any)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title">Title (A-Z)</option>
          <option value="status">Status</option>
        </select>
      </div>
    </div>
  );
};

export default NewsFilters;
