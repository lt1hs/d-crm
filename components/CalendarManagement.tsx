import React, { useState, useEffect } from 'react';
import { CalendarEvent, CalendarFilter } from '../types/calendar';
import { loadAllScheduledContent, getEventsForDate, sortEventsByDate } from '../utils/calendarHelpers';
import CalendarView from './calendar/CalendarView';
import EventList from './calendar/EventList';
import CalendarFilters from './calendar/CalendarFilters';
import CalendarStats from './calendar/CalendarStats';
import { IconCalendar, IconList, IconGrid } from './Icons';

type ViewMode = 'calendar' | 'list';

const CalendarManagement: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [filter, setFilter] = useState<CalendarFilter>({
    types: [],
    status: [],
    searchTerm: '',
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    const allEvents = loadAllScheduledContent();
    setEvents(allEvents);
  };

  const getFilteredEvents = (): CalendarEvent[] => {
    let filtered = events;

    // Filter by types
    if (filter.types.length > 0) {
      filtered = filtered.filter(event => filter.types.includes(event.type));
    }

    // Filter by status
    if (filter.status.length > 0) {
      filtered = filtered.filter(event => 
        event.status && filter.status.includes(event.status)
      );
    }

    // Filter by search term
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchLower) ||
        event.description?.toLowerCase().includes(searchLower)
      );
    }

    return sortEventsByDate(filtered);
  };

  const filteredEvents = getFilteredEvents();
  const selectedDateEvents = getEventsForDate(filteredEvents, selectedDate);

  const handleEventClick = (event: CalendarEvent) => {
    // You can implement navigation to the specific content item here
    console.log('Event clicked:', event);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <IconCalendar className="w-8 h-8 text-blue-600" />
            Content Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and manage all scheduled content in one place
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('calendar')}
            className={`
              px-4 py-2 rounded-md transition-colors flex items-center gap-2
              ${viewMode === 'calendar' 
                ? 'bg-white dark:bg-gray-800 shadow text-blue-600' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }
            `}
            type="button"
          >
            <IconGrid className="w-4 h-4" />
            Calendar
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`
              px-4 py-2 rounded-md transition-colors flex items-center gap-2
              ${viewMode === 'list' 
                ? 'bg-white dark:bg-gray-800 shadow text-blue-600' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }
            `}
            type="button"
          >
            <IconList className="w-4 h-4" />
            List
          </button>
        </div>
      </div>

      {/* Stats */}
      <CalendarStats events={filteredEvents} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <CalendarFilters filter={filter} onFilterChange={setFilter} />
        </div>

        {/* Calendar/List View */}
        <div className="lg:col-span-3 space-y-6">
          {viewMode === 'calendar' ? (
            <>
              <CalendarView
                events={filteredEvents}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                onMonthChange={(year, month) => {
                  setSelectedDate(new Date(year, month, 1));
                }}
              />
              <EventList
                events={selectedDateEvents}
                selectedDate={selectedDate}
                onEventClick={handleEventClick}
              />
            </>
          ) : (
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-2">All Events</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
                </p>
              </div>
              {filteredEvents.length > 0 ? (
                <div className="space-y-4">
                  {filteredEvents.map(event => (
                    <div
                      key={event.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-center min-w-[60px]">
                          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {new Date(event.date).getDate()}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              {event.title}
                            </h4>
                            {event.status && (
                              <span className={`
                                px-2 py-1 text-xs rounded-full
                                ${event.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : ''}
                                ${event.status === 'scheduled' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : ''}
                                ${event.status === 'draft' ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' : ''}
                                ${event.status === 'completed' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' : ''}
                              `}>
                                {event.status}
                              </span>
                            )}
                          </div>
                          {event.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {event.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span className="capitalize">{event.type}</span>
                            {event.metadata?.author && <span>By {event.metadata.author}</span>}
                            {event.metadata?.category && <span>{event.metadata.category}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                  <IconCalendar className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500 opacity-50" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No events found matching your filters
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarManagement;
