import { Article, ArticleFilter, ArticleSortBy, ArticleSortOrder, ArticleStats } from '../types/article';

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

export const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export const filterArticles = (articles: Article[], filter: ArticleFilter): Article[] => {
  return articles.filter(article => {
    if (filter.category && article.category !== filter.category) return false;
    if (filter.status && article.status !== filter.status) return false;
    if (filter.isFeatured !== undefined && article.isFeatured !== filter.isFeatured) return false;
    if (filter.isPinned !== undefined && article.isPinned !== filter.isPinned) return false;
    
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      const matchesTitle = article.title.toLowerCase().includes(searchLower);
      const matchesExcerpt = article.excerpt.toLowerCase().includes(searchLower);
      const matchesAuthor = article.author.toLowerCase().includes(searchLower);
      const matchesTags = article.tags.some(tag => tag.toLowerCase().includes(searchLower));
      if (!matchesTitle && !matchesExcerpt && !matchesAuthor && !matchesTags) return false;
    }
    
    if (filter.dateFrom && article.publishedDate && article.publishedDate < filter.dateFrom) return false;
    if (filter.dateTo && article.publishedDate && article.publishedDate > filter.dateTo) return false;
    
    return true;
  });
};

export const sortArticles = (articles: Article[], sortBy: ArticleSortBy, order: ArticleSortOrder): Article[] => {
  return [...articles].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'publishedDate':
        comparison = (a.publishedDate || '').localeCompare(b.publishedDate || '');
        break;
      case 'createdAt':
        comparison = a.createdAt.localeCompare(b.createdAt);
        break;
      case 'views':
        comparison = a.views - b.views;
        break;
      case 'likes':
        comparison = a.likes - b.likes;
        break;
    }
    
    return order === 'asc' ? comparison : -comparison;
  });
};

export const getArticleStats = (articles: Article[]): ArticleStats => {
  const stats: ArticleStats = {
    total: articles.length,
    published: articles.filter(a => a.status === 'published').length,
    draft: articles.filter(a => a.status === 'draft').length,
    scheduled: articles.filter(a => a.status === 'scheduled').length,
    archived: articles.filter(a => a.status === 'archived').length,
    featured: articles.filter(a => a.isFeatured).length,
    pinned: articles.filter(a => a.isPinned).length,
    totalViews: articles.reduce((sum, a) => sum + a.views, 0),
    totalLikes: articles.reduce((sum, a) => sum + a.likes, 0),
    byCategory: {},
  };
  
  articles.forEach(article => {
    if (!stats.byCategory[article.category]) {
      stats.byCategory[article.category] = 0;
    }
    stats.byCategory[article.category]++;
  });
  
  return stats;
};

export const getStatusColor = (status: Article['status']): string => {
  switch (status) {
    case 'published':
      return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
    case 'draft':
      return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    case 'scheduled':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
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
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};
