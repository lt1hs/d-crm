export interface Book {
  id: string;
  title: string;
  titleAr?: string;
  titleFa?: string;
  author: string;
  authorAr?: string;
  authorFa?: string;
  description: string;
  descriptionAr?: string;
  descriptionFa?: string;
  isbn?: string;
  coverImage: string;
  category: string;
  tags: string[];
  publishedDate?: string;
  publisher?: string;
  publisherAr?: string;
  publisherFa?: string;
  pages?: number;
  language: string;
  price?: number;
  currency?: string;
  downloadUrl?: string;
  previewUrl?: string;
  isFeatured: boolean;
  isActive: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookCategory {
  id: string;
  name: string;
  nameAr?: string;
  nameFa?: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface BookStats {
  total: number;
  active: number;
  featured: number;
  byCategory: Record<string, number>;
}

export type BookFormData = Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'>;

export type BookFilter = {
  category?: string;
  language?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  search?: string;
};

export type BookSortBy = 'title' | 'author' | 'publishedDate' | 'createdAt' | 'rating';
export type BookSortOrder = 'asc' | 'desc';
