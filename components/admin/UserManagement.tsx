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

  const loadUsers = async () => {
    try {
      // Try to load from Supabase Auth (all registered users)
      const { supabaseAdmin } = await import('../../config/supabase');
      
      if (supabaseAdmin) {
        const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
        
        if (authError) throw authError;
        
        if (authUsers && authUsers.users.length > 0) {
          const formattedUsers = authUsers.users.map(user => ({
            id: user.id,
            username: user.email?.split('@')[0] || 'user',
            email: user.email || '',
            fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            avatar: user.user_metadata?.avatar_url || '/imgs/default-avatar.png',
            role: (user.user_metadata?.role || 'employee') as any,
            status: 'active' as any,
            permissions: [],
            createdAt: user.created_at,
          }));
          setUsers(formattedUsers);
          return;
        }
      }
      
      // Fallback to public.users table
      const { usersApi } = await import('../../utils/api');
      const supabaseUsers = await usersApi.getAllUsers();
      
      if (supabaseUsers && supabaseUsers.length > 0) {
        const formattedUsers = supabaseUsers.map(user => ({
          id: user.id,
          username: user.email.split('@')[0],
          email: user.email,
          fullName: user.full_name,
          avatar: user.avatar_url || '/imgs/default-avatar.png',
          role: user.role as any,
          status: 'active' as any,
          permissions: [],
          createdAt: user.created_at,
        }));
        setUsers(formattedUsers);
        return;
      }
    } catch (error) {
      console.log('Supabase users not available, using localStorage');
    }
    
    // Fallback to localStorage
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
        avatar: '/imgs/default-avatar.png',
        permissions: [],
        createdAt: new Date().toISOString(),
      };
      setUsers([defaultUser]);
      localStorage.setItem('users', JSON.stringify([defaultUser]));
    }
  };

  const handleSaveUser = async (user: Omit<UserAccount, 'id' | 'createdAt'> & { password?: string }) => {
    try {
      if (editingUser) {
        // Update existing user
        if (user.password && user.password.length >= 6) {
          // Update password in Supabase if provided
          try {
            const { authApi } = await import('../../utils/api');
            await authApi.updateUserPassword(editingUser.id, user.password);
            alert(`✅ Password updated for ${user.email}`);
          } catch (error) {
            console.error('Password update failed:', error);
            alert('❌ Failed to update password in Supabase');
            return; // Don't proceed if password update fails
          }
        }
        
        const updatedUsers = users.map(u =>
          u.id === editingUser.id ? { ...user, id: u.id, createdAt: u.createdAt } : u
        );
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        logActivity('update', 'users', editingUser.id, `Updated user: ${user.username}`);
      } else {
        // Create new user in Supabase only
        if (!user.password) {
          alert('Password is required for new users');
          return;
        }

        if (user.password.length < 6) {
          alert('Password must be at least 6 characters long');
          return;
        }

        const { authApi } = await import('../../utils/api');
        
        const result = await authApi.createUserAsAdmin({
          email: user.email,
          password: user.password,
          fullName: user.fullName,
          role: user.role as 'admin' | 'manager' | 'employee'
        });

        if (result.user) {
          // Reload users from Supabase to show the new user
          await loadUsers();
          logActivity('create', 'users', result.user.id, `Created user in Supabase: ${user.username}`);
          
          alert(`✅ User created in Supabase!
Email: ${user.email}
Password: ${user.password}`);
        }
      }
      
      setIsFormOpen(false);
      setEditingUser(null);
    } catch (error: any) {
      console.error('Error saving user:', error);
      alert(`Failed to create user: ${error.message}`);
    }
  };

  const handleEditUser = (user: UserAccount) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === currentUser?.id) {
      alert('Cannot delete your own account');
      return;
    }
    
    if (confirm('Are you sure you want to delete this user? This will permanently remove them from Supabase.')) {
      try {
        // Delete from Supabase
        const { authApi } = await import('../../utils/api');
        await authApi.deleteUser(userId);
        
        // Remove from local state
        const updatedUsers = users.filter(u => u.id !== userId);
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        logActivity('delete', 'users', userId, 'Deleted user from Supabase');
        
        alert('✅ User deleted successfully from Supabase');
      } catch (error: any) {
        console.error('Delete failed:', error);
        alert(`❌ Failed to delete user: ${error.message}`);
      }
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
