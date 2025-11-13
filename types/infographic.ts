export interface Infographic {
  id: string;
  title: string;
  titleAr?: string;
  titleFa?: string;
  slug: string;
  description: string;
  descriptionAr?: string;
  descriptionFa?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: string;
  type: 'statistical' | 'process' | 'comparison' | 'timeline' | 'geographic' | 'hierarchical' | 'educational' | 'marketing';
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  isPublic: boolean;
  designer: string;
  designerAr?: string;
  department?: string;
  createdDate: string;
  publishedDate?: string;
  lastUpdated?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  fileSize?: number; // in MB
  format: 'png' | 'jpg' | 'svg' | 'pdf';
  language: string;
  tags: string[];
  views: number;
  downloads: number;
  likes: number;
  shares: number;
  sourceData?: string;
  relatedContent?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface InfographicCategory {
  id: string;
  name: string;
  nameAr?: string;
  nameFa?: string;
  icon: string;
  color: string;
}

export interface InfographicStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  featured: number;
  public: number;
  totalViews: number;
  totalDownloads: number;
  totalLikes: number;
  totalShares: number;
  byCategory: Record<string, number>;
  byType: Record<string, number>;
}

export type InfographicFilter = {
  category?: string;
  type?: Infographic['type'];
  status?: Infographic['status'];
  isFeatured?: boolean;
  isPublic?: boolean;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  format?: Infographic['format'];
};

export type InfographicSortBy = 'title' | 'createdDate' | 'publishedDate' | 'views' | 'downloads' | 'likes';
export type InfographicSortOrder = 'asc' | 'desc';
