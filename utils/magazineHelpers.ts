import { MagazineIssue, MagazineFilter, MagazineSortBy, MagazineSortOrder, MagazineStats, MagazineArticle } from '../types/magazine';

export const generateMagazineId = (): string => {
  return `magazine-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateArticleId = (): string => {
  return `article-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const filterMagazines = (magazines: MagazineIssue[], filter: MagazineFilter): MagazineIssue[] => {
  return magazines.filter(magazine => {
    if (filter.category && magazine.category !== filter.category) return false;
    if (filter.status && magazine.status !== filter.status) return false;
    if (filter.isFeatured !== undefined && magazine.isFeatured !== filter.isFeatured) return false;
    if (filter.isPublic !== undefined && magazine.isPublic !== filter.isPublic) return false;
    
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      const matchesTitle = magazine.title.toLowerCase().includes(searchLower);
      const matchesDescription = magazine.description.toLowerCase().includes(searchLower);
      const matchesEditor = magazine.editor.toLowerCase().includes(searchLower);
      const matchesTags = magazine.tags.some(tag => tag.toLowerCase().includes(searchLower));
      if (!matchesTitle && !matchesDescription && !matchesEditor && !matchesTags) return false;
    }
    
    if (filter.dateFrom && magazine.publishDate < filter.dateFrom) return false;
    if (filter.dateTo && magazine.publishDate > filter.dateTo) return false;
    
    return true;
  });
};

export const sortMagazines = (magazines: MagazineIssue[], sortBy: MagazineSortBy, order: MagazineSortOrder): MagazineIssue[] => {
  return [...magazines].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'issueNumber':
        comparison = a.issueNumber - b.issueNumber;
        break;
      case 'publishDate':
        comparison = a.publishDate.localeCompare(b.publishDate);
        break;
      case 'createdAt':
        comparison = a.createdAt.localeCompare(b.createdAt);
        break;
      case 'views':
        comparison = a.views - b.views;
        break;
      case 'downloads':
        comparison = a.downloads - b.downloads;
        break;
    }
    
    return order === 'asc' ? comparison : -comparison;
  });
};

export const getMagazineStats = (magazines: MagazineIssue[]): MagazineStats => {
  const stats: MagazineStats = {
    total: magazines.length,
    published: magazines.filter(m => m.status === 'published').length,
    draft: magazines.filter(m => m.status === 'draft').length,
    archived: magazines.filter(m => m.status === 'archived').length,
    featured: magazines.filter(m => m.isFeatured).length,
    totalViews: magazines.reduce((sum, m) => sum + m.views, 0),
    totalDownloads: magazines.reduce((sum, m) => sum + m.downloads, 0),
    byCategory: {},
  };
  
  magazines.forEach(magazine => {
    if (!stats.byCategory[magazine.category]) {
      stats.byCategory[magazine.category] = 0;
    }
    stats.byCategory[magazine.category]++;
  });
  
  return stats;
};

export const getStatusColor = (status: MagazineIssue['status']): string => {
  switch (status) {
    case 'published':
      return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
    case 'draft':
      return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    case 'archived':
      return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
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

export const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

export const sortArticles = (articles: MagazineArticle[]): MagazineArticle[] => {
  return [...articles].sort((a, b) => a.pageNumber - b.pageNumber);
};
