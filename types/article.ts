export interface Article {
  id: string;
  title: string;
  titleAr?: string;
  titleFa?: string;
  slug: string;
  excerpt: string;
  excerptAr?: string;
  excerptFa?: string;
  content: string;
  contentAr?: string;
  contentFa?: string;
  featuredImage: string;
  category: string;
  tags: string[];
  author: string;
  authorAr?: string;
  authorFa?: string;
  authorBio?: string;
  authorAvatar?: string;
  publishedDate?: string;
  lastModified?: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  isFeatured: boolean;
  isPinned: boolean;
  allowComments: boolean;
  views: number;
  likes: number;
  shares: number;
  commentsCount: number;
  readTime?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  relatedArticles?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ArticleCategory {
  id: string;
  name: string;
  nameAr?: string;
  nameFa?: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface ArticleStats {
  total: number;
  published: number;
  draft: number;
  scheduled: number;
  archived: number;
  featured: number;
  pinned: number;
  totalViews: number;
  totalLikes: number;
  byCategory: Record<string, number>;
}

export type ArticleFormData = Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'shares' | 'commentsCount'>;

export type ArticleFilter = {
  category?: string;
  status?: Article['status'];
  isFeatured?: boolean;
  isPinned?: boolean;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type ArticleSortBy = 'title' | 'publishedDate' | 'createdAt' | 'views' | 'likes';
export type ArticleSortOrder = 'asc' | 'desc';
