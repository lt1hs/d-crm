import React, { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  resource: string;
  action?: 'create' | 'read' | 'update' | 'delete';
  fallback?: ReactNode;
}

/**
 * Component to protect routes/content based on permissions
 * 
 * @example
 * <ProtectedRoute resource="users" action="read">
 *   <UserManagement />
 * </ProtectedRoute>
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  resource,
  action = 'read',
  fallback,
}) => {
  const { hasPermission } = useAuth();

  if (!hasPermission(resource, action)) {
    return (
      <>
        {fallback || (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-6xl mb-4">🔒</div>
              <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
              <p className="text-gray-600 dark:text-gray-400">
                You don't have permission to access this resource.
              </p>
            </div>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
