import { NotificationType, NotificationCategory } from '../types/notification';

export const createNotification = (
  type: NotificationType,
  category: NotificationCategory,
  title: string,
  message: string,
  options?: {
    actionUrl?: string;
    actionLabel?: string;
    userId?: string;
    metadata?: Record<string, any>;
  }
) => {
  return {
    type,
    category,
    title,
    message,
    ...options,
  };
};

export const notificationTemplates = {
  userCreated: (userName: string) =>
    createNotification('success', 'user_activity', 'New User Added', `${userName} has been added to the system`),
  
  userUpdated: (userName: string) =>
    createNotification('info', 'user_activity', 'User Updated', `${userName}'s profile has been updated`),
  
  userDeleted: (userName: string) =>
    createNotification('warning', 'user_activity', 'User Removed', `${userName} has been removed from the system`),
  
  contentPublished: (contentType: string, title: string) =>
    createNotification('success', 'content_updates', 'Content Published', `${contentType} "${title}" has been published`),
  
  contentUpdated: (contentType: string, title: string) =>
    createNotification('info', 'content_updates', 'Content Updated', `${contentType} "${title}" has been updated`),
  
  systemAlert: (message: string) =>
    createNotification('error', 'system_alerts', 'System Alert', message),
  
  securityAlert: (message: string) =>
    createNotification('warning', 'system_alerts', 'Security Alert', message),
  
  commentReceived: (userName: string, contentTitle: string) =>
    createNotification('info', 'comments', 'New Comment', `${userName} commented on "${contentTitle}"`),
  
  mentionReceived: (userName: string, location: string) =>
    createNotification('info', 'comments', 'You were mentioned', `${userName} mentioned you in ${location}`),
};

// Request browser notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Show browser notification
export const showBrowserNotification = (title: string, options?: NotificationOptions) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    });
  }
};

// Check if quiet hours are active
export const isQuietHoursActive = (from: string, to: string): boolean => {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const [fromHour, fromMin] = from.split(':').map(Number);
  const [toHour, toMin] = to.split(':').map(Number);
  
  const fromTime = fromHour * 60 + fromMin;
  const toTime = toHour * 60 + toMin;
  
  if (fromTime < toTime) {
    return currentTime >= fromTime && currentTime < toTime;
  } else {
    // Quiet hours span midnight
    return currentTime >= fromTime || currentTime < toTime;
  }
};
