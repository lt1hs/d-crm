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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <IconCalendar className="w-5 h-5 text-blue-600" />
            Content Calendar
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            Manage scheduled content
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-0.5 rounded-md">
          <button
            onClick={() => setViewMode('calendar')}
            className={`
              px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1
              ${viewMode === 'calendar' 
                ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }
            `}
            type="button"
          >
            <IconGrid className="w-3 h-3" />
            Calendar
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`
              px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1
              ${viewMode === 'list' 
                ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }
            `}
            type="button"
          >
            <IconList className="w-3 h-3" />
            List
          </button>
        </div>
      </div>

      {/* Stats */}
      <CalendarStats events={filteredEvents} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <CalendarFilters filter={filter} onFilterChange={setFilter} />
        </div>

        {/* Calendar/List View */}
        <div className="lg:col-span-4 space-y-5">
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
            <div className="space-y-3">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-md border border-gray-200/50 dark:border-gray-700/50 p-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">All Events</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                    {filteredEvents.length} events
                  </span>
                </div>
              </div>
              {filteredEvents.length > 0 ? (
                <div className="space-y-2">
                  {filteredEvents.map(event => (
                    <div
                      key={event.id}
                      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-md border border-gray-200/50 dark:border-gray-700/50 p-3 hover:bg-white dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-center min-w-[40px]">
                          <div className="text-base font-medium text-gray-900 dark:text-gray-100">
                            {new Date(event.date).getDate()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                              {event.title}
                            </h4>
                            {event.status && (
                              <span className={`
                                px-1.5 py-0.5 text-xs rounded font-medium shrink-0
                                ${event.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                                ${event.status === 'scheduled' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                                ${event.status === 'draft' ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' : ''}
                                ${event.status === 'completed' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : ''}
                              `}>
                                {event.status}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="capitalize bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">{event.type}</span>
                            {event.metadata?.author && <span>• {event.metadata.author}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-md border border-gray-200/50 dark:border-gray-700/50 p-8 text-center">
                  <IconCalendar className="w-8 h-8 mx-auto mb-2 text-gray-400 opacity-50" />
                  <p className="text-gray-500 text-sm">No events found</p>
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
