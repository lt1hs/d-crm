import { useAuth } from '../context/AuthContext';
import { useCallback } from 'react';

/**
 * Custom hook for logging activities
 * @param resource - The resource type (e.g., 'books', 'news', 'users')
 * @returns Object with logging functions
 */
export const useActivityLogger = (resource: string) => {
  const { logActivity } = useAuth();

  const logCreate = useCallback((resourceId: string, details?: string) => {
    logActivity('create', resource, resourceId, details || `Created ${resource}`);
  }, [logActivity, resource]);

  const logUpdate = useCallback((resourceId: string, details?: string) => {
    logActivity('update', resource, resourceId, details || `Updated ${resource}`);
  }, [logActivity, resource]);

  const logDelete = useCallback((resourceId: string, details?: string) => {
    logActivity('delete', resource, resourceId, details || `Deleted ${resource}`);
  }, [logActivity, resource]);

  const logView = useCallback((resourceId: string, details?: string) => {
    logActivity('view', resource, resourceId, details || `Viewed ${resource}`);
  }, [logActivity, resource]);

  const logCustom = useCallback((action: string, resourceId?: string, details?: string) => {
    logActivity(action, resource, resourceId, details);
  }, [logActivity, resource]);

  return {
    logCreate,
    logUpdate,
    logDelete,
    logView,
    logCustom,
  };
};

/**
 * Example usage:
 * 
 * const { logCreate, logUpdate, logDelete } = useActivityLogger('books');
 * 
 * const handleCreateBook = (book) => {
 *   // Create book logic
 *   logCreate(book.id, `Created book: ${book.title}`);
 * };
 * 
 * const handleUpdateBook = (book) => {
 *   // Update book logic
 *   logUpdate(book.id, `Updated book: ${book.title}`);
 * };
 * 
 * const handleDeleteBook = (bookId) => {
 *   // Delete book logic
 *   logDelete(bookId, 'Book deleted by user');
 * };
 */
