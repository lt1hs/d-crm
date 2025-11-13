import React from 'react';
import { CalendarEvent } from '../../types/calendar';
import { getEventColor, getEventIcon, formatEventTime, formatEventDate } from '../../utils/calendarHelpers';
import { IconClock, IconMapPin, IconUser } from '../Icons';

interface EventListProps {
  events: CalendarEvent[];
  selectedDate: Date;
  onEventClick?: (event: CalendarEvent) => void;
}

const EventList: React.FC<EventListProps> = ({ events, selectedDate, onEventClick }) => {
  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      published: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      completed: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    };
    
    return (
      <span className={`px-2 py-0.5 text-xs rounded-full ${colors[status] || colors.draft}`}>
        {status}
      </span>
    );
  };

  if (events.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
        <div className="text-gray-400 dark:text-gray-500 mb-2">
          <IconClock className="w-12 h-12 mx-auto opacity-50" />
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          No events scheduled for {formatEventDate(selectedDate)}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold">
          Events for {formatEventDate(selectedDate)}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {events.length} {events.length === 1 ? 'event' : 'events'} scheduled
        </p>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {events.map(event => (
          <div
            key={event.id}
            onClick={() => onEventClick?.(event)}
            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-3">
              {/* Event type indicator */}
              <div className={`w-1 h-full ${getEventColor(event.type)} rounded-full flex-shrink-0`} />
              
              <div className="flex-1 min-w-0">
                {/* Event header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getEventIcon(event.type)}</span>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {event.title}
                    </h4>
                  </div>
                  {getStatusBadge(event.status)}
                </div>

                {/* Event description */}
                {event.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {event.description}
                  </p>
                )}

                {/* Event metadata */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <IconClock className="w-3 h-3" />
                    <span>{formatEventTime(new Date(event.date))}</span>
                  </div>
                  
                  {event.metadata?.author && (
                    <div className="flex items-center gap-1">
                      <IconUser className="w-3 h-3" />
                      <span>{event.metadata.author}</span>
                    </div>
                  )}
                  
                  {event.metadata?.location && (
                    <div className="flex items-center gap-1">
                      <IconMapPin className="w-3 h-3" />
                      <span>{event.metadata.location}</span>
                    </div>
                  )}
                  
                  {event.metadata?.category && (
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                      {event.metadata.category}
                    </span>
                  )}
                </div>

                {/* Event type badge */}
                <div className="mt-2">
                  <span className={`
                    inline-flex items-center gap-1 px-2 py-1 text-xs rounded
                    ${getEventColor(event.type)} text-white
                  `}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
