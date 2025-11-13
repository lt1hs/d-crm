export interface Testimonial {
  id: string;
  name: string;
  nameAr?: string;
  nameFa?: string;
  slug: string;
  position: string;
  positionAr?: string;
  positionFa?: string;
  company?: string;
  companyAr?: string;
  companyFa?: string;
  testimonial: string;
  testimonialAr?: string;
  testimonialFa?: string;
  avatarUrl?: string;
  category: string;
  type: 'text' | 'video' | 'audio';
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  isPublic: boolean;
  rating: 1 | 2 | 3 | 4 | 5;
  date: string;
  location?: string;
  email?: string;
  phone?: string;
  website?: string;
  linkedIn?: string;
  videoUrl?: string;
  audioUrl?: string;
  tags: string[];
  relatedProduct?: string;
  relatedService?: string;
  verified: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialCategory {
  id: string;
  name: string;
  nameAr?: string;
  nameFa?: string;
  icon: string;
  color: string;
}

export interface TestimonialStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  featured: number;
  verified: number;
  averageRating: number;
  totalHelpful: number;
  byCategory: Record<string, number>;
  byType: Record<string, number>;
  byRating: Record<number, number>;
}

export type TestimonialFilter = {
  category?: string;
  type?: Testimonial['type'];
  status?: Testimonial['status'];
  isFeatured?: boolean;
  isPublic?: boolean;
  verified?: boolean;
  rating?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type TestimonialSortBy = 'name' | 'date' | 'rating' | 'helpfulCount';
export type TestimonialSortOrder = 'asc' | 'desc';
