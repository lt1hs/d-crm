import { Video, VideoFilter, VideoSortBy, VideoSortOrder, VideoStats } from '../types/video';

export const generateVideoId = (): string => {
  return `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const filterVideos = (videos: Video[], filter: VideoFilter): Video[] => {
  return videos.filter(video => {
    if (filter.category && video.category !== filter.category) return false;
    if (filter.type && video.type !== filter.type) return false;
    if (filter.status && video.status !== filter.status) return false;
    if (filter.platform && video.platform !== filter.platform) return false;
    if (filter.isFeatured !== undefined && video.isFeatured !== filter.isFeatured) return false;
    if (filter.isPublic !== undefined && video.isPublic !== filter.isPublic) return false;
    
    if (filter.minDuration && video.duration < filter.minDuration) return false;
    if (filter.maxDuration && video.duration > filter.maxDuration) return false;
    
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      const matchesTitle = video.title.toLowerCase().includes(searchLower);
      const matchesPresenter = video.presenter?.toLowerCase().includes(searchLower);
      const matchesTags = video.tags.some(tag => tag.toLowerCase().includes(searchLower));
      if (!matchesTitle && !matchesPresenter && !matchesTags) return false;
    }
    
    if (filter.dateFrom && video.publishDate < filter.dateFrom) return false;
    if (filter.dateTo && video.publishDate > filter.dateTo) return false;
    
    return true;
  });
};

export const sortVideos = (videos: Video[], sortBy: VideoSortBy, order: VideoSortOrder): Video[] => {
  return [...videos].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'publishDate':
        comparison = a.publishDate.localeCompare(b.publishDate);
        break;
      case 'recordedDate':
        comparison = (a.recordedDate || '').localeCompare(b.recordedDate || '');
        break;
      case 'views':
        comparison = a.views - b.views;
        break;
      case 'likes':
        comparison = a.likes - b.likes;
        break;
      case 'duration':
        comparison = a.duration - b.duration;
        break;
    }
    
    return order === 'asc' ? comparison : -comparison;
  });
};

export const getVideoStats = (videos: Video[]): VideoStats => {
  const stats: VideoStats = {
    total: videos.length,
    published: videos.filter(v => v.status === 'published').length,
    draft: videos.filter(v => v.status === 'draft').length,
    archived: videos.filter(v => v.status === 'archived').length,
    featured: videos.filter(v => v.isFeatured).length,
    public: videos.filter(v => v.isPublic).length,
    totalViews: videos.reduce((sum, v) => sum + v.views, 0),
    totalLikes: videos.reduce((sum, v) => sum + v.likes, 0),
    totalComments: videos.reduce((sum, v) => sum + v.comments, 0),
    totalShares: videos.reduce((sum, v) => sum + v.shares, 0),
    totalDuration: videos.reduce((sum, v) => sum + v.duration, 0),
    byCategory: {},
    byType: {},
  };
  
  videos.forEach(video => {
    if (!stats.byCategory[video.category]) {
      stats.byCategory[video.category] = 0;
    }
    stats.byCategory[video.category]++;
    
    if (!stats.byType[video.type]) {
      stats.byType[video.type] = 0;
    }
    stats.byType[video.type]++;
  });
  
  return stats;
};

export const getStatusColor = (status: Video['status']): string => {
  switch (status) {
    case 'published':
      return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
    case 'draft':
      return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    case 'archived':
      return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
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

export const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const formatTotalDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export const getPlatformIcon = (platform: Video['platform']): string => {
  switch (platform) {
    case 'youtube':
      return '▶️';
    case 'vimeo':
      return '🎬';
    case 'self-hosted':
      return '🖥️';
    default:
      return '📹';
  }
};
