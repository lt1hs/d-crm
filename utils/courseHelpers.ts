import { Course, CourseFilter, CourseSortBy, CourseSortOrder, CourseStats } from '../types/course';

export const generateCourseId = (): string => {
  return `course-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const calculateTotalDuration = (lessonsCount: number, avgLessonDuration: number = 15): number => {
  return Math.ceil((lessonsCount * avgLessonDuration) / 60); // Convert to hours
};

export const filterCourses = (courses: Course[], filter: CourseFilter): Course[] => {
  return courses.filter(course => {
    if (filter.category && course.category !== filter.category) return false;
    if (filter.level && course.level !== filter.level) return false;
    if (filter.status && course.status !== filter.status) return false;
    if (filter.isFeatured !== undefined && course.isFeatured !== filter.isFeatured) return false;
    if (filter.isBestseller !== undefined && course.isBestseller !== filter.isBestseller) return false;
    
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      const matchesTitle = course.title.toLowerCase().includes(searchLower);
      const matchesDescription = course.description.toLowerCase().includes(searchLower);
      const matchesInstructor = course.instructor.toLowerCase().includes(searchLower);
      const matchesTags = course.tags.some(tag => tag.toLowerCase().includes(searchLower));
      if (!matchesTitle && !matchesDescription && !matchesInstructor && !matchesTags) return false;
    }
    
    if (filter.priceMin !== undefined && course.price < filter.priceMin) return false;
    if (filter.priceMax !== undefined && course.price > filter.priceMax) return false;
    
    return true;
  });
};

export const sortCourses = (courses: Course[], sortBy: CourseSortBy, order: CourseSortOrder): Course[] => {
  return [...courses].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'enrolledStudents':
        comparison = a.enrolledStudents - b.enrolledStudents;
        break;
      case 'rating':
        comparison = a.rating - b.rating;
        break;
      case 'createdAt':
        comparison = a.createdAt.localeCompare(b.createdAt);
        break;
      case 'publishedDate':
        comparison = (a.publishedDate || '').localeCompare(b.publishedDate || '');
        break;
    }
    
    return order === 'asc' ? comparison : -comparison;
  });
};

export const getCourseStats = (courses: Course[]): CourseStats => {
  const stats: CourseStats = {
    total: courses.length,
    published: courses.filter(c => c.status === 'published').length,
    draft: courses.filter(c => c.status === 'draft').length,
    archived: courses.filter(c => c.status === 'archived').length,
    comingSoon: courses.filter(c => c.status === 'coming-soon').length,
    featured: courses.filter(c => c.isFeatured).length,
    bestsellers: courses.filter(c => c.isBestseller).length,
    totalStudents: courses.reduce((sum, c) => sum + c.enrolledStudents, 0),
    totalRevenue: courses.reduce((sum, c) => sum + (c.price * c.enrolledStudents), 0),
    byCategory: {},
    byLevel: {},
  };
  
  courses.forEach(course => {
    if (!stats.byCategory[course.category]) {
      stats.byCategory[course.category] = 0;
    }
    stats.byCategory[course.category]++;
    
    if (!stats.byLevel[course.level]) {
      stats.byLevel[course.level] = 0;
    }
    stats.byLevel[course.level]++;
  });
  
  return stats;
};

export const getStatusColor = (status: Course['status']): string => {
  switch (status) {
    case 'published':
      return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
    case 'draft':
      return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    case 'coming-soon':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
    case 'archived':
      return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
  }
};

export const getLevelColor = (level: Course['level']): string => {
  switch (level) {
    case 'beginner':
      return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
    case 'intermediate':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
    case 'advanced':
      return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
    case 'all-levels':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
  }
};

export const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

export const formatDuration = (hours: number): string => {
  if (hours < 1) {
    return `${Math.round(hours * 60)} mins`;
  }
  return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};
