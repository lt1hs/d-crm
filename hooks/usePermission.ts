import { useAuth } from '../context/AuthContext';

/**
 * Custom hook to check permissions for a specific resource
 * @param resource - The resource to check permissions for
 * @returns Object with permission check functions
 */
export const usePermission = (resource: string) => {
  const { hasPermission } = useAuth();

  return {
    canCreate: hasPermission(resource, 'create'),
    canRead: hasPermission(resource, 'read'),
    canUpdate: hasPermission(resource, 'update'),
    canDelete: hasPermission(resource, 'delete'),
    canAccess: hasPermission(resource, 'read'), // Alias for canRead
  };
};

/**
 * Example usage:
 * 
 * const { canCreate, canUpdate, canDelete } = usePermission('books');
 * 
 * return (
 *   <div>
 *     {canCreate && <button>Add Book</button>}
 *     {canUpdate && <button>Edit</button>}
 *     {canDelete && <button>Delete</button>}
 *   </div>
 * );
 */
