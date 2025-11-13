import { Publication, PublicationFilter, PublicationSortBy, PublicationSortOrder, PublicationStats } from '../types/publication';

export const generatePublicationId = (): string => {
  return `pub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const filterPublications = (publications: Publication[], filter: PublicationFilter): Publication[] => {
  return publications.filter(pub => {
    if (filter.category && pub.category !== filter.category) return false;
    if (filter.type && pub.type !== filter.type) return false;
    if (filter.status && pub.status !== filter.status) return false;
    if (filter.isFeatured !== undefined && pub.isFeatured !== filter.isFeatured) return false;
    if (filter.isPublic !== undefined && pub.isPublic !== filter.isPublic) return false;
    
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      const matchesTitle = pub.title.toLowerCase().includes(searchLower);
      const matchesAuthor = pub.author.toLowerCase().includes(searchLower);
      const matchesTags = pub.tags.some(tag => tag.toLowerCase().includes(searchLower));
      if (!matchesTitle && !matchesAuthor && !matchesTags) return false;
    }
    
    if (filter.dateFrom && pub.publishDate < filter.dateFrom) return false;
    if (filter.dateTo && pub.publishDate > filter.dateTo) return false;
    
    return true;
  });
};

export const sortPublications = (publications: Publication[], sortBy: PublicationSortBy, order: PublicationSortOrder): Publication[] => {
  return [...publications].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'publishDate':
        comparison = a.publishDate.localeCompare(b.publishDate);
        break;
      case 'views':
        comparison = a.views - b.views;
        break;
      case 'downloads':
        comparison = a.downloads - b.downloads;
        break;
      case 'createdAt':
        comparison = a.createdAt.localeCompare(b.createdAt);
        break;
    }
    
    return order === 'asc' ? comparison : -comparison;
  });
};

export const getPublicationStats = (publications: Publication[]): PublicationStats => {
  const stats: PublicationStats = {
    total: publications.length,
    published: publications.filter(p => p.status === 'published').length,
    draft: publications.filter(p => p.status === 'draft').length,
    archived: publications.filter(p => p.status === 'archived').length,
    featured: publications.filter(p => p.isFeatured).length,
    public: publications.filter(p => p.isPublic).length,
    totalViews: publications.reduce((sum, p) => sum + p.views, 0),
    totalDownloads: publications.reduce((sum, p) => sum + p.downloads, 0),
    byCategory: {},
    byType: {},
  };
  
  publications.forEach(pub => {
    if (!stats.byCategory[pub.category]) {
      stats.byCategory[pub.category] = 0;
    }
    stats.byCategory[pub.category]++;
    
    if (!stats.byType[pub.type]) {
      stats.byType[pub.type] = 0;
    }
    stats.byType[pub.type]++;
  });
  
  return stats;
};

export const getStatusColor = (status: Publication['status']): string => {
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
