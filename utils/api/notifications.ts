import { supabase } from '../../config/supabase';
import type { Database } from '../../types/database';

type Notification = Database['public']['Tables']['notifications']['Row'];
type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];

interface NotificationPreferences {
  push_enabled: boolean;
  email_enabled: boolean;
  browser_enabled: boolean;
  sound_enabled: boolean;
  task_assigned: boolean;
  task_completed: boolean;
  task_commented: boolean;
  task_due_soon: boolean;
  task_overdue: boolean;
  mention_in_chat: boolean;
  mention_in_comment: boolean;
  project_updates: boolean;
  project_deadline: boolean;
  chat_messages: boolean;
  direct_messages: boolean;
  system_updates: boolean;
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  daily_digest_enabled: boolean;
  daily_digest_time: string;
  weekly_digest_enabled: boolean;
  weekly_digest_day: number;
}

interface ScheduledNotification {
  user_id: string;
  title: string;
  message: string;
  type: string;
  action_url?: string;
  metadata?: any;
  scheduled_for: string;
}

export const notificationsApi = {
  // Get user notifications
  getNotifications: async (userId: string, limit: number = 50) => {
    console.log('🔍 Fetching notifications for user:', userId);
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('❌ Error fetching notifications:', error);
      throw error;
    }
    console.log('✅ Fetched', data?.length || 0, 'notifications from database');
    if (data && data.length > 0) {
      console.log('📋 Latest notification:', data[0]);
    }
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
    console.log('🗑️ Deleting notification from database:', notificationId);
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) {
      console.error('❌ Error deleting notification:', error);
      throw error;
    }
    console.log('✅ Notification deleted from database');
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
  },

  // ===== NOTIFICATION PREFERENCES =====

  // Get user notification preferences
  getPreferences: async (userId: string): Promise<NotificationPreferences | null> => {
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No preferences found, create default
        return notificationsApi.createDefaultPreferences(userId);
      }
      throw error;
    }
    return data as any;
  },

  // Create default preferences
  createDefaultPreferences: async (userId: string): Promise<NotificationPreferences> => {
    const { data, error } = await supabase
      .from('notification_preferences')
      .insert({ user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data as any;
  },

  // Update notification preferences
  updatePreferences: async (
    userId: string,
    preferences: Partial<NotificationPreferences>
  ) => {
    const { data, error } = await supabase
      .from('notification_preferences')
      .update(preferences as any)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ===== SCHEDULED NOTIFICATIONS =====

  // Schedule a notification
  scheduleNotification: async (notification: ScheduledNotification) => {
    const { data, error } = await supabase
      .from('scheduled_notifications')
      .insert(notification as any)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get scheduled notifications
  getScheduledNotifications: async (userId: string) => {
    const { data, error } = await supabase
      .from('scheduled_notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('sent', false)
      .order('scheduled_for', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Cancel scheduled notification
  cancelScheduledNotification: async (notificationId: string) => {
    const { error } = await supabase
      .from('scheduled_notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
  },

  // ===== NOTIFICATION GROUPS =====

  // Get notification groups
  getNotificationGroups: async (userId: string) => {
    const { data, error } = await supabase
      .from('notification_groups')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Mark group as read
  markGroupAsRead: async (groupId: string) => {
    const { error } = await supabase
      .from('notification_groups')
      .update({ read: true } as any)
      .eq('id', groupId);

    if (error) throw error;
  },

  // ===== NOTIFICATION SUMMARY =====

  // Get notification summary by type
  getNotificationSummary: async (userId: string) => {
    const { data, error } = await supabase
      .from('notification_summary')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  },

  // ===== BULK OPERATIONS =====

  // Mark multiple notifications as read
  markMultipleAsRead: async (notificationIds: string[]) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true } as any)
      .in('id', notificationIds);

    if (error) throw error;
  },

  // Delete multiple notifications
  deleteMultiple: async (notificationIds: string[]) => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .in('id', notificationIds);

    if (error) throw error;
  },

  // ===== ADVANCED HELPERS =====

  // Schedule task deadline reminder
  scheduleTaskDeadlineReminder: async (
    userId: string,
    taskId: string,
    taskTitle: string,
    dueDate: string,
    reminderHoursBefore: number = 24
  ) => {
    const reminderDate = new Date(dueDate);
    reminderDate.setHours(reminderDate.getHours() - reminderHoursBefore);

    return notificationsApi.scheduleNotification({
      user_id: userId,
      title: 'Task Deadline Reminder',
      message: `"${taskTitle}" is due in ${reminderHoursBefore} hours`,
      type: 'warning',
      action_url: `/work/tasks/${taskId}`,
      metadata: { taskId, dueDate, reminderHoursBefore },
      scheduled_for: reminderDate.toISOString()
    });
  },

  // Notify project team
  notifyProjectTeam: async (
    projectId: string,
    title: string,
    message: string,
    actionUrl?: string
  ) => {
    // Get all project members
    const { data: members, error } = await supabase
      .from('project_members')
      .select('user_id')
      .eq('project_id', projectId);

    if (error) throw error;

    // Create notifications for all members
    const notifications = members.map(member => ({
      user_id: member.user_id,
      title,
      message,
      type: 'info' as const,
      action_url: actionUrl,
      metadata: { projectId }
    }));

    const { error: insertError } = await supabase
      .from('notifications')
      .insert(notifications as any);

    if (insertError) throw insertError;
  },

  // Notify task watchers
  notifyTaskWatchers: async (
    taskId: string,
    title: string,
    message: string,
    excludeUserId?: string
  ) => {
    // Get task assignee and creator
    const { data: task, error } = await supabase
      .from('tasks')
      .select('assignee_id, creator_id')
      .eq('id', taskId)
      .single();

    if (error) throw error;

    const userIds = new Set<string>();
    if (task.assignee_id) userIds.add(task.assignee_id);
    if (task.creator_id) userIds.add(task.creator_id);
    if (excludeUserId) userIds.delete(excludeUserId);

    const notifications = Array.from(userIds).map(userId => ({
      user_id: userId,
      title,
      message,
      type: 'task' as const,
      action_url: `/work/tasks/${taskId}`,
      metadata: { taskId }
    }));

    if (notifications.length > 0) {
      const { error: insertError } = await supabase
        .from('notifications')
        .insert(notifications as any);

      if (insertError) throw insertError;
    }
  }
};
