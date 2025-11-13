export interface Course {
  id: string;
  title: string;
  titleAr?: string;
  titleFa?: string;
  slug: string;
  description: string;
  descriptionAr?: string;
  descriptionFa?: string;
  shortDescription: string;
  shortDescriptionAr?: string;
  shortDescriptionFa?: string;
  thumbnail: string;
  coverImage?: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
  price: number;
  discountPrice?: number;
  currency: string;
  duration: number; // in hours
  lessonsCount: number;
  language: string;
  instructor: string;
  instructorAr?: string;
  instructorFa?: string;
  instructorBio?: string;
  instructorAvatar?: string;
  status: 'draft' | 'published' | 'archived' | 'coming-soon';
  isFeatured: boolean;
  isBestseller: boolean;
  enrolledStudents: number;
  rating: number;
  reviewsCount: number;
  tags: string[];
  requirements: string[];
  whatYouWillLearn: string[];
  syllabus?: CourseSyllabus[];
  certificateOffered: boolean;
  hasLifetimeAccess: boolean;
  publishedDate?: string;
  lastUpdated?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseSyllabus {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: number; // in minutes
  isFree: boolean;
  type: 'video' | 'article' | 'quiz' | 'assignment';
}

export interface CourseCategory {
  id: string;
  name: string;
  nameAr?: string;
  nameFa?: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface CourseStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  comingSoon: number;
  featured: number;
  bestsellers: number;
  totalStudents: number;
  totalRevenue: number;
  byCategory: Record<string, number>;
  byLevel: Record<string, number>;
}

export type CourseFormData = Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'enrolledStudents' | 'rating' | 'reviewsCount'>;

export type CourseFilter = {
  category?: string;
  level?: Course['level'];
  status?: Course['status'];
  isFeatured?: boolean;
  isBestseller?: boolean;
  search?: string;
  priceMin?: number;
  priceMax?: number;
};

export type CourseSortBy = 'title' | 'price' | 'enrolledStudents' | 'rating' | 'createdAt' | 'publishedDate';
export type CourseSortOrder = 'asc' | 'desc';
