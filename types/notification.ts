export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'mention' | 'task' | 'system';
export type NotificationCategory = 'user_activity' | 'content_updates' | 'system_alerts' | 'activity_logs' | 'comments';

export interface Notification {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface NotificationPreference {
  id: string;
  title: string;
  description: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export interface NotificationSettings {
  preferences: NotificationPreference[];
  quietHours: {
    enabled: boolean;
    from: string;
    to: string;
  };
}
