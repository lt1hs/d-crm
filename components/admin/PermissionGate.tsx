import React, { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';

interface PermissionGateProps {
  children: ReactNode;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
  fallback?: ReactNode;
}

/**
 * Component to conditionally render content based on permissions
 * Unlike ProtectedRoute, this doesn't show an error message by default
 * 
 * @example
 * <PermissionGate resource="books" action="create">
 *   <button>Add Book</button>
 * </PermissionGate>
 */
const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  resource,
  action,
  fallback = null,
}) => {
  const { hasPermission } = useAuth();

  if (!hasPermission(resource, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default PermissionGate;
