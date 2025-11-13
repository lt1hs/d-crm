export type CalendarEventType = 
  | 'publication' 
  | 'video' 
  | 'course' 
  | 'activity' 
  | 'news' 
  | 'magazine'
  | 'article'
  | 'infographic'
  | 'testimonial'
  | 'meeting'
  | 'deadline';

export interface CalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  date: Date;
  endDate?: Date;
  description?: string;
  status?: 'draft' | 'scheduled' | 'published' | 'completed';
  color?: string;
  metadata?: {
    author?: string;
    category?: string;
    location?: string;
    url?: string;
    [key: string]: any;
  };
}

export type CalendarView = 'month' | 'week' | 'day' | 'agenda';

export interface CalendarFilter {
  types: CalendarEventType[];
  status: string[];
  searchTerm: string;
}
