import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { notificationsApi } from '../../utils/api';
import { IconBell, IconMail, IconVolume, IconMoon, IconClock } from '../Icons';

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

const NotificationPreferences: React.FC = () => {
  const { currentUser } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadPreferences();
  }, [currentUser]);

  const loadPreferences = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const data = await notificationsApi.getPreferences(currentUser.id);
      setPreferences(data);
    } catch (error) {
      console.error('Failed to load preferences:', error);
      showMessage('error', 'Failed to load notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!currentUser || !preferences) return;

    try {
      setSaving(true);
      await notificationsApi.updatePreferences(currentUser.id, preferences);
      showMessage('success', 'Preferences saved successfully');
    } catch (error) {
      console.error('Failed to save preferences:', error);
      showMessage('error', 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const updatePreference = (key: keyof NotificationPreferences, value: any) => {
    if (!preferences) return;
    setPreferences({ ...preferences, [key]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Failed to load notification preferences</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Notification Preferences</h2>
        <button
          type="button"
          onClick={savePreferences}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
        }`}>
          {message.text}
        </div>
      )}

      {/* Notification Channels */}
      <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <IconBell className="w-5 h-5" />
          Notification Channels
        </h3>
        <div className="space-y-3">
          <ToggleOption
            label="Push Notifications"
            description="Receive notifications in your browser"
            checked={preferences.push_enabled}
            onChange={(checked) => updatePreference('push_enabled', checked)}
            icon={<IconBell className="w-5 h-5" />}
          />
          <ToggleOption
            label="Email Notifications"
            description="Receive notifications via email"
            checked={preferences.email_enabled}
            onChange={(checked) => updatePreference('email_enabled', checked)}
            icon={<IconMail className="w-5 h-5" />}
          />
          <ToggleOption
            label="Browser Notifications"
            description="Show desktop notifications"
            checked={preferences.browser_enabled}
            onChange={(checked) => updatePreference('browser_enabled', checked)}
            icon={<IconBell className="w-5 h-5" />}
          />
          <ToggleOption
            label="Sound Alerts"
            description="Play sound when receiving notifications"
            checked={preferences.sound_enabled}
            onChange={(checked) => updatePreference('sound_enabled', checked)}
            icon={<IconVolume className="w-5 h-5" />}
          />
        </div>
      </section>

      {/* Task Notifications */}
      <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">📋 Task Notifications</h3>
        <div className="space-y-3">
          <ToggleOption
            label="Task Assigned"
            description="When a task is assigned to you"
            checked={preferences.task_assigned}
            onChange={(checked) => updatePreference('task_assigned', checked)}
          />
          <ToggleOption
            label="Task Completed"
            description="When a task you created is completed"
            checked={preferences.task_completed}
            onChange={(checked) => updatePreference('task_completed', checked)}
          />
          <ToggleOption
            label="Task Commented"
            description="When someone comments on your task"
            checked={preferences.task_commented}
            onChange={(checked) => updatePreference('task_commented', checked)}
          />
          <ToggleOption
            label="Task Due Soon"
            description="Reminders for upcoming task deadlines"
            checked={preferences.task_due_soon}
            onChange={(checked) => updatePreference('task_due_soon', checked)}
          />
          <ToggleOption
            label="Task Overdue"
            description="Alerts for overdue tasks"
            checked={preferences.task_overdue}
            onChange={(checked) => updatePreference('task_overdue', checked)}
          />
        </div>
      </section>

      {/* Chat & Mentions */}
      <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">💬 Chat & Mentions</h3>
        <div className="space-y-3">
          <ToggleOption
            label="Chat Messages"
            description="New messages in group chats"
            checked={preferences.chat_messages}
            onChange={(checked) => updatePreference('chat_messages', checked)}
          />
          <ToggleOption
            label="Direct Messages"
            description="New direct messages"
            checked={preferences.direct_messages}
            onChange={(checked) => updatePreference('direct_messages', checked)}
          />
          <ToggleOption
            label="Mentions in Chat"
            description="When someone mentions you in chat"
            checked={preferences.mention_in_chat}
            onChange={(checked) => updatePreference('mention_in_chat', checked)}
          />
          <ToggleOption
            label="Mentions in Comments"
            description="When someone mentions you in a comment"
            checked={preferences.mention_in_comment}
            onChange={(checked) => updatePreference('mention_in_comment', checked)}
          />
        </div>
      </section>

      {/* Project Notifications */}
      <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">📁 Project Notifications</h3>
        <div className="space-y-3">
          <ToggleOption
            label="Project Updates"
            description="Updates on projects you're part of"
            checked={preferences.project_updates}
            onChange={(checked) => updatePreference('project_updates', checked)}
          />
          <ToggleOption
            label="Project Deadlines"
            description="Reminders for project deadlines"
            checked={preferences.project_deadline}
            onChange={(checked) => updatePreference('project_deadline', checked)}
          />
        </div>
      </section>

      {/* Quiet Hours */}
      <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <IconMoon className="w-5 h-5" />
          Quiet Hours
        </h3>
        <div className="space-y-4">
          <ToggleOption
            label="Enable Quiet Hours"
            description="Pause notifications during specific hours"
            checked={preferences.quiet_hours_enabled}
            onChange={(checked) => updatePreference('quiet_hours_enabled', checked)}
          />
          {preferences.quiet_hours_enabled && (
            <div className="grid grid-cols-2 gap-4 pl-8">
              <div>
                <label htmlFor="quiet-hours-start" className="block text-sm font-medium mb-1">Start Time</label>
                <input
                  id="quiet-hours-start"
                  type="time"
                  value={preferences.quiet_hours_start}
                  onChange={(e) => updatePreference('quiet_hours_start', e.target.value)}
                  className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  aria-label="Quiet hours start time"
                />
              </div>
              <div>
                <label htmlFor="quiet-hours-end" className="block text-sm font-medium mb-1">End Time</label>
                <input
                  id="quiet-hours-end"
                  type="time"
                  value={preferences.quiet_hours_end}
                  onChange={(e) => updatePreference('quiet_hours_end', e.target.value)}
                  className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  aria-label="Quiet hours end time"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Digest Settings */}
      <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <IconClock className="w-5 h-5" />
          Notification Digest
        </h3>
        <div className="space-y-4">
          <ToggleOption
            label="Daily Digest"
            description="Receive a daily summary of notifications"
            checked={preferences.daily_digest_enabled}
            onChange={(checked) => updatePreference('daily_digest_enabled', checked)}
          />
          {preferences.daily_digest_enabled && (
            <div className="pl-8">
              <label htmlFor="daily-digest-time" className="block text-sm font-medium mb-1">Delivery Time</label>
              <input
                id="daily-digest-time"
                type="time"
                value={preferences.daily_digest_time}
                onChange={(e) => updatePreference('daily_digest_time', e.target.value)}
                className="w-full max-w-xs px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                aria-label="Daily digest delivery time"
              />
            </div>
          )}
          
          <ToggleOption
            label="Weekly Digest"
            description="Receive a weekly summary of notifications"
            checked={preferences.weekly_digest_enabled}
            onChange={(checked) => updatePreference('weekly_digest_enabled', checked)}
          />
          {preferences.weekly_digest_enabled && (
            <div className="pl-8">
              <label htmlFor="weekly-digest-day" className="block text-sm font-medium mb-1">Delivery Day</label>
              <select
                id="weekly-digest-day"
                value={preferences.weekly_digest_day}
                onChange={(e) => updatePreference('weekly_digest_day', parseInt(e.target.value))}
                className="w-full max-w-xs px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                aria-label="Weekly digest delivery day"
              >
                <option value={1}>Monday</option>
                <option value={2}>Tuesday</option>
                <option value={3}>Wednesday</option>
                <option value={4}>Thursday</option>
                <option value={5}>Friday</option>
                <option value={6}>Saturday</option>
                <option value={0}>Sunday</option>
              </select>
            </div>
          )}
        </div>
      </section>

      {/* System Notifications */}
      <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">⚙️ System Notifications</h3>
        <div className="space-y-3">
          <ToggleOption
            label="System Updates"
            description="Important system announcements and updates"
            checked={preferences.system_updates}
            onChange={(checked) => updatePreference('system_updates', checked)}
          />
        </div>
      </section>
    </div>
  );
};

// Toggle Option Component
interface ToggleOptionProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: React.ReactNode;
}

const ToggleOption: React.FC<ToggleOptionProps> = ({ label, description, checked, onChange, icon }) => {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
      <div className="flex items-start gap-3 flex-1">
        {icon && <div className="text-gray-500 dark:text-gray-400 mt-0.5">{icon}</div>}
        <div className="flex-1">
          <div className="font-medium">{label}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{description}</div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
        }`}
        aria-label={`Toggle ${label}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

export default NotificationPreferences;
