// User Role Types
export type UserRole = 'super_admin' | 'admin' | 'editor' | 'viewer' | 'author' | 'designer' | 'boss';

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  permissions?: Permission[];
}

export interface ActivityLog {
  id: string;
  userId: string;
  username: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface RolePermissions {
  role: UserRole;
  label: string;
  description: string;
  permissions: Permission[];
}
