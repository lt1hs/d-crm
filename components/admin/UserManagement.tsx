import React, { useState, useEffect } from 'react';
import { UserAccount } from '../../types/user';
import { useAuth } from '../../context/AuthContext';
import UserList from './UserList';
import UserForm from './UserForm';
import UserStats from './UserStats';

const UserManagement: React.FC = () => {
  const { currentUser, hasPermission, logActivity } = useAuth();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Initialize with default super admin
      const defaultUser: UserAccount = {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        fullName: 'System Administrator',
        role: 'super_admin',
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      setUsers([defaultUser]);
      localStorage.setItem('users', JSON.stringify([defaultUser]));
    }
  };

  const handleSaveUser = (user: Omit<UserAccount, 'id' | 'createdAt'>) => {
    if (editingUser) {
      const updatedUsers = users.map(u =>
        u.id === editingUser.id ? { ...user, id: u.id, createdAt: u.createdAt } : u
      );
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      logActivity('update', 'users', editingUser.id, `Updated user: ${user.username}`);
    } else {
      const newUser: UserAccount = {
        ...user,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      logActivity('create', 'users', newUser.id, `Created user: ${user.username}`);
    }
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const handleEditUser = (user: UserAccount) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser?.id) {
      alert('Cannot delete your own account');
      return;
    }
    if (confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      logActivity('delete', 'users', userId, 'Deleted user');
    }
  };

  const handleStatusChange = (userId: string, status: 'active' | 'inactive' | 'suspended') => {
    const updatedUsers = users.map(u =>
      u.id === userId ? { ...u, status } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    logActivity('update', 'users', userId, `Changed user status to: ${status}`);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!hasPermission('users', 'read')) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">You don't have permission to access user management.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        {hasPermission('users', 'create') && (
          <button
            onClick={() => {
              setEditingUser(null);
              setIsFormOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add User
          </button>
        )}
      </div>

      <UserStats users={users} />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <UserList
          users={filteredUsers}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onStatusChange={handleStatusChange}
          canEdit={hasPermission('users', 'update')}
          canDelete={hasPermission('users', 'delete')}
        />
      </div>

      {isFormOpen && (
        <UserForm
          user={editingUser}
          onSave={handleSaveUser}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
};

export default UserManagement;
