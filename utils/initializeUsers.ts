import { UserAccount } from '../types/user';
import { getRolePermissions } from './permissionHelpers';

export const initializeDefaultUsers = () => {
  const existingUsers = localStorage.getItem('users');
  
  if (!existingUsers) {
    const defaultAdmin: UserAccount = {
      id: '1',
      username: 'admin',
      email: 'admin@example.com',
      fullName: 'System Administrator',
      role: 'super_admin',
      status: 'active',
      createdAt: new Date().toISOString(),
      permissions: getRolePermissions('super_admin'),
    };

    const demoEditor: UserAccount = {
      id: '2',
      username: 'editor',
      email: 'editor@example.com',
      fullName: 'Content Editor',
      role: 'editor',
      status: 'active',
      createdAt: new Date().toISOString(),
      permissions: getRolePermissions('editor'),
    };

    const demoViewer: UserAccount = {
      id: '3',
      username: 'viewer',
      email: 'viewer@example.com',
      fullName: 'Content Viewer',
      role: 'viewer',
      status: 'active',
      createdAt: new Date().toISOString(),
      permissions: getRolePermissions('viewer'),
    };

    localStorage.setItem('users', JSON.stringify([defaultAdmin, demoEditor, demoViewer]));
    console.log('Default users initialized');
  }
};
