import { supabase } from '../../config/supabase';
import type { Database } from '../../types/database';

type Project = Database['public']['Tables']['projects']['Row'];
type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export const projectsApi = {
  // Get all projects for current user
  getMyProjects: async (userId: string) => {
    console.log('projectsApi.getMyProjects: Fetching projects for user:', userId);
    
    // First, get projects where user is owner
    const { data: ownedProjects, error: ownedError } = await supabase
      .from('projects')
      .select(`
        *,
        owner:users!projects_owner_id_fkey(id, full_name, avatar_url),
        members:project_members(
          user:users(id, full_name, avatar_url, email),
          role
        )
      `)
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });

    if (ownedError) throw ownedError;

    // Then, get project IDs where user is a member
    const { data: memberProjects, error: memberError } = await supabase
      .from('project_members')
      .select('project_id')
      .eq('user_id', userId);

    if (memberError) throw memberError;

    // If user is a member of other projects, fetch those too
    if (memberProjects && memberProjects.length > 0) {
      const memberProjectIds = memberProjects.map(m => m.project_id);
      
      const { data: memberProjectsData, error: memberProjectsError } = await supabase
        .from('projects')
        .select(`
          *,
          owner:users!projects_owner_id_fkey(id, full_name, avatar_url),
          members:project_members(
            user:users(id, full_name, avatar_url, email),
            role
          )
        `)
        .in('id', memberProjectIds)
        .order('created_at', { ascending: false });

      if (memberProjectsError) throw memberProjectsError;

      // Combine and deduplicate
      const allProjects = [...(ownedProjects || []), ...(memberProjectsData || [])];
      const uniqueProjects = Array.from(
        new Map(allProjects.map(p => [p.id, p])).values()
      );
      
      console.log('projectsApi.getMyProjects: Returning', uniqueProjects.length, 'projects');
      return uniqueProjects;
    }

    console.log('projectsApi.getMyProjects: Returning', ownedProjects?.length || 0, 'owned projects');
    return ownedProjects || [];
  },

  // Get single project
  getProject: async (projectId: string) => {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        owner:users!projects_owner_id_fkey(id, full_name, avatar_url, email),
        members:project_members(
          id,
          role,
          joined_at,
          user:users(id, full_name, avatar_url, email, position)
        )
      `)
      .eq('id', projectId)
      .single();

    if (error) throw error;
    return data;
  },

  // Create project
  createProject: async (project: ProjectInsert) => {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();

    if (error) throw error;

    // Add owner as project member
    if (data) {
      await supabase
        .from('project_members')
        .insert({
          project_id: data.id,
          user_id: project.owner_id,
          role: 'owner'
        });
    }

    return data;
  },

  // Update project
  updateProject: async (projectId: string, updates: ProjectUpdate) => {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete project
  deleteProject: async (projectId: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) throw error;
  },

  // Add member to project
  addMember: async (projectId: string, userId: string, role: 'admin' | 'member' = 'member') => {
    const { data, error } = await supabase
      .from('project_members')
      .insert({
        project_id: projectId,
        user_id: userId,
        role
      })
      .select('*, user:users(id, full_name, avatar_url, email)')
      .single();

    if (error) throw error;
    return data;
  },

  // Remove member from project
  removeMember: async (projectId: string, userId: string) => {
    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  // Update member role
  updateMemberRole: async (projectId: string, userId: string, role: 'admin' | 'member') => {
    const { data, error } = await supabase
      .from('project_members')
      .update({ role })
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get project statistics
  getProjectStats: async (projectId: string) => {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('status, priority, estimated_hours, actual_hours')
      .eq('project_id', projectId);

    if (error) throw error;

    const stats = {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
      blockedTasks: tasks.filter(t => t.status === 'blocked').length,
      estimatedHours: tasks.reduce((sum, t) => sum + (t.estimated_hours || 0), 0),
      actualHours: tasks.reduce((sum, t) => sum + (t.actual_hours || 0), 0),
      completionRate: tasks.length > 0 
        ? (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100 
        : 0
    };

    return stats;
  }
};
