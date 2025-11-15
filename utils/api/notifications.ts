import { supabase } from '../../config/supabase';
import type { Database } from '../../types/database';

type Notification = Database['public']['Tables']['notifications']['Row'];
type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];

export const notificationsApi = {
  // Get user notifications
  getNotifications: async (userId: string, limit: number = 50) => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Get unread notifications
  getUnreadNotifications: async (userId: string) => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('read', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get unread count
  getUnreadCount: async (userId: string) => {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
    return count || 0;
  },

  // Create notification
  createNotification: async (notification: NotificationInsert) => {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Mark as read
  markAsRead: async (notificationId: string) => {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Mark all as read
  markAllAsRead: async (userId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
  },

  // Delete notification
  deleteNotification: async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
  },

  // Delete all read notifications
  deleteAllRead: async (userId: string) => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', userId)
      .eq('read', true);

    if (error) throw error;
  },

  // Subscribe to notifications
  subscribeToNotifications: (
    userId: string,
    callback: (notification: Notification) => void
  ) => {
    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new as Notification);
        }
      )
      .subscribe();

    return subscription;
  },

  // Helper: Create task notification
  notifyTaskAssigned: async (
    userId: string,
    taskId: string,
    taskTitle: string,
    assignedBy: string
  ) => {
    return notificationsApi.createNotification({
      user_id: userId,
      title: 'New Task Assigned',
      message: `${assignedBy} assigned you to "${taskTitle}"`,
      type: 'task',
      action_url: `/work/tasks/${taskId}`,
      metadata: { taskId, assignedBy }
    });
  },

  // Helper: Create mention notification
  notifyMention: async (
    userId: string,
    mentionedBy: string,
    context: string,
    contextId: string,
    contextType: 'task' | 'comment' | 'message'
  ) => {
    return notificationsApi.createNotification({
      user_id: userId,
      title: 'You were mentioned',
      message: `${mentionedBy} mentioned you in ${context}`,
      type: 'mention',
      action_url: `/${contextType}s/${contextId}`,
      metadata: { mentionedBy, contextId, contextType }
    });
  },

  // Helper: Create deadline notification
  notifyDeadline: async (
    userId: string,
    taskId: string,
    taskTitle: string,
    dueDate: string
  ) => {
    return notificationsApi.createNotification({
      user_id: userId,
      title: 'Task Deadline Approaching',
      message: `"${taskTitle}" is due on ${new Date(dueDate).toLocaleDateString()}`,
      type: 'warning',
      action_url: `/work/tasks/${taskId}`,
      metadata: { taskId, dueDate }
    });
  }
};
