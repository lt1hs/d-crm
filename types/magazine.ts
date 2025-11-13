export interface MagazineArticle {
  id: string;
  title: string;
  titleAr?: string;
  titleFa?: string;
  author: string;
  authorAr?: string;
  authorFa?: string;
  content: string;
  contentAr?: string;
  contentFa?: string;
  excerpt: string;
  excerptAr?: string;
  excerptFa?: string;
  coverImage: string;
  pageNumber: number;
  category: string;
  tags: string[];
}

export interface MagazineIssue {
  id: string;
  title: string;
  titleAr?: string;
  titleFa?: string;
  issueNumber: number;
  volume?: number;
  description: string;
  descriptionAr?: string;
  descriptionFa?: string;
  coverImage: string;
  publishDate: string;
  category: string;
  articles: MagazineArticle[];
  totalPages: number;
  pdfUrl?: string;
  downloadUrl?: string;
  previewUrl?: string;
  tags: string[];
  editor: string;
  editorAr?: string;
  editorFa?: string;
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  isPublic: boolean;
  price?: number;
  currency?: string;
  views: number;
  downloads: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface MagazineCategory {
  id: string;
  name: string;
  nameAr?: string;
  nameFa?: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface MagazineStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  featured: number;
  totalViews: number;
  totalDownloads: number;
  byCategory: Record<string, number>;
}

export type MagazineFormData = Omit<MagazineIssue, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'downloads' | 'likes'>;

export type MagazineFilter = {
  category?: string;
  status?: MagazineIssue['status'];
  isFeatured?: boolean;
  isPublic?: boolean;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type MagazineSortBy = 'title' | 'issueNumber' | 'publishDate' | 'createdAt' | 'views' | 'downloads';
export type MagazineSortOrder = 'asc' | 'desc';
