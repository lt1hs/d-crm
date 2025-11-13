export interface ActivityMedia {
  id: string;
  type: 'image' | 'video' | 'article' | 'document';
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  order: number;
}

export interface Activity {
  id: string;
  title: string;
  titleAr?: string;
  titleFa?: string;
  slug: string;
  description: string;
  descriptionAr?: string;
  descriptionFa?: string;
  content: string;
  contentAr?: string;
  contentFa?: string;
  type: 'meeting' | 'event' | 'workshop' | 'conference' | 'training' | 'celebration' | 'announcement' | 'other';
  category: string;
  coverImage: string;
  media: ActivityMedia[];
  location?: string;
  locationAr?: string;
  locationFa?: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  organizer: string;
  organizerAr?: string;
  organizerFa?: string;
  participants?: string[];
  maxParticipants?: number;
  tags: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  isPublic: boolean;
  isFeatured: boolean;
  registrationRequired: boolean;
  registrationUrl?: string;
  views: number;
  likes: number;
  attendees: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityCategory {
  id: string;
  name: string;
  nameAr?: string;
  nameFa?: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface ActivityStats {
  total: number;
  upcoming: number;
  ongoing: number;
  completed: number;
  featured: number;
  totalAttendees: number;
  byType: Record<string, number>;
  byCategory: Record<string, number>;
}

export type ActivityFormData = Omit<Activity, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'attendees'>;

export type ActivityFilter = {
  type?: Activity['type'];
  category?: string;
  status?: Activity['status'];
  isFeatured?: boolean;
  isPublic?: boolean;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type ActivitySortBy = 'title' | 'startDate' | 'createdAt' | 'views' | 'attendees';
export type ActivitySortOrder = 'asc' | 'desc';
