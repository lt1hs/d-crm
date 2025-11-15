import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { IconBell, IconMessageCircle, IconSettings } from '../../Icons';

interface NotificationPreference {
  id: string;
  title: string;
  description: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
}

const WorkNotificationSettings: React.FC = () => {
  const { logActivity } = useAuth();
  const [notifications, setNotifications] = useState<NotificationPreference[]>([
    {
      id: 'task_updates',
      title: 'Task Updates',
      description: 'Get notified when tasks are assigned or updated',
      email: true,
      push: true,
      inApp: true,
    },
    {
      id: 'project_activity',
      title: 'Project Activity',
      description: 'Notifications about project changes and milestones',
      email: true,
      push: false,
      inApp: true,
    },
    {
      id: 'team_mentions',
      title: 'Team Mentions',
      description: 'When someone mentions you in comments or discussions',
      email: true,
      push: true,
      inApp: true,
    },
    {
      id: 'deadline_reminders',
      title: 'Deadline Reminders',
      description: 'Reminders for upcoming task and project deadlines',
      email: true,
      push: true,
      inApp: true,
    },
    {
      id: 'time_tracking',
      title: 'Time Tracking',
      description: 'Notifications about time entries and reports',
      email: false,
      push: false,
      inApp: true,
    },
  ]);

  const handleToggle = (id: string, type: 'email' | 'push' | 'inApp') => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, [type]: !notif[type] } : notif
      )
    );
    logActivity('update', 'notifications', undefined, `Toggled ${type} for ${id}`);
  };

  const handleToggleAll = (type: 'email' | 'push' | 'inApp', value: boolean) => {
    setNotifications(notifications.map((notif) => ({ ...notif, [type]: value })));
    logActivity('update', 'notifications', undefined, `Set all ${type} to ${value}`);
  };

  return (
    <div className="space-y-8">
      {/* Notification Channels */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Notification Channels</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <IconSettings className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium">Email</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Receive notifications via email
            </p>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <IconBell className="w-5 h-5 text-green-600" />
              <h4 className="font-medium">Push</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Browser push notifications
            </p>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <IconMessageCircle className="w-5 h-5 text-purple-600" />
              <h4 className="font-medium">In-App</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Notifications within the app
            </p>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Notification Preferences</h3>
          <div className="flex gap-2">
            <button
              onClick={() => handleToggleAll('email', true)}
              className="text-xs px-3 py-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
              type="button"
            >
              Enable All
            </button>
            <button
              onClick={() => handleToggleAll('email', false)}
              className="text-xs px-3 py-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              type="button"
            >
              Disable All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Notification Type</th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase">Email</th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase">Push</th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase">In-App</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map((notif) => (
                <tr key={notif.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-4">
                    <div>
                      <div className="font-medium">{notif.title}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{notif.description}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => handleToggle(notif.id, 'email')}
                      className={`
                        relative w-12 h-6 rounded-full transition-colors inline-block
                        ${notif.email ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}
                      `}
                      type="button"
                      aria-label={`Toggle email notifications for ${notif.title}`}
                    >
                      <div
                        className={`
                          absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform
                          ${notif.email ? 'translate-x-6' : 'translate-x-0.5'}
                        `}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => handleToggle(notif.id, 'push')}
                      className={`
                        relative w-12 h-6 rounded-full transition-colors inline-block
                        ${notif.push ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}
                      `}
                      type="button"
                      aria-label={`Toggle push notifications for ${notif.title}`}
                    >
                      <div
                        className={`
                          absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform
                          ${notif.push ? 'translate-x-6' : 'translate-x-0.5'}
                        `}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => handleToggle(notif.id, 'inApp')}
                      className={`
                        relative w-12 h-6 rounded-full transition-colors inline-block
                        ${notif.inApp ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}
                      `}
                      type="button"
                      aria-label={`Toggle in-app notifications for ${notif.title}`}
                    >
                      <div
                        className={`
                          absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform
                          ${notif.inApp ? 'translate-x-6' : 'translate-x-0.5'}
                        `}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quiet Hours */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
        <h3 className="text-lg font-semibold mb-4">Quiet Hours</h3>
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex items-start gap-3">
            <input 
              type="checkbox" 
              className="mt-1" 
              id="quiet-hours-toggle"
              aria-label="Enable quiet hours"
            />
            <div className="flex-1">
              <label htmlFor="quiet-hours-toggle" className="font-medium cursor-pointer">
                Enable Quiet Hours
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Pause non-urgent notifications during specific hours
              </p>
              <div className="flex gap-4 mt-3">
                <div>
                  <label htmlFor="quiet-hours-from" className="block text-xs font-medium mb-1">
                    From
                  </label>
                  <input
                    id="quiet-hours-from"
                    type="time"
                    defaultValue="22:00"
                    className="px-3 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm"
                    aria-label="Quiet hours start time"
                  />
                </div>
                <div>
                  <label htmlFor="quiet-hours-to" className="block text-xs font-medium mb-1">
                    To
                  </label>
                  <input
                    id="quiet-hours-to"
                    type="time"
                    defaultValue="08:00"
                    className="px-3 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm"
                    aria-label="Quiet hours end time"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => logActivity('update', 'notifications', undefined, 'Saved notification preferences')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          type="button"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default WorkNotificationSettings;
