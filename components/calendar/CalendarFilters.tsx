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
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-md border border-gray-200/50 dark:border-gray-700/50 p-3 space-y-3">
      {/* Search */}
      <div>
        <div className="relative">
          <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            id="calendar-search"
            type="text"
            value={filter.searchTerm}
            onChange={handleSearchChange}
            placeholder="Search events..."
            className="w-full pl-8 pr-2.5 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Event Types */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">Types</h4>
          <div className="flex gap-1 text-xs">
            <button
              onClick={handleSelectAll}
              className="text-blue-600 hover:text-blue-700 font-medium"
              type="button"
            >
              All
            </button>
            <span className="text-gray-400">|</span>
            <button
              onClick={handleClearAll}
              className="text-gray-500 hover:text-gray-700 font-medium"
              type="button"
            >
              None
            </button>
          </div>
        </div>
        <div className="space-y-1">
          {eventTypes.map(type => (
            <label
              key={type.value}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 p-1 rounded transition-colors group"
            >
              <input
                type="checkbox"
                checked={filter.types.includes(type.value)}
                onChange={() => handleTypeToggle(type.value)}
                className="w-3 h-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-1"
              />
              <div className={`w-2 h-2 rounded ${type.color}`} />
              <span className="text-xs text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">Status</h4>
        <div className="space-y-1">
          {statusOptions.map(status => (
            <label
              key={status.value}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 p-1 rounded transition-colors group"
            >
              <input
                type="checkbox"
                checked={filter.status.includes(status.value)}
                onChange={() => handleStatusToggle(status.value)}
                className="w-3 h-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-1"
              />
              <span className="text-xs text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">{status.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Active Filters Count */}
      {(filter.types.length > 0 || filter.status.length > 0 || filter.searchTerm) && (
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {filter.types.length + filter.status.length + (filter.searchTerm ? 1 : 0)} filters
            </span>
            <button
              onClick={() => onFilterChange({ types: [], status: [], searchTerm: '' })}
              className="text-xs text-red-600 hover:text-red-700 font-medium"
              type="button"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarFilters;
