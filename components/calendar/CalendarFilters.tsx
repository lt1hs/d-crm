import React from 'react';
import { CalendarFilter, CalendarEventType } from '../../types/calendar';
import { IconFilter, IconSearch } from '../Icons';

interface CalendarFiltersProps {
  filter: CalendarFilter;
  onFilterChange: (filter: CalendarFilter) => void;
}

const CalendarFilters: React.FC<CalendarFiltersProps> = ({ filter, onFilterChange }) => {
  const eventTypes: { value: CalendarEventType; label: string; color: string }[] = [
    { value: 'publication', label: 'Publications', color: 'bg-blue-500' },
    { value: 'video', label: 'Videos', color: 'bg-red-500' },
    { value: 'course', label: 'Courses', color: 'bg-green-500' },
    { value: 'activity', label: 'Activities', color: 'bg-purple-500' },
    { value: 'news', label: 'News', color: 'bg-yellow-500' },
    { value: 'magazine', label: 'Magazine', color: 'bg-pink-500' },
    { value: 'article', label: 'Articles', color: 'bg-indigo-500' },
    { value: 'infographic', label: 'Infographics', color: 'bg-teal-500' },
    { value: 'testimonial', label: 'Testimonials', color: 'bg-orange-500' },
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'published', label: 'Published' },
    { value: 'completed', label: 'Completed' },
  ];

  const handleTypeToggle = (type: CalendarEventType) => {
    const newTypes = filter.types.includes(type)
      ? filter.types.filter(t => t !== type)
      : [...filter.types, type];
    onFilterChange({ ...filter, types: newTypes });
  };

  const handleStatusToggle = (status: string) => {
    const newStatus = filter.status.includes(status)
      ? filter.status.filter(s => s !== status)
      : [...filter.status, status];
    onFilterChange({ ...filter, status: newStatus });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filter, searchTerm: e.target.value });
  };

  const handleSelectAll = () => {
    onFilterChange({ ...filter, types: eventTypes.map(t => t.value) });
  };

  const handleClearAll = () => {
    onFilterChange({ ...filter, types: [] });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4">
      {/* Search */}
      <div>
        <label htmlFor="calendar-search" className="block text-sm font-medium mb-2">
          Search Events
        </label>
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="calendar-search"
            type="text"
            value={filter.searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by title..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Event Types */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <IconFilter className="w-4 h-4" />
            Event Types
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleSelectAll}
              className="text-xs text-blue-600 hover:text-blue-700"
              type="button"
            >
              All
            </button>
            <button
              onClick={handleClearAll}
              className="text-xs text-gray-600 hover:text-gray-700"
              type="button"
            >
              None
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {eventTypes.map(type => (
            <label
              key={type.value}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded transition-colors"
            >
              <input
                type="checkbox"
                checked={filter.types.includes(type.value)}
                onChange={() => handleTypeToggle(type.value)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className={`w-3 h-3 rounded ${type.color}`} />
              <span className="text-sm">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <label className="block text-sm font-medium mb-2">Status</label>
        <div className="space-y-2">
          {statusOptions.map(status => (
            <label
              key={status.value}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded transition-colors"
            >
              <input
                type="checkbox"
                checked={filter.status.includes(status.value)}
                onChange={() => handleStatusToggle(status.value)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">{status.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Active Filters Count */}
      {(filter.types.length > 0 || filter.status.length > 0 || filter.searchTerm) && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Active filters: {filter.types.length + filter.status.length + (filter.searchTerm ? 1 : 0)}
          </div>
          <button
            onClick={() => onFilterChange({ types: [], status: [], searchTerm: '' })}
            className="mt-2 text-sm text-red-600 hover:text-red-700"
            type="button"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default CalendarFilters;
