import React, { useState } from 'react';
import { CalendarEvent } from '../../types/calendar';
import { 
  getDaysInMonth, 
  getFirstDayOfMonth, 
  getMonthName,
  getShortDayName,
  isToday,
  isSameDay,
  getEventsForDate,
  getEventColor,
} from '../../utils/calendarHelpers';
import { IconChevronLeft, IconChevronRight } from '../Icons';

interface CalendarViewProps {
  events: CalendarEvent[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (year: number, month: number) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  selectedDate,
  onDateSelect,
  onMonthChange,
}) => {
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
      onMonthChange(currentYear - 1, 11);
    } else {
      setCurrentMonth(currentMonth - 1);
      onMonthChange(currentYear, currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
      onMonthChange(currentYear + 1, 0);
    } else {
      setCurrentMonth(currentMonth + 1);
      onMonthChange(currentYear, currentMonth + 1);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    onDateSelect(today);
    onMonthChange(today.getFullYear(), today.getMonth());
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square p-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50" />
      );
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dayEvents = getEventsForDate(events, date);
      const isSelected = isSameDay(date, selectedDate);
      const isTodayDate = isToday(date);
      
      days.push(
        <div
          key={day}
          onClick={() => onDateSelect(date)}
          className={`
            aspect-square p-2 border border-gray-200 dark:border-gray-700 cursor-pointer
            hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors
            ${isSelected ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500' : 'bg-white dark:bg-gray-800'}
            ${isTodayDate ? 'font-bold' : ''}
          `}
        >
          <div className="flex flex-col h-full">
            <div className={`
              text-sm mb-1
              ${isTodayDate ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}
            `}>
              {day}
            </div>
            <div className="flex-1 overflow-hidden">
              {dayEvents.slice(0, 3).map((event, idx) => (
                <div
                  key={event.id}
                  className={`
                    text-xs px-1 py-0.5 mb-0.5 rounded truncate
                    ${getEventColor(event.type)} text-white
                  `}
                  title={event.title}
                >
                  {event.title}
                </div>
              ))}
              {dayEvents.length > 3 && (
                <div className="text-xs text-gray-500 dark:text-gray-400 px-1">
                  +{dayEvents.length - 3} more
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {getMonthName(currentMonth)} {currentYear}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToday}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              type="button"
            >
              Today
            </button>
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              type="button"
              aria-label="Previous month"
            >
              <IconChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              type="button"
              aria-label="Next month"
            >
              <IconChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-0 mb-2">
          {[0, 1, 2, 3, 4, 5, 6].map(day => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2"
            >
              {getShortDayName(day)}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-0">
          {renderCalendarDays()}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
