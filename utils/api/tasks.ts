import { supabase } from '../../config/supabase';
import type { Database } from '../../types/database';

type Task = Database['public']['Tables']['tasks']['Row'];
type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

export const tasksApi = {
  // Get all tasks for a project
  getTasksByProject: async (projectId: string) => {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assignee:users!tasks_assignee_id_fkey(id, full_name, avatar_url),
        creator:users!tasks_creator_id_fkey(id, full_name, avatar_url),
        subtasks(*),
        task_comments(*, user:users(id, full_name, avatar_url)),
        task_attachments(*)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get tasks assigned to user
  getMyTasks: async (userId: string) => {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        project:projects(id, name, color),
        assignee:users!tasks_assignee_id_fkey(id, full_name, avatar_url),
        subtasks(*)
      `)
      .eq('assignee_id', userId)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Get single task with full details
  getTask: async (taskId: string) => {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        project:projects(id, name, color),
        assignee:users!tasks_assignee_id_fkey(id, full_name, avatar_url, email),
        creator:users!tasks_creator_id_fkey(id, full_name, avatar_url),
        subtasks(*),
        task_comments(*, user:users(id, full_name, avatar_url)),
        task_attachments(*),
        dependencies:task_dependencies!task_dependencies_task_id_fkey(
          depends_on_task:tasks!task_dependencies_depends_on_task_id_fkey(id, title, status)
        )
      `)
      .eq('id', taskId)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new task
  createTask: async (task: TaskInsert) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update task
  updateTask: async (taskId: string, updates: TaskUpdate) => {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete task
  deleteTask: async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) throw error;
  },

  // Add subtask
  addSubtask: async (taskId: string, title: string, assigneeId?: string) => {
    const { data, error } = await supabase
      .from('subtasks')
      .insert({
        task_id: taskId,
        title,
        assignee_id: assigneeId
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update subtask
  updateSubtask: async (subtaskId: string, completed: boolean) => {
    const { data, error } = await supabase
      .from('subtasks')
      .update({ completed })
      .eq('id', subtaskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Add comment
  addComment: async (taskId: string, userId: string, content: string, mentions: string[] = []) => {
    const { data, error } = await supabase
      .from('task_comments')
      .insert({
        task_id: taskId,
        user_id: userId,
        content,
        mentions
      })
      .select('*, user:users(id, full_name, avatar_url)')
      .single();

    if (error) throw error;
    return data;
  },

  // Add attachment
  addAttachment: async (
    taskId: string,
    userId: string,
    name: string,
    url: string,
    type: string,
    size: number
  ) => {
    const { data, error } = await supabase
      .from('task_attachments')
      .insert({
        task_id: taskId,
        uploaded_by: userId,
        name,
        url,
        type,
        size
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get task statistics
  getTaskStats: async (userId: string) => {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('status, priority')
      .or(`assignee_id.eq.${userId},creator_id.eq.${userId}`);

    if (error) throw error;

    const stats = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      review: tasks.filter(t => t.status === 'review').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      blocked: tasks.filter(t => t.status === 'blocked').length,
      urgent: tasks.filter(t => t.priority === 'urgent').length,
      high: tasks.filter(t => t.priority === 'high').length
    };

    return stats;
  }
};
