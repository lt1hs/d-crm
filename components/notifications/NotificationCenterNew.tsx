import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { notificationsApi } from '../../utils/api/notifications';
import { IconBell, IconCheck, IconTrash, IconX, IconSettings } from '../Icons';

const NotificationCenterNew: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
    addNotification,
    refreshNotifications
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showPreferences, setShowPreferences] = useState(false);
  const [lastNotificationCount, setLastNotificationCount] = useState(0);

  // Debug: Log when notifications change
  useEffect(() => {
    console.log('🔔 NotificationCenter notifications updated:', notifications.length, 'total');
    notifications.forEach(n => console.log('  -', n.id, n.title, n.read ? '(read)' : '(unread)'));
  }, [notifications]);

  // Request notification permission when opening the center
  useEffect(() => {
    if (isOpen) {
      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [isOpen]);

  // Show browser notification for new notifications
  useEffect(() => {
    if (notifications.length > lastNotificationCount && lastNotificationCount > 0) {
      const newNotifications = notifications.slice(0, notifications.length - lastNotificationCount);
      newNotifications.forEach(notification => {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico',
            tag: notification.id // Prevents duplicate notifications
          });
        }

        // Play sound if available
        if ('Audio' in window) {
          try {
            const audio = new Audio('/notification.mp3');
            audio.volume = 0.3;
            audio.play().catch(() => {
              // Sound failed, but that's ok
            });
          } catch {
            // Sound not available
          }
        }
      });
    }
    setLastNotificationCount(notifications.length);
  }, [notifications.length, lastNotificationCount]);

  // Safe date formatting - completely new implementation
  const safeFormatDate = (dateValue: any): string => {
    try {
      if (!dateValue) return 'just now';
      const d = new Date(dateValue);
      if (isNaN(d.getTime())) return 'just now';
      
      const now = new Date();
      const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);
      
      if (seconds < 60) return 'just now';
      if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
      if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
      if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
      return `${Math.floor(seconds / 604800)}w ago`;
    } catch {
      return 'just now';
    }
  };

  // Filter notifications
  const filteredNotifications = notifications
    .filter(n => filter === 'all' || !n.read)
    .filter(n => typeFilter === 'all' || n.type === typeFilter);

  console.log('📊 NotificationCenter state:', {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    filtered: filteredNotifications.length,
    filter,
    typeFilter,
    allNotifications: notifications.map(n => ({ id: n.id, title: n.title, read: n.read, type: n.type }))
  });

  // Temporary: Show all notifications for debugging
  const displayNotifications = notifications; // Temporarily show all

  // Debug: Log notifications when they change
  if (filteredNotifications.length > 0) {
    console.log('📋 Filtered notifications:', filteredNotifications.map(n => ({
      id: n.id,
      title: n.title,
      read: n.read,
      type: n.type
    })));
  }

  // Get unique notification types
  const notificationTypes = Array.from(new Set(notifications.map(n => n.type)));

  const getIcon = (type: string) => {
    const icons: Record<string, string> = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      task: '📋',
      mention: '💬',
      system: '⚙️'
    };
    return icons[type] || 'ℹ️';
  };

  const getColors = (type: string) => {
    const colors: Record<string, string> = {
      success: 'bg-green-50 dark:bg-green-900/10 border-l-green-500',
      error: 'bg-red-50 dark:bg-red-900/10 border-l-red-500',
      warning: 'bg-yellow-50 dark:bg-yellow-900/10 border-l-yellow-500',
      task: 'bg-blue-50 dark:bg-blue-900/10 border-l-blue-500',
      mention: 'bg-purple-50 dark:bg-purple-900/10 border-l-purple-500'
    };
    return colors[type] || 'bg-gray-50 dark:bg-gray-800 border-l-gray-500';
  };

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <IconBell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 mt-2 w-96 max-h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border dark:border-gray-700 z-50 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b dark:border-gray-700">
               <div className="flex items-center justify-between mb-3">
                 <h3 className="text-lg font-semibold">Notifications</h3>
                 <div className="flex gap-1">
                   <button
                     type="button"
                     onClick={() => {
                       console.log('🔄 Header refresh button clicked');
                       refreshNotifications();
                     }}
                     className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                     aria-label="Refresh"
                     title="Refresh notifications"
                   >
                     🔄
                   </button>
                   <button
                     type="button"
                     onClick={() => setIsOpen(false)}
                     className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                     aria-label="Close"
                   >
                     <IconX className="w-5 h-5" />
                   </button>
                 </div>
               </div>

                {/* Test Buttons */}
                <div className="mb-2 flex gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        console.log('Testing notification creation...');
                        await notificationsApi.createNotification({
                          user_id: currentUser!.id,
                          title: 'Test Notification',
                          message: 'This is a test notification created at ' + new Date().toLocaleTimeString(),
                          type: 'info'
                        });
                        console.log('Test notification created');
                      } catch (error) {
                        console.error('Failed to create test notification:', error);
                      }
                    }}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Create Test Notification
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      console.log('🔄 Manual refresh clicked');
                      refreshNotifications();
                    }}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Refresh
                  </button>
                </div>

               {/* Filter Tabs */}
               <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                   All ({displayNotifications.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('unread')}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'unread'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              {/* Type Filter */}
              {notificationTypes.length > 1 && (
                <div className="flex gap-1 overflow-x-auto pb-2">
                  <button
                    type="button"
                    onClick={() => setTypeFilter('all')}
                    className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                      typeFilter === 'all'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    All
                  </button>
                  {notificationTypes.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTypeFilter(type)}
                      className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                        typeFilter === type
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {getIcon(type)} {type}
                    </button>
                  ))}
                </div>
              )}

              {/* Actions */}
              {notifications.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50"
                    >
                      <IconCheck className="w-3 h-3" />
                      Mark all read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={deleteAllRead}
                    className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <IconTrash className="w-3 h-3" />
                    Clear read
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPreferences(true);
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ml-auto"
                  >
                    <IconSettings className="w-3 h-3" />
                    Settings
                  </button>
                </div>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2" />
                  <p className="text-sm">Loading...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <IconBell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">
                    {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                  </p>
                </div>
              ) : (
                <div className="divide-y dark:divide-gray-700">
                  {displayNotifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-l-4 ${getColors(notification.type)} ${
                        !notification.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0">{getIcon(notification.type)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-sm">{notification.title}</h4>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                             <span className="text-xs text-gray-500 dark:text-gray-400">
                               {safeFormatDate(notification.timestamp)}
                             </span>
                            <div className="flex gap-1">
                              {!notification.read && (
                                <button
                                  type="button"
                                  onClick={() => markAsRead(notification.id)}
                                  className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
                                  aria-label="Mark as read"
                                  title="Mark as read"
                                >
                                  <IconCheck className="w-4 h-4" />
                                </button>
                              )}
                               <button
                                 type="button"
                                 onClick={() => {
                                   console.log('Deleting notification:', notification.id);
                                   deleteNotification(notification.id);
                                 }}
                                 className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                                 aria-label="Delete"
                                 title="Delete"
                               >
                                 <IconTrash className="w-4 h-4" />
                               </button>
                            </div>
                          </div>
                           {notification.actionUrl && (
                             <a
                               href={notification.actionUrl}
                              className="inline-block mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                              onClick={() => {
                                markAsRead(notification.id);
                                setIsOpen(false);
                              }}
                            >
                              View →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Notification Settings</h2>
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                aria-label="Close"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-500">Notification preferences will be loaded here</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenterNew;
