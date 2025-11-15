import { supabase } from '../../config/supabase';
import type { Database } from '../../types/database';

type User = Database['public']['Tables']['users']['Row'];
type UserUpdate = Database['public']['Tables']['users']['Update'];

export const usersApi = {
  // Get all users
  getAllUsers: async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('full_name', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Get user by ID
  getUser: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error(`User profile not found for ID: ${userId}. Please create a user record in the public.users table.`);
      }
      throw error;
    }
    
    if (!data) {
      throw new Error(`User profile not found for ID: ${userId}`);
    }
    
    return data;
  },

  // Get current user profile
  getCurrentUserProfile: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  },

  // Update user profile
  updateProfile: async (userId: string, updates: UserUpdate) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update user status
  updateStatus: async (userId: string, status: 'online' | 'offline' | 'away' | 'busy') => {
    const { data, error } = await supabase
      .from('users')
      .update({ status })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Search users
  searchUsers: async (query: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, email, avatar_url, position, department')
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(10);

    if (error) throw error;
    return data;
  },

  // Get users by role
  getUsersByRole: async (role: 'admin' | 'manager' | 'employee') => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', role)
      .order('full_name', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Get users by department
  getUsersByDepartment: async (department: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('department', department)
      .order('full_name', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Get online users
  getOnlineUsers: async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, avatar_url, status, position')
      .eq('status', 'online')
      .order('full_name', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Update avatar
  updateAvatar: async (userId: string, avatarUrl: string) => {
    const { data, error } = await supabase
      .from('users')
      .update({ avatar_url: avatarUrl })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user statistics
  getUserStats: async (userId: string) => {
    // Get task counts
    const { data: tasks } = await supabase
      .from('tasks')
      .select('status')
      .eq('assignee_id', userId);

    // Get project counts
    const { data: projects } = await supabase
      .from('project_members')
      .select('project_id')
      .eq('user_id', userId);

    // Get time entries
    const { data: timeEntries } = await supabase
      .from('time_entries')
      .select('hours')
      .eq('user_id', userId);

    return {
      totalTasks: tasks?.length || 0,
      completedTasks: tasks?.filter(t => t.status === 'completed').length || 0,
      activeProjects: projects?.length || 0,
      totalHours: timeEntries?.reduce((sum, t) => sum + t.hours, 0) || 0
    };
  }
};
