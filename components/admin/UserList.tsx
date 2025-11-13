import React from 'react';
import { UserAccount } from '../../types/user';
import { getRoleLabel } from '../../utils/permissionHelpers';

interface UserListProps {
  users: UserAccount[];
  onEdit: (user: UserAccount) => void;
  onDelete: (userId: string) => void;
  onStatusChange: (userId: string, status: 'active' | 'inactive' | 'suspended') => void;
  canEdit: boolean;
  canDelete: boolean;
}

const UserList: React.FC<UserListProps> = ({
  users,
  onEdit,
  onDelete,
  onStatusChange,
  canEdit,
  canDelete,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'editor':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'viewer':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase">User</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase">Email</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase">Role</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase">Last Login</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-4 py-3">
                <div className="flex items-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.fullName} className="w-8 h-8 rounded-full mr-3" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                      {user.fullName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{user.fullName}</div>
                    <div className="text-sm text-gray-500">@{user.username}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm">{user.email}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                  {getRoleLabel(user.role)}
                </span>
              </td>
              <td className="px-4 py-3">
                {canEdit ? (
                  <select
                    value={user.status}
                    onChange={(e) => onStatusChange(user.id, e.target.value as any)}
                    className={`px-2 py-1 text-xs rounded-full border-0 ${getStatusColor(user.status)}`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                ) : (
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-sm">
                {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  {canEdit && (
                    <button
                      onClick={() => onEdit(user)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => onDelete(user.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
