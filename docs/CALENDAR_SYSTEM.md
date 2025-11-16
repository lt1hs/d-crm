# Calendar System Documentation

## Overview

The Calendar System provides a comprehensive view of all scheduled content across your platform. It aggregates publications, videos, courses, activities, news, and other content types into a unified calendar interface.

## Features

✅ **Calendar View**
- Monthly calendar grid
- Visual event indicators with color coding
- Multiple events per day
- Today highlighting
- Date selection

✅ **List View**
- Chronological list of all events
- Detailed event information
- Status badges
- Quick filtering

✅ **Event Types**
- Publications (Blue)
- Videos (Red)
- Courses (Green)
- Activities (Purple)
- News (Yellow)
- Magazine (Pink)
- Articles (Indigo)
- Infographics (Teal)
- Testimonials (Orange)

✅ **Filtering**
- Filter by event type
- Filter by status (draft, scheduled, published, completed)
- Search by title or description
- Multi-select filters

✅ **Statistics**
- Total events count
- Today's events
- Upcoming events
- Completed events

## File Structure

```
components/
├── CalendarManagement.tsx          # Main calendar page
└── calendar/
    ├── CalendarView.tsx            # Monthly calendar grid
    ├── EventList.tsx               # Event list for selected date
    ├── CalendarFilters.tsx         # Filter sidebar
    └── CalendarStats.tsx           # Statistics cards

types/
└── calendar.ts                     # TypeScript types

utils/
└── calendarHelpers.ts              # Helper functions
```

## Usage

### Accessing the Calendar

Navigate to the Calendar page from the sidebar menu. The calendar icon is located in the "Main" section.

### Viewing Events

1. **Calendar View**: Click on any date to see events for that day
2. **List View**: Toggle to list view to see all events chronologically
3. **Event Details**: Click on any event to view more information

### Filtering Events

Use the filter sidebar to:
- Select specific event types
- Filter by status
- Search by keywords
- Clear all filters

### Navigation

- **Today Button**: Jump to current date
- **Previous/Next**: Navigate between months
- **Date Selection**: Click any date to view its events

## Data Sources

The calendar automatically loads scheduled content from:

- **Publications**: `localStorage.getItem('publications')`
- **Videos**: `localStorage.getItem('videos')`
- **Courses**: `localStorage.getItem('courses')`
- **Activities**: `localStorage.getItem('activities')`
- **News**: `localStorage.getItem('news')`

## Event Structure

```typescript
interface CalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  date: Date;
  endDate?: Date;
  description?: string;
  status?: 'draft' | 'scheduled' | 'published' | 'completed';
  metadata?: {
    author?: string;
    category?: string;
    location?: string;
    [key: string]: any;
  };
}
```

## Helper Functions

### Load All Content

```typescript
import { loadAllScheduledContent } from '../utils/calendarHelpers';

const events = loadAllScheduledContent();
```

### Get Events for Date

```typescript
import { getEventsForDate } from '../utils/calendarHelpers';

const todayEvents = getEventsForDate(events, new Date());
```

### Format Dates

```typescript
import { formatEventDate, formatEventTime } from '../utils/calendarHelpers';

const dateStr = formatEventDate(new Date()); // "Nov 12, 2025"
const timeStr = formatEventTime(new Date()); // "02:30 PM"
```

### Event Colors

```typescript
import { getEventColor, getEventIcon } from '../utils/calendarHelpers';

const color = getEventColor('publication'); // "bg-blue-500"
const icon = getEventIcon('video'); // "🎥"
```

## Customization

### Adding New Event Types

1. Update `types/calendar.ts`:
```typescript
export type CalendarEventType = 
  | 'publication' 
  | 'your-new-type';
```

2. Update `utils/calendarHelpers.ts`:
```typescript
const colors: Record<CalendarEventType, string> = {
  'your-new-type': 'bg-custom-color',
  // ...
};

const icons: Record<CalendarEventType, string> = {
  'your-new-type': '🎯',
  // ...
};
```

3. Add data loading in `loadAllScheduledContent()`:
```typescript
const yourContent = JSON.parse(localStorage.getItem('your-content') || '[]');
yourContent.forEach((item: any) => {
  if (item.date) {
    events.push({
      id: `your-${item.id}`,
      title: item.title,
      type: 'your-new-type',
      date: new Date(item.date),
      // ...
    });
  }
});
```

### Styling

The calendar uses Tailwind CSS classes. To customize colors:

- Event type colors: Update `getEventColor()` in `calendarHelpers.ts`
- Calendar grid: Modify `CalendarView.tsx`
- Event cards: Modify `EventList.tsx`

## Integration with Other Systems

### Notification Integration

```typescript
import { useNotificationIntegration } from '../hooks/useNotificationIntegration';

const { addNotification } = useNotificationIntegration();

// Notify when event is approaching
addNotification({
  type: 'info',
  category: 'activity_logs',
  title: 'Upcoming Event',
  message: `${event.title} starts in 1 hour`,
});
```

### Activity Logging

```typescript
import { useAuth } from '../context/AuthContext';

const { logActivity } = useAuth();

// Log calendar view
logActivity('view', 'calendar', undefined, 'Viewed calendar page');
```

## Best Practices

1. **Date Handling**: Always use `new Date()` for date comparisons
2. **Performance**: Filter events before rendering large lists
3. **Accessibility**: Use proper ARIA labels for calendar navigation
4. **Responsive**: Calendar adapts to mobile, tablet, and desktop
5. **Dark Mode**: All components support dark mode

## Future Enhancements

Potential improvements:

- Week view
- Day view (hourly schedule)
- Drag-and-drop event rescheduling
- Event creation from calendar
- Export to iCal/Google Calendar
- Recurring events
- Event reminders
- Multi-user calendars
- Calendar sharing
- Print view

## Troubleshooting

### Events Not Showing

1. Check localStorage for content data
2. Verify date fields exist in content items
3. Check filter settings
4. Ensure content has `publishDate` or `date` field

### Performance Issues

1. Limit events loaded (currently 100 max)
2. Use pagination for list view
3. Optimize filter operations
4. Consider virtual scrolling for large lists

### Date Format Issues

1. Ensure dates are stored as ISO strings
2. Use `new Date()` for parsing
3. Check timezone handling
4. Verify date field names match

## API Reference

### CalendarManagement Component

Main calendar page component.

**Props**: None

**State**:
- `events`: Array of calendar events
- `selectedDate`: Currently selected date
- `viewMode`: 'calendar' or 'list'
- `filter`: Active filters

### CalendarView Component

Monthly calendar grid.

**Props**:
- `events`: CalendarEvent[]
- `selectedDate`: Date
- `onDateSelect`: (date: Date) => void
- `onMonthChange`: (year: number, month: number) => void

### EventList Component

List of events for selected date.

**Props**:
- `events`: CalendarEvent[]
- `selectedDate`: Date
- `onEventClick`: (event: CalendarEvent) => void

### CalendarFilters Component

Filter sidebar.

**Props**:
- `filter`: CalendarFilter
- `onFilterChange`: (filter: CalendarFilter) => void

### CalendarStats Component

Statistics cards.

**Props**:
- `events`: CalendarEvent[]

## Support

For issues or questions about the calendar system, refer to:
- This documentation
- Component source code
- Helper function comments
- TypeScript type definitions
