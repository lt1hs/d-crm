import { Activity, ActivityFilter, ActivitySortBy, ActivitySortOrder, ActivityStats, ActivityMedia } from '../types/activity';

export const generateActivityId = (): string => {
  return `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateMediaId = (): string => {
  return `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const filterActivities = (activities: Activity[], filter: ActivityFilter): Activity[] => {
  return activities.filter(activity => {
    if (filter.type && activity.type !== filter.type) return false;
    if (filter.category && activity.category !== filter.category) return false;
    if (filter.status && activity.status !== filter.status) return false;
    if (filter.isFeatured !== undefined && activity.isFeatured !== filter.isFeatured) return false;
    if (filter.isPublic !== undefined && activity.isPublic !== filter.isPublic) return false;
    
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      const matchesTitle = activity.title.toLowerCase().includes(searchLower);
      const matchesDescription = activity.description.toLowerCase().includes(searchLower);
      const matchesLocation = activity.location?.toLowerCase().includes(searchLower);
      const matchesOrganizer = activity.organizer.toLowerCase().includes(searchLower);
      const matchesTags = activity.tags.some(tag => tag.toLowerCase().includes(searchLower));
      if (!matchesTitle && !matchesDescription && !matchesLocation && !matchesOrganizer && !matchesTags) return false;
    }
    
    if (filter.dateFrom && activity.startDate < filter.dateFrom) return false;
    if (filter.dateTo && activity.startDate > filter.dateTo) return false;
    
    return true;
  });
};

export const sortActivities = (activities: Activity[], sortBy: ActivitySortBy, order: ActivitySortOrder): Activity[] => {
  return [...activities].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'startDate':
        comparison = a.startDate.localeCompare(b.startDate);
        break;
      case 'createdAt':
        comparison = a.createdAt.localeCompare(b.createdAt);
        break;
      case 'views':
        comparison = a.views - b.views;
        break;
      case 'attendees':
        comparison = a.attendees - b.attendees;
        break;
    }
    
    return order === 'asc' ? comparison : -comparison;
  });
};

export const getActivityStats = (activities: Activity[]): ActivityStats => {
  const stats: ActivityStats = {
    total: activities.length,
    upcoming: activities.filter(a => a.status === 'upcoming').length,
    ongoing: activities.filter(a => a.status === 'ongoing').length,
    completed: activities.filter(a => a.status === 'completed').length,
    featured: activities.filter(a => a.isFeatured).length,
    totalAttendees: activities.reduce((sum, a) => sum + a.attendees, 0),
    byType: {},
    byCategory: {},
  };
  
  activities.forEach(activity => {
    if (!stats.byType[activity.type]) {
      stats.byType[activity.type] = 0;
    }
    stats.byType[activity.type]++;
    
    if (!stats.byCategory[activity.category]) {
      stats.byCategory[activity.category] = 0;
    }
    stats.byCategory[activity.category]++;
  });
  
  return stats;
};

export const getStatusColor = (status: Activity['status']): string => {
  switch (status) {
    case 'upcoming':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
    case 'ongoing':
      return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
    case 'completed':
      return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    case 'cancelled':
      return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
  }
};

export const getTypeIcon = (type: Activity['type']): string => {
  switch (type) {
    case 'meeting':
      return '👥';
    case 'event':
      return '🎉';
    case 'workshop':
      return '🛠️';
    case 'conference':
      return '🎤';
    case 'training':
      return '📚';
    case 'celebration':
      return '🎊';
    case 'announcement':
      return '📢';
    case 'other':
      return '📌';
    default:
      return '📅';
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatDateTime = (dateString: string, timeString?: string): string => {
  const date = new Date(dateString);
  const dateFormatted = formatDate(dateString);
  return timeString ? `${dateFormatted} at ${timeString}` : dateFormatted;
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const isUpcoming = (startDate: string): boolean => {
  return new Date(startDate) > new Date();
};

export const isOngoing = (startDate: string, endDate?: string): boolean => {
  const now = new Date();
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : start;
  return now >= start && now <= end;
};

export const sortMedia = (media: ActivityMedia[]): ActivityMedia[] => {
  return [...media].sort((a, b) => a.order - b.order);
};
