import { CalendarEvent, CalendarEventType } from '../types/calendar';

export const getEventColor = (type: CalendarEventType): string => {
  const colors: Record<CalendarEventType, string> = {
    publication: 'bg-blue-500',
    video: 'bg-red-500',
    course: 'bg-green-500',
    activity: 'bg-purple-500',
    news: 'bg-yellow-500',
    magazine: 'bg-pink-500',
    article: 'bg-indigo-500',
    infographic: 'bg-teal-500',
    testimonial: 'bg-orange-500',
    meeting: 'bg-gray-500',
    deadline: 'bg-red-700',
  };
  return colors[type] || 'bg-gray-500';
};

export const getEventIcon = (type: CalendarEventType): string => {
  const icons: Record<CalendarEventType, string> = {
    publication: '📄',
    video: '🎥',
    course: '🎓',
    activity: '🎯',
    news: '📰',
    magazine: '📖',
    article: '📝',
    infographic: '📊',
    testimonial: '💬',
    meeting: '👥',
    deadline: '⏰',
  };
  return icons[type] || '📌';
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

export const getMonthName = (month: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
};

export const getDayName = (day: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[day];
};

export const getShortDayName = (day: number): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[day];
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

export const formatEventTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export const formatEventDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

export const getEventsForDate = (events: CalendarEvent[], date: Date): CalendarEvent[] => {
  return events.filter(event => isSameDay(new Date(event.date), date));
};

export const getEventsForMonth = (events: CalendarEvent[], year: number, month: number): CalendarEvent[] => {
  return events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getFullYear() === year && eventDate.getMonth() === month;
  });
};

export const getEventsForWeek = (events: CalendarEvent[], startDate: Date): CalendarEvent[] => {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 7);
  
  return events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= startDate && eventDate < endDate;
  });
};

export const sortEventsByDate = (events: CalendarEvent[]): CalendarEvent[] => {
  return [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const getWeekDates = (date: Date): Date[] => {
  const week: Date[] = [];
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    week.push(day);
  }
  
  return week;
};

// Load events from localStorage for all content types
export const loadAllScheduledContent = (): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  
  // Load publications
  const publications = JSON.parse(localStorage.getItem('publications') || '[]');
  publications.forEach((pub: any) => {
    if (pub.publishDate) {
      events.push({
        id: `pub-${pub.id}`,
        title: pub.title,
        type: 'publication',
        date: new Date(pub.publishDate),
        status: pub.status,
        description: pub.description,
        metadata: { author: pub.author, category: pub.category },
      });
    }
  });
  
  // Load videos
  const videos = JSON.parse(localStorage.getItem('videos') || '[]');
  videos.forEach((video: any) => {
    if (video.publishDate) {
      events.push({
        id: `video-${video.id}`,
        title: video.title,
        type: 'video',
        date: new Date(video.publishDate),
        status: video.status,
        description: video.description,
        metadata: { category: video.category },
      });
    }
  });
  
  // Load courses
  const courses = JSON.parse(localStorage.getItem('courses') || '[]');
  courses.forEach((course: any) => {
    if (course.startDate) {
      events.push({
        id: `course-${course.id}`,
        title: course.title,
        type: 'course',
        date: new Date(course.startDate),
        endDate: course.endDate ? new Date(course.endDate) : undefined,
        status: course.status,
        description: course.description,
        metadata: { instructor: course.instructor, level: course.level },
      });
    }
  });
  
  // Load activities
  const activities = JSON.parse(localStorage.getItem('activities') || '[]');
  activities.forEach((activity: any) => {
    if (activity.date) {
      events.push({
        id: `activity-${activity.id}`,
        title: activity.title,
        type: 'activity',
        date: new Date(activity.date),
        status: activity.status,
        description: activity.description,
        metadata: { location: activity.location },
      });
    }
  });
  
  // Load news
  const news = JSON.parse(localStorage.getItem('news') || '[]');
  news.forEach((item: any) => {
    if (item.publishDate) {
      events.push({
        id: `news-${item.id}`,
        title: item.title,
        type: 'news',
        date: new Date(item.publishDate),
        status: item.status,
        description: item.summary,
      });
    }
  });
  
  return sortEventsByDate(events);
};
