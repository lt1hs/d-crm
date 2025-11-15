import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { notificationsApi } from '../utils/api';

/**
 * Hook providing convenient notification helpers for common use cases
 */
export const useNotificationHelpers = () => {
  const { currentUser } = useAuth();
  const { showToast } = useNotifications();

  // Task-related notifications
  const notifyTaskAssigned = useCallback(async (
    assigneeId: string,
    taskId: string,
    taskTitle: string,
    assignedByName: string
  ) => {
    try {
      await notificationsApi.notifyTaskAssigned(assigneeId, taskId, taskTitle, assignedByName);
      showToast({
        title: 'Notification Sent',
        message: `${assignedByName} has been notified`,
        type: 'success'
      });
    } catch (error) {
      console.error('Failed to send task assignment notification:', error);
    }
  }, [showToast]);

  const notifyTaskCompleted = useCallback(async (
    creatorId: string,
    taskId: string,
    taskTitle: string,
    completedByName: string
  ) => {
    try {
      await notificationsApi.createNotification({
        user_id: creatorId,
        title: 'Task Completed',
        message: `${completedByName} completed "${taskTitle}"`,
        type: 'success',
        action_url: `/work/tasks/${taskId}`,
        metadata: { taskId, completedBy: currentUser?.id }
      });
    } catch (error) {
      console.error('Failed to send task completion notification:', error);
    }
  }, [currentUser]);

  const notifyTaskComment = useCallback(async (
    taskId: string,
    commenterName: string,
    comment: string,
    excludeUserId?: string
  ) => {
    try {
      await notificationsApi.notifyTaskWatchers(
        taskId,
        'New Comment',
        `${commenterName} commented: ${comment.substring(0, 100)}`,
        excludeUserId
      );
    } catch (error) {
      console.error('Failed to send task comment notification:', error);
    }
  }, []);

  const scheduleTaskReminder = useCallback(async (
    assigneeId: string,
    taskId: string,
    taskTitle: string,
    dueDate: string,
    hoursBefore: number = 24
  ) => {
    try {
      await notificationsApi.scheduleTaskDeadlineReminder(
        assigneeId,
        taskId,
        taskTitle,
        dueDate,
        hoursBefore
      );
      showToast({
        title: 'Reminder Scheduled',
        message: `Reminder set for ${hoursBefore}h before deadline`,
        type: 'success'
      });
    } catch (error) {
      console.error('Failed to schedule task reminder:', error);
    }
  }, [showToast]);

  // Project-related notifications
  const notifyProjectTeam = useCallback(async (
    projectId: string,
    title: string,
    message: string,
    actionUrl?: string
  ) => {
    try {
      await notificationsApi.notifyProjectTeam(projectId, title, message, actionUrl);
      showToast({
        title: 'Team Notified',
        message: 'All project members have been notified',
        type: 'success'
      });
    } catch (error) {
      console.error('Failed to notify project team:', error);
      showToast({
        title: 'Notification Failed',
        message: 'Failed to notify team members',
        type: 'error'
      });
    }
  }, [showToast]);

  // Chat-related notifications
  const notifyMention = useCallback(async (
    mentionedUserId: string,
    mentionedByName: string,
    context: string,
    contextId: string,
    contextType: 'task' | 'comment' | 'message'
  ) => {
    try {
      await notificationsApi.notifyMention(
        mentionedUserId,
        mentionedByName,
        context,
        contextId,
        contextType
      );
    } catch (error) {
      console.error('Failed to send mention notification:', error);
    }
  }, []);

  const notifyNewMessage = useCallback(async (
    recipientId: string,
    senderName: string,
    message: string,
    conversationId: string,
    isDirect: boolean = false
  ) => {
    try {
      await notificationsApi.createNotification({
        user_id: recipientId,
        title: isDirect ? `New message from ${senderName}` : `${senderName} in group chat`,
        message: message.substring(0, 100),
        type: 'mention',
        action_url: `/chat/${conversationId}`,
        metadata: { conversationId, senderId: currentUser?.id }
      });
    } catch (error) {
      console.error('Failed to send message notification:', error);
    }
  }, [currentUser]);

  // System notifications
  const notifySystemUpdate = useCallback(async (
    userId: string,
    title: string,
    message: string
  ) => {
    try {
      await notificationsApi.createNotification({
        user_id: userId,
        title,
        message,
        type: 'system'
      });
    } catch (error) {
      console.error('Failed to send system notification:', error);
    }
  }, []);

  const notifyAllUsers = useCallback(async (
    title: string,
    message: string,
    type: 'info' | 'warning' | 'system' = 'info'
  ) => {
    try {
      // This would need to be implemented as a server-side function
      // to avoid rate limits and ensure all users are notified
      showToast({
        title: 'Broadcasting',
        message: 'Sending notification to all users...',
        type: 'info'
      });
      
      // TODO: Implement server-side broadcast function
      console.warn('notifyAllUsers needs server-side implementation');
    } catch (error) {
      console.error('Failed to broadcast notification:', error);
    }
  }, [showToast]);

  // Deadline and reminder helpers
  const scheduleDeadlineReminders = useCallback(async (
    userId: string,
    itemId: string,
    itemTitle: string,
    itemType: 'task' | 'project',
    deadline: string
  ) => {
    try {
      // Schedule multiple reminders: 1 week, 1 day, 1 hour before
      const reminders = [
        { hours: 168, label: '1 week' },  // 7 days
        { hours: 24, label: '1 day' },
        { hours: 1, label: '1 hour' }
      ];

      for (const reminder of reminders) {
        const reminderDate = new Date(deadline);
        reminderDate.setHours(reminderDate.getHours() - reminder.hours);

        // Only schedule if in the future
        if (reminderDate > new Date()) {
          await notificationsApi.scheduleNotification({
            user_id: userId,
            title: `${itemType === 'task' ? 'Task' : 'Project'} Deadline Reminder`,
            message: `"${itemTitle}" is due in ${reminder.label}`,
            type: 'warning',
            action_url: `/${itemType === 'task' ? 'work/tasks' : 'projects'}/${itemId}`,
            metadata: { itemId, itemType, deadline },
            scheduled_for: reminderDate.toISOString()
          });
        }
      }

      showToast({
        title: 'Reminders Set',
        message: 'Deadline reminders have been scheduled',
        type: 'success'
      });
    } catch (error) {
      console.error('Failed to schedule deadline reminders:', error);
    }
  }, [showToast]);

  // Batch operations
  const notifyMultipleUsers = useCallback(async (
    userIds: string[],
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    actionUrl?: string
  ) => {
    try {
      const notifications = userIds.map(userId => ({
        user_id: userId,
        title,
        message,
        type,
        action_url: actionUrl,
        metadata: {}
      }));

      // Batch insert (would need API support)
      for (const notification of notifications) {
        await notificationsApi.createNotification(notification);
      }

      showToast({
        title: 'Notifications Sent',
        message: `Notified ${userIds.length} users`,
        type: 'success'
      });
    } catch (error) {
      console.error('Failed to notify multiple users:', error);
    }
  }, [showToast]);

  // Success/Error toast helpers
  const showSuccess = useCallback((message: string, title: string = 'Success') => {
    showToast({ title, message, type: 'success' });
  }, [showToast]);

  const showError = useCallback((message: string, title: string = 'Error') => {
    showToast({ title, message, type: 'error' });
  }, [showToast]);

  const showWarning = useCallback((message: string, title: string = 'Warning') => {
    showToast({ title, message, type: 'warning' });
  }, [showToast]);

  const showInfo = useCallback((message: string, title: string = 'Info') => {
    showToast({ title, message, type: 'info' });
  }, [showToast]);

  return {
    // Task notifications
    notifyTaskAssigned,
    notifyTaskCompleted,
    notifyTaskComment,
    scheduleTaskReminder,
    
    // Project notifications
    notifyProjectTeam,
    
    // Chat notifications
    notifyMention,
    notifyNewMessage,
    
    // System notifications
    notifySystemUpdate,
    notifyAllUsers,
    
    // Deadline reminders
    scheduleDeadlineReminders,
    
    // Batch operations
    notifyMultipleUsers,
    
    // Toast helpers
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};
