import { Book, BookFilter, BookSortBy, BookSortOrder, BookStats } from '../types/book';

export const generateBookId = (): string => {
  return `book-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const filterBooks = (books: Book[], filter: BookFilter): Book[] => {
  return books.filter(book => {
    if (filter.category && book.category !== filter.category) return false;
    if (filter.language && book.language !== filter.language) return false;
    if (filter.isFeatured !== undefined && book.isFeatured !== filter.isFeatured) return false;
    if (filter.isActive !== undefined && book.isActive !== filter.isActive) return false;
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      const matchesTitle = book.title.toLowerCase().includes(searchLower);
      const matchesAuthor = book.author.toLowerCase().includes(searchLower);
      const matchesISBN = book.isbn?.toLowerCase().includes(searchLower);
      if (!matchesTitle && !matchesAuthor && !matchesISBN) return false;
    }
    return true;
  });
};

export const sortBooks = (books: Book[], sortBy: BookSortBy, order: BookSortOrder): Book[] => {
  return [...books].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'author':
        comparison = a.author.localeCompare(b.author);
        break;
      case 'publishedDate':
        comparison = (a.publishedDate || '').localeCompare(b.publishedDate || '');
        break;
      case 'createdAt':
        comparison = a.createdAt.localeCompare(b.createdAt);
        break;
      case 'rating':
        comparison = (a.rating || 0) - (b.rating || 0);
        break;
    }
    
    return order === 'asc' ? comparison : -comparison;
  });
};

export const getBookStats = (books: Book[]): BookStats => {
  const stats: BookStats = {
    total: books.length,
    active: books.filter(b => b.isActive).length,
    featured: books.filter(b => b.isFeatured).length,
    byCategory: {},
  };
  
  books.forEach(book => {
    if (!stats.byCategory[book.category]) {
      stats.byCategory[book.category] = 0;
    }
    stats.byCategory[book.category]++;
  });
  
  return stats;
};

export const validateISBN = (isbn: string): boolean => {
  // Remove hyphens and spaces
  const cleaned = isbn.replace(/[-\s]/g, '');
  
  // Check if it's ISBN-10 or ISBN-13
  if (cleaned.length === 10) {
    return /^\d{9}[\dX]$/.test(cleaned);
  } else if (cleaned.length === 13) {
    return /^\d{13}$/.test(cleaned);
  }
  
  return false;
};

export const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

export const getBookCoverPlaceholder = (title: string): string => {
  const colors = ['3b82f6', '8b5cf6', 'ec4899', 'f59e0b', '10b981', '06b6d4'];
  const colorIndex = title.length % colors.length;
  const color = colors[colorIndex];
  const initial = title.charAt(0).toUpperCase();
  
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300'%3E%3Crect fill='%23${color}' width='200' height='300'/%3E%3Ctext fill='white' font-size='120' font-family='Arial' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3E${initial}%3C/text%3E%3C/svg%3E`;
};
