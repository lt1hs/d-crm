import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { notificationTemplates } from '../utils/notificationHelpers';

/**
 * Hook to integrate notifications with activity logging
 * Automatically creates notifications based on user activities
 */
export const useNotificationIntegration = () => {
  const { currentUser } = useAuth();
  const { addNotification, showToast } = useNotifications();

  // You can extend this to listen to specific events
  // For now, it provides helper functions to create notifications

  const notifyUserAction = (action: 'created' | 'updated' | 'deleted', userName: string) => {
    let notification;
    switch (action) {
      case 'created':
        notification = notificationTemplates.userCreated(userName);
        showToast('success', `User ${userName} has been added`);
        break;
      case 'updated':
        notification = notificationTemplates.userUpdated(userName);
        showToast('info', `User ${userName} has been updated`);
        break;
      case 'deleted':
        notification = notificationTemplates.userDeleted(userName);
        showToast('warning', `User ${userName} has been removed`);
        break;
    }
    addNotification(notification);
  };

  const notifyContentAction = (
    action: 'published' | 'updated',
    contentType: string,
    title: string
  ) => {
    const notification =
      action === 'published'
        ? notificationTemplates.contentPublished(contentType, title)
        : notificationTemplates.contentUpdated(contentType, title);
    
    addNotification(notification);
    showToast(action === 'published' ? 'success' : 'info', notification.message);
  };

  const notifySystemAlert = (message: string, isSecurityAlert: boolean = false) => {
    const notification = isSecurityAlert
      ? notificationTemplates.securityAlert(message)
      : notificationTemplates.systemAlert(message);
    
    addNotification(notification);
    showToast(isSecurityAlert ? 'warning' : 'error', message);
  };

  const notifyComment = (userName: string, contentTitle: string) => {
    const notification = notificationTemplates.commentReceived(userName, contentTitle);
    addNotification(notification);
    showToast('info', notification.message);
  };

  const notifyMention = (userName: string, location: string) => {
    const notification = notificationTemplates.mentionReceived(userName, location);
    addNotification(notification);
    showToast('info', notification.message);
  };

  return {
    notifyUserAction,
    notifyContentAction,
    notifySystemAlert,
    notifyComment,
    notifyMention,
    addNotification,
    showToast,
  };
};
