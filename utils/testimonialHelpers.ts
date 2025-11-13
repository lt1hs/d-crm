import { Testimonial, TestimonialFilter, TestimonialSortBy, TestimonialSortOrder, TestimonialStats } from '../types/testimonial';

export const generateTestimonialId = (): string => {
  return `testimonial-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const filterTestimonials = (testimonials: Testimonial[], filter: TestimonialFilter): Testimonial[] => {
  return testimonials.filter(testimonial => {
    if (filter.category && testimonial.category !== filter.category) return false;
    if (filter.type && testimonial.type !== filter.type) return false;
    if (filter.status && testimonial.status !== filter.status) return false;
    if (filter.rating && testimonial.rating !== filter.rating) return false;
    if (filter.isFeatured !== undefined && testimonial.isFeatured !== filter.isFeatured) return false;
    if (filter.isPublic !== undefined && testimonial.isPublic !== filter.isPublic) return false;
    if (filter.verified !== undefined && testimonial.verified !== filter.verified) return false;
    
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      const matchesName = testimonial.name.toLowerCase().includes(searchLower);
      const matchesCompany = testimonial.company?.toLowerCase().includes(searchLower);
      const matchesTestimonial = testimonial.testimonial.toLowerCase().includes(searchLower);
      const matchesTags = testimonial.tags.some(tag => tag.toLowerCase().includes(searchLower));
      if (!matchesName && !matchesCompany && !matchesTestimonial && !matchesTags) return false;
    }
    
    if (filter.dateFrom && testimonial.date < filter.dateFrom) return false;
    if (filter.dateTo && testimonial.date > filter.dateTo) return false;
    
    return true;
  });
};

export const sortTestimonials = (testimonials: Testimonial[], sortBy: TestimonialSortBy, order: TestimonialSortOrder): Testimonial[] => {
  return [...testimonials].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'date':
        comparison = a.date.localeCompare(b.date);
        break;
      case 'rating':
        comparison = a.rating - b.rating;
        break;
      case 'helpfulCount':
        comparison = a.helpfulCount - b.helpfulCount;
        break;
    }
    
    return order === 'asc' ? comparison : -comparison;
  });
};

export const getTestimonialStats = (testimonials: Testimonial[]): TestimonialStats => {
  const stats: TestimonialStats = {
    total: testimonials.length,
    published: testimonials.filter(t => t.status === 'published').length,
    draft: testimonials.filter(t => t.status === 'draft').length,
    archived: testimonials.filter(t => t.status === 'archived').length,
    featured: testimonials.filter(t => t.isFeatured).length,
    verified: testimonials.filter(t => t.verified).length,
    averageRating: testimonials.length > 0 
      ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length 
      : 0,
    totalHelpful: testimonials.reduce((sum, t) => sum + t.helpfulCount, 0),
    byCategory: {},
    byType: {},
    byRating: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };
  
  testimonials.forEach(testimonial => {
    if (!stats.byCategory[testimonial.category]) {
      stats.byCategory[testimonial.category] = 0;
    }
    stats.byCategory[testimonial.category]++;
    
    if (!stats.byType[testimonial.type]) {
      stats.byType[testimonial.type] = 0;
    }
    stats.byType[testimonial.type]++;
    
    stats.byRating[testimonial.rating]++;
  });
  
  return stats;
};

export const getStatusColor = (status: Testimonial['status']): string => {
  switch (status) {
    case 'published':
      return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
    case 'draft':
      return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    case 'archived':
      return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
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

export const getRatingStars = (rating: number): string => {
  return '⭐'.repeat(rating);
};

export const getRatingColor = (rating: number): string => {
  if (rating >= 4) return 'text-green-600 dark:text-green-400';
  if (rating >= 3) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};
