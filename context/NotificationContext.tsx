import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Notification, NotificationType } from '../types/notification';
import { useAuth } from './AuthContext';
import { supabase } from '../config/supabase';
import { notificationsApi } from '../utils/api/notifications';

interface ToastOptions {
  title?: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => string;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  showToast: (typeOrOptions: NotificationType | ToastOptions, message?: string, duration?: number) => void;
  deleteNotification: (id: string) => void;
  deleteAllRead: () => void;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const STORAGE_KEY = 'notifications';
const MAX_NOTIFICATIONS = 100;

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth() || {};
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from database and localStorage on mount
  useEffect(() => {
    const loadNotifications = async () => {
      if (!currentUser?.id) return;

      try {
        // Load from database first
        const dbNotifications = await notificationsApi.getNotifications(currentUser.id, 50);
        const formattedNotifications: Notification[] = dbNotifications.map((n: any) => ({
          id: n.id,
          type: n.type,
          category: 'system_alerts', // Default category
          title: n.title,
          message: n.message,
          timestamp: new Date(n.created_at),
          read: n.read || false,
          actionUrl: n.action_url,
          userId: n.user_id,
          metadata: n.metadata || {}
        }));

        setNotifications(formattedNotifications);

        // Also try to load from localStorage as backup
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const notificationsWithDates = parsed.map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp)
          }));
          // Merge with database notifications, preferring database
          const merged = [...formattedNotifications];
          notificationsWithDates.forEach(localNotif => {
            if (!merged.find(dbNotif => dbNotif.id === localNotif.id)) {
              merged.push(localNotif);
            }
          });
          setNotifications(merged);
        }
      } catch (error) {
        console.error('Failed to load notifications from database:', error);
        // Fallback to localStorage
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            const notificationsWithDates = parsed.map((n: any) => ({
              ...n,
              timestamp: new Date(n.timestamp)
            }));
            setNotifications(notificationsWithDates);
          }
        } catch (localError) {
          console.error('Failed to load notifications from localStorage:', localError);
        }
      }
    };

    loadNotifications();
  }, [currentUser?.id]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Failed to save notifications to localStorage:', error);
    }
  }, [notifications]);

  // Subscribe to realtime notifications
  useEffect(() => {
    if (!currentUser?.id) {
      console.log('🔔 Waiting for currentUser before setting up notifications...');
      return;
    }

    console.log('🔔 Setting up notification realtime subscription for user:', currentUser.id);
    // Temporarily disabled to debug
    return;

    const channel = supabase
      .channel(`user-notifications-${currentUser.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${currentUser.id}`
        },
        (payload) => {
          console.log('🔔 New notification received via realtime:', payload.new);
          const dbNotification = payload.new as any;
          const newNotification: Notification = {
            id: dbNotification.id,
            type: dbNotification.type,
            category: 'system_alerts',
            title: dbNotification.title,
            message: dbNotification.message,
            timestamp: new Date(dbNotification.created_at),
            read: dbNotification.read || false,
            actionUrl: dbNotification.action_url,
            userId: dbNotification.user_id,
            metadata: dbNotification.metadata || {}
          };

          setNotifications(prev => [newNotification, ...prev]);
        }
      )
      // Temporarily disabled UPDATE handler to debug
      /*
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${currentUser.id}`
        },
        (payload) => {
          console.log('🔔 Notification updated via realtime:', payload.new);
          const updatedNotification = payload.new as any;
          console.log('📖 Realtime marking notification as read:', updatedNotification.id, updatedNotification.read);
          setNotifications(prev =>
            prev.map(n =>
              n.id === updatedNotification.id
                ? { ...n, read: updatedNotification.read }
                : n
            )
          );
        }
      )
      */
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${currentUser.id}`
        },
        (payload) => {
          console.log('🔔 Notification deleted via realtime:', payload.old);
          const deletedId = (payload.old as any).id;
          setNotifications(prev => prev.filter(n => n.id !== deletedId));
        }
      )
      .subscribe((status, err) => {
        console.log('📡 Notification subscription status:', status, err);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to notification realtime');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Notification realtime subscription failed:', err);
        }
      });

    return () => {
      console.log('🔌 Unsubscribing from notifications');
      channel.unsubscribe();
    };
  }, [currentUser?.id]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 11);
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      // Keep only the most recent MAX_NOTIFICATIONS
      return updated.slice(0, MAX_NOTIFICATIONS);
    });

    return id;
  }, []);

  const markAsRead = useCallback((id: string) => {
    console.log('📖 Marking notification as read:', id);
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    console.log('📖 Marking ALL notifications as read');
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const deleteNotification = useCallback(async (id: string) => {
    console.log('🗑️ Deleting notification:', id);
    try {
      await notificationsApi.deleteNotification(id);
      console.log('✅ Notification deleted from database');
      removeNotification(id);
    } catch (error) {
      console.error('❌ Failed to delete notification from database:', error);
      // Still remove from local state as fallback
      console.log('🔄 Removing from local state as fallback');
      removeNotification(id);
    }
  }, [removeNotification]);

  const deleteAllRead = useCallback(() => {
    setNotifications(prev => prev.filter(n => !n.read));
  }, []);

  const refreshNotifications = useCallback(async () => {
    if (!currentUser?.id) return;

    console.log('🔄 Refreshing notifications from database...');
    try {
      const dbNotifications = await notificationsApi.getNotifications(currentUser.id, 50);
      console.log('📥 Loaded', dbNotifications.length, 'notifications from database');

      const formattedNotifications: Notification[] = dbNotifications.map((n: any) => ({
        id: n.id,
        type: n.type,
        category: 'system_alerts',
        title: n.title,
        message: n.message,
        timestamp: new Date(n.created_at),
        read: n.read || false,
        actionUrl: n.action_url,
        userId: n.user_id,
        metadata: n.metadata || {}
      }));

      setNotifications(formattedNotifications);
      console.log('✅ Notifications refreshed successfully');
    } catch (error) {
      console.error('❌ Failed to refresh notifications:', error);
    }
  }, [currentUser?.id]);

  const showToast = useCallback((typeOrOptions: NotificationType | ToastOptions, message?: string, duration: number = 5000) => {
    let toastOptions: ToastOptions;

    if (typeof typeOrOptions === 'string') {
      // Called as showToast(type, message, duration)
      toastOptions = {
        type: typeOrOptions,
        message: message || '',
        duration
      };
    } else {
      // Called as showToast({ title, message, type, duration })
      toastOptions = typeOrOptions;
    }

    const toastNotification: Omit<Notification, 'id' | 'timestamp' | 'read'> = {
      type: toastOptions.type,
      category: 'system_alerts', // Default category for toasts
      title: toastOptions.title || toastOptions.type.charAt(0).toUpperCase() + toastOptions.type.slice(1),
      message: toastOptions.message,
    };

    const toastId = addNotification(toastNotification);

    // Auto-remove toast after duration
    setTimeout(() => {
      removeNotification(toastId);
    }, toastOptions.duration || 5000);
  }, [addNotification, removeNotification]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    loading: false,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    showToast,
    deleteNotification,
    deleteAllRead,
    refreshNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};