export interface Publication {
  id: string;
  title: string;
  titleAr?: string;
  titleFa?: string;
  slug: string;
  description: string;
  descriptionAr?: string;
  descriptionFa?: string;
  coverImage: string;
  category: string;
  type: 'report' | 'whitepaper' | 'guide' | 'research' | 'policy' | 'manual' | 'brochure' | 'other';
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  isPublic: boolean;
  author: string;
  authorAr?: string;
  department?: string;
  publishDate: string;
  lastUpdated?: string;
  fileUrl?: string;
  fileSize?: number; // in MB
  pageCount?: number;
  language: string;
  tags: string[];
  views: number;
  downloads: number;
  isbn?: string;
  doi?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicationCategory {
  id: string;
  name: string;
  nameAr?: string;
  nameFa?: string;
  icon: string;
  color: string;
}

export interface PublicationStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  featured: number;
  public: number;
  totalViews: number;
  totalDownloads: number;
  byCategory: Record<string, number>;
  byType: Record<string, number>;
}

export type PublicationFilter = {
  category?: string;
  type?: Publication['type'];
  status?: Publication['status'];
  isFeatured?: boolean;
  isPublic?: boolean;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type PublicationSortBy = 'title' | 'publishDate' | 'views' | 'downloads' | 'createdAt';
export type PublicationSortOrder = 'asc' | 'desc';
