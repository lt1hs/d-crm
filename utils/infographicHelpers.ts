import { Infographic, InfographicFilter, InfographicSortBy, InfographicSortOrder, InfographicStats } from '../types/infographic';

export const generateInfographicId = (): string => {
  return `infographic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const filterInfographics = (infographics: Infographic[], filter: InfographicFilter): Infographic[] => {
  return infographics.filter(infographic => {
    if (filter.category && infographic.category !== filter.category) return false;
    if (filter.type && infographic.type !== filter.type) return false;
    if (filter.status && infographic.status !== filter.status) return false;
    if (filter.format && infographic.format !== filter.format) return false;
    if (filter.isFeatured !== undefined && infographic.isFeatured !== filter.isFeatured) return false;
    if (filter.isPublic !== undefined && infographic.isPublic !== filter.isPublic) return false;
    
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      const matchesTitle = infographic.title.toLowerCase().includes(searchLower);
      const matchesDesigner = infographic.designer.toLowerCase().includes(searchLower);
      const matchesTags = infographic.tags.some(tag => tag.toLowerCase().includes(searchLower));
      if (!matchesTitle && !matchesDesigner && !matchesTags) return false;
    }
    
    if (filter.dateFrom && infographic.createdDate < filter.dateFrom) return false;
    if (filter.dateTo && infographic.createdDate > filter.dateTo) return false;
    
    return true;
  });
};

export const sortInfographics = (infographics: Infographic[], sortBy: InfographicSortBy, order: InfographicSortOrder): Infographic[] => {
  return [...infographics].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'createdDate':
        comparison = a.createdDate.localeCompare(b.createdDate);
        break;
      case 'publishedDate':
        comparison = (a.publishedDate || '').localeCompare(b.publishedDate || '');
        break;
      case 'views':
        comparison = a.views - b.views;
        break;
      case 'downloads':
        comparison = a.downloads - b.downloads;
        break;
      case 'likes':
        comparison = a.likes - b.likes;
        break;
    }
    
    return order === 'asc' ? comparison : -comparison;
  });
};

export const getInfographicStats = (infographics: Infographic[]): InfographicStats => {
  const stats: InfographicStats = {
    total: infographics.length,
    published: infographics.filter(i => i.status === 'published').length,
    draft: infographics.filter(i => i.status === 'draft').length,
    archived: infographics.filter(i => i.status === 'archived').length,
    featured: infographics.filter(i => i.isFeatured).length,
    public: infographics.filter(i => i.isPublic).length,
    totalViews: infographics.reduce((sum, i) => sum + i.views, 0),
    totalDownloads: infographics.reduce((sum, i) => sum + i.downloads, 0),
    totalLikes: infographics.reduce((sum, i) => sum + i.likes, 0),
    totalShares: infographics.reduce((sum, i) => sum + i.shares, 0),
    byCategory: {},
    byType: {},
  };
  
  infographics.forEach(infographic => {
    if (!stats.byCategory[infographic.category]) {
      stats.byCategory[infographic.category] = 0;
    }
    stats.byCategory[infographic.category]++;
    
    if (!stats.byType[infographic.type]) {
      stats.byType[infographic.type] = 0;
    }
    stats.byType[infographic.type]++;
  });
  
  return stats;
};

export const getStatusColor = (status: Infographic['status']): string => {
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

export const formatFileSize = (sizeInMB: number): string => {
  if (sizeInMB >= 1000) return (sizeInMB / 1000).toFixed(1) + ' GB';
  return sizeInMB.toFixed(1) + ' MB';
};

export const getDimensionsText = (dimensions?: { width: number; height: number }): string => {
  if (!dimensions) return 'Unknown';
  return `${dimensions.width} × ${dimensions.height}px`;
};
