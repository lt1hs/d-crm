import React from 'react';
import { UserAccount } from '../../types/user';

interface UserStatsProps {
  users: UserAccount[];
}

const UserStats: React.FC<UserStatsProps> = ({ users }) => {
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    superAdmins: users.filter(u => u.role === 'super_admin').length,
    admins: users.filter(u => u.role === 'admin').length,
    editors: users.filter(u => u.role === 'editor').length,
    viewers: users.filter(u => u.role === 'viewer').length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
        <div className="text-2xl font-bold mt-1">{stats.total}</div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
        <div className="text-2xl font-bold mt-1 text-green-600">{stats.active}</div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">Inactive</div>
        <div className="text-2xl font-bold mt-1 text-gray-600">{stats.inactive}</div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">Suspended</div>
        <div className="text-2xl font-bold mt-1 text-red-600">{stats.suspended}</div>
      </div>

      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg shadow p-4">
        <div className="text-sm text-purple-600 dark:text-purple-400">Super Admins</div>
        <div className="text-2xl font-bold mt-1 text-purple-700 dark:text-purple-300">{stats.superAdmins}</div>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow p-4">
        <div className="text-sm text-blue-600 dark:text-blue-400">Admins</div>
        <div className="text-2xl font-bold mt-1 text-blue-700 dark:text-blue-300">{stats.admins}</div>
      </div>
      
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg shadow p-4">
        <div className="text-sm text-yellow-600 dark:text-yellow-400">Editors</div>
        <div className="text-2xl font-bold mt-1 text-yellow-700 dark:text-yellow-300">{stats.editors}</div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow p-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">Viewers</div>
        <div className="text-2xl font-bold mt-1">{stats.viewers}</div>
      </div>
    </div>
  );
};

export default UserStats;
