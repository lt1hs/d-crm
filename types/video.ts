export interface Video {
  id: string;
  title: string;
  titleAr?: string;
  titleFa?: string;
  slug: string;
  description: string;
  descriptionAr?: string;
  descriptionFa?: string;
  thumbnailUrl: string;
  videoUrl: string;
  embedUrl?: string;
  category: string;
  type: 'tutorial' | 'webinar' | 'presentation' | 'interview' | 'documentary' | 'promotional' | 'event' | 'other';
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  isPublic: boolean;
  presenter?: string;
  presenterAr?: string;
  department?: string;
  duration: number; // in seconds
  publishDate: string;
  recordedDate?: string;
  language: string;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  shares: number;
  quality: '720p' | '1080p' | '4k' | 'auto';
  platform: 'youtube' | 'vimeo' | 'self-hosted' | 'other';
  transcript?: string;
  relatedVideos?: string[];
  playlist?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VideoCategory {
  id: string;
  name: string;
  nameAr?: string;
  nameFa?: string;
  icon: string;
  color: string;
}

export interface VideoStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  featured: number;
  public: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalDuration: number;
  byCategory: Record<string, number>;
  byType: Record<string, number>;
}

export type VideoFilter = {
  category?: string;
  type?: Video['type'];
  status?: Video['status'];
  isFeatured?: boolean;
  isPublic?: boolean;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  platform?: Video['platform'];
  minDuration?: number;
  maxDuration?: number;
};

export type VideoSortBy = 'title' | 'publishDate' | 'recordedDate' | 'views' | 'likes' | 'duration';
export type VideoSortOrder = 'asc' | 'desc';
