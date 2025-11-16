import React from 'react';
import { CalendarEvent } from '../../types/calendar';
import { IconCalendar, IconClock, IconCheck, IconAlertCircle } from '../Icons';

interface CalendarStatsProps {
  events: CalendarEvent[];
}

const CalendarStats: React.FC<CalendarStatsProps> = ({ events }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events.filter(e => new Date(e.date) >= today).length;
  const todayEvents = events.filter(e => {
    const eventDate = new Date(e.date);
    return eventDate.toDateString() === today.toDateString();
  }).length;
  const completedEvents = events.filter(e => e.status === 'completed').length;
  const scheduledEvents = events.filter(e => e.status === 'scheduled').length;

  const stats = [
    {
      label: 'Total Events',
      value: events.length,
      icon: IconCalendar,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Today',
      value: todayEvents,
      icon: IconClock,
      color: 'text-green-600 bg-green-50 dark:bg-green-900/20',
    },
    {
      label: 'Upcoming',
      value: upcomingEvents,
      icon: IconAlertCircle,
      color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
    },
    {
      label: 'Completed',
      value: completedEvents,
      icon: IconCheck,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-md border border-gray-200/50 dark:border-gray-700/50 p-3 hover:bg-white dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                {stat.label}
              </p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
            <div className={`p-1.5 rounded ${stat.color}`}>
              <stat.icon className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CalendarStats;
      icon: IconClock,
      color: 'text-green-600 bg-green-100 dark:bg-green-900/20',
    },
    {
      label: 'Upcoming',
      value: upcomingEvents,
      icon: IconAlertCircle,
      color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20',
    },
    {
      label: 'Completed',
      value: completedEvents,
      icon: IconCheck,
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CalendarStats;
