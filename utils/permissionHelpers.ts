import { UserRole, Permission } from '../types/user';
import { rolePermissions } from '../data/rolePermissions';

export const getRolePermissions = (role: UserRole): Permission[] => {
  const roleConfig = rolePermissions.find(r => r.role === role);
  return roleConfig?.permissions || [];
};

export const canAccess = (
  userRole: UserRole,
  resource: string,
  action: 'create' | 'read' | 'update' | 'delete',
  customPermissions?: Permission[]
): boolean => {
  // Super admin always has access
  if (userRole === 'super_admin') return true;
  
  // Check custom permissions first
  if (customPermissions) {
    const permission = customPermissions.find(p => p.resource === resource);
    if (permission) {
      return permission.actions.includes(action);
    }
  }
  
  // Check role-based permissions
  const permissions = getRolePermissions(userRole);
  const permission = permissions.find(p => p.resource === resource);
  return permission ? permission.actions.includes(action) : false;
};

export const getRoleLabel = (role: UserRole): string => {
  const roleConfig = rolePermissions.find(r => r.role === role);
  return roleConfig?.label || role;
};

export const getRoleDescription = (role: UserRole): string => {
  const roleConfig = rolePermissions.find(r => r.role === role);
  return roleConfig?.description || '';
};
