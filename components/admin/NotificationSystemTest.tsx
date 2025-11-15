import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useNotificationHelpers } from '../../hooks/useNotificationHelpers';
import { notificationsApi } from '../../utils/api';

const NotificationSystemTest: React.FC = () => {
  const { currentUser } = useAuth();
  const { notifications, unreadCount, loading } = useNotifications();
  const {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    notifyTaskAssigned,
    scheduleTaskReminder
  } = useNotificationHelpers();

  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [testLog, setTestLog] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<any>(null);
  const [scheduledNotifications, setScheduledNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (currentUser) {
      loadPreferences();
      loadScheduledNotifications();
    }
  }, [currentUser]);

  const addLog = (message: string, success: boolean = true) => {
    const timestamp = new Date().toLocaleTimeString();
    const icon = success ? '✅' : '❌';
    setTestLog(prev => [`${icon} [${timestamp}] ${message}`, ...prev]);
  };

  const updateTestResult = (testName: string, passed: boolean) => {
    setTestResults(prev => ({ ...prev, [testName]: passed }));
  };

  const loadPreferences = async () => {
    try {
      const prefs = await notificationsApi.getPreferences(currentUser!.id);
      setPreferences(prefs);
      addLog('Loaded notification preferences');
    } catch (error) {
      addLog('Failed to load preferences', false);
    }
  };

  const loadScheduledNotifications = async () => {
    try {
      const scheduled = await notificationsApi.getScheduledNotifications(currentUser!.id);
      setScheduledNotifications(scheduled);
      addLog(`Loaded ${scheduled.length} scheduled notifications`);
    } catch (error) {
      addLog('Failed to load scheduled notifications', false);
    }
  };

  // Test 1: Create notification manually
  const testCreateNotification = async () => {
    try {
      await notificationsApi.createNotification({
        user_id: currentUser!.id,
        title: 'Test Notification',
        message: 'This is a test notification created manually',
        type: 'info',
        metadata: { test: true }
      });
      addLog('✅ Test 1: Created notification manually');
      updateTestResult('create', true);
    } catch (error) {
      addLog('❌ Test 1: Failed to create notification', false);
      updateTestResult('create', false);
    }
  };

  // Test 2: Test toast notifications
  const testToastNotifications = () => {
    try {
      showSuccess('Success toast test');
      setTimeout(() => showError('Error toast test'), 1000);
      setTimeout(() => showWarning('Warning toast test'), 2000);
      setTimeout(() => showInfo('Info toast test'), 3000);
      addLog('✅ Test 2: Toast notifications triggered');
      updateTestResult('toast', true);
    } catch (error) {
      addLog('❌ Test 2: Toast notifications failed', false);
      updateTestResult('toast', false);
    }
  };

  // Test 3: Test browser notifications
  const testBrowserNotifications = async () => {
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification('Test Browser Notification', {
            body: 'This is a test browser notification',
            icon: '/favicon.ico'
          });
          addLog('✅ Test 3: Browser notification sent');
          updateTestResult('browser', true);
        } else {
          addLog('⚠️ Test 3: Browser notification permission denied', false);
          updateTestResult('browser', false);
        }
      } else {
        addLog('⚠️ Test 3: Browser notifications not supported', false);
        updateTestResult('browser', false);
      }
    } catch (error) {
      addLog('❌ Test 3: Browser notification failed', false);
      updateTestResult('browser', false);
    }
  };

  // Test 4: Test different notification types
  const testNotificationTypes = async () => {
    try {
      const types = ['info', 'success', 'warning', 'error', 'task', 'mention', 'system'];
      for (const type of types) {
        await notificationsApi.createNotification({
          user_id: currentUser!.id,
          title: `${type.toUpperCase()} Notification`,
          message: `This is a ${type} notification`,
          type: type as any
        });
      }
      addLog(`✅ Test 4: Created ${types.length} notifications of different types`);
      updateTestResult('types', true);
    } catch (error) {
      addLog('❌ Test 4: Failed to create typed notifications', false);
      updateTestResult('types', false);
    }
  };

  // Test 5: Schedule notification
  const testScheduleNotification = async () => {
    try {
      const scheduledTime = new Date();
      scheduledTime.setMinutes(scheduledTime.getMinutes() + 2); // 2 minutes from now

      await notificationsApi.scheduleNotification({
        user_id: currentUser!.id,
        title: 'Scheduled Test Notification',
        message: 'This notification was scheduled 2 minutes ago',
        type: 'info',
        scheduled_for: scheduledTime.toISOString()
      });
      addLog('✅ Test 5: Scheduled notification for 2 minutes from now');
      updateTestResult('schedule', true);
      await loadScheduledNotifications();
    } catch (error) {
      addLog('❌ Test 5: Failed to schedule notification', false);
      updateTestResult('schedule', false);
    }
  };

  // Test 6: Update preferences
  const testUpdatePreferences = async () => {
    try {
      await notificationsApi.updatePreferences(currentUser!.id, {
        task_assigned: true,
        sound_enabled: true,
        quiet_hours_enabled: false
      });
      addLog('✅ Test 6: Updated notification preferences');
      updateTestResult('preferences', true);
      await loadPreferences();
    } catch (error) {
      addLog('❌ Test 6: Failed to update preferences', false);
      updateTestResult('preferences', false);
    }
  };

  // Test 7: Test quiet hours
  const testQuietHours = async () => {
    try {
      const now = new Date();
      const startTime = `${String(now.getHours()).padStart(2, '0')}:00`;
      const endTime = `${String((now.getHours() + 1) % 24).padStart(2, '0')}:00`;

      await notificationsApi.updatePreferences(currentUser!.id, {
        quiet_hours_enabled: true,
        quiet_hours_start: startTime,
        quiet_hours_end: endTime
      });
      addLog(`✅ Test 7: Set quiet hours (${startTime} - ${endTime})`);
      updateTestResult('quietHours', true);
      await loadPreferences();
    } catch (error) {
      addLog('❌ Test 7: Failed to set quiet hours', false);
      updateTestResult('quietHours', false);
    }
  };

  // Test 8: Test task notification helper
  const testTaskNotification = async () => {
    try {
      await notifyTaskAssigned(
        currentUser!.id,
        'test-task-123',
        'Test Task Assignment',
        'Test User'
      );
      addLog('✅ Test 8: Sent task assignment notification');
      updateTestResult('taskNotify', true);
    } catch (error) {
      addLog('❌ Test 8: Failed to send task notification', false);
      updateTestResult('taskNotify', false);
    }
  };

  // Test 9: Test notification grouping
  const testNotificationGrouping = async () => {
    try {
      // Create multiple similar notifications
      for (let i = 0; i < 5; i++) {
        await notificationsApi.createNotification({
          user_id: currentUser!.id,
          title: 'Task Assigned',
          message: `Task ${i + 1} has been assigned to you`,
          type: 'task',
          metadata: { groupKey: 'task_assigned_today' }
        });
      }
      addLog('✅ Test 9: Created 5 similar notifications for grouping');
      updateTestResult('grouping', true);
    } catch (error) {
      addLog('❌ Test 9: Failed to create grouped notifications', false);
      updateTestResult('grouping', false);
    }
  };

  // Test 10: Test scheduled deadline reminder
  const testDeadlineReminder = async () => {
    try {
      const deadline = new Date();
      deadline.setHours(deadline.getHours() + 25); // 25 hours from now

      await scheduleTaskReminder(
        currentUser!.id,
        'test-task-456',
        'Test Task with Deadline',
        deadline.toISOString(),
        24
      );
      addLog('✅ Test 10: Scheduled deadline reminder (24h before)');
      updateTestResult('deadline', true);
      await loadScheduledNotifications();
    } catch (error) {
      addLog('❌ Test 10: Failed to schedule deadline reminder', false);
      updateTestResult('deadline', false);
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setTestLog([]);
    setTestResults({});
    addLog('🚀 Starting notification system tests...');

    await testCreateNotification();
    await new Promise(resolve => setTimeout(resolve, 500));

    testToastNotifications();
    await new Promise(resolve => setTimeout(resolve, 500));

    await testBrowserNotifications();
    await new Promise(resolve => setTimeout(resolve, 500));

    await testNotificationTypes();
    await new Promise(resolve => setTimeout(resolve, 500));

    await testScheduleNotification();
    await new Promise(resolve => setTimeout(resolve, 500));

    await testUpdatePreferences();
    await new Promise(resolve => setTimeout(resolve, 500));

    await testQuietHours();
    await new Promise(resolve => setTimeout(resolve, 500));

    await testTaskNotification();
    await new Promise(resolve => setTimeout(resolve, 500));

    await testNotificationGrouping();
    await new Promise(resolve => setTimeout(resolve, 500));

    await testDeadlineReminder();

    addLog('🎉 All tests completed!');
  };

  const passedTests = Object.values(testResults).filter(Boolean).length;
  const totalTests = Object.keys(testResults).length;

  if (!currentUser) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Please log in to test the notification system</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold mb-2">🔔 Notification System Test Suite</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive testing for all notification features
        </p>
      </div>

      {/* Test Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="text-3xl font-bold text-blue-600">{notifications.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Notifications</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="text-3xl font-bold text-green-600">{unreadCount}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Unread</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="text-3xl font-bold text-purple-600">{scheduledNotifications.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Scheduled</div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
          <div className="text-3xl font-bold text-orange-600">
            {totalTests > 0 ? `${passedTests}/${totalTests}` : '0/0'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Tests Passed</div>
        </div>
      </div>

      {/* Test Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Test Controls</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <button
            onClick={runAllTests}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            🚀 Run All Tests
          </button>
          <button
            onClick={testCreateNotification}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            1. Create
          </button>
          <button
            onClick={testToastNotifications}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            2. Toast
          </button>
          <button
            onClick={testBrowserNotifications}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            3. Browser
          </button>
          <button
            onClick={testNotificationTypes}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            4. Types
          </button>
          <button
            onClick={testScheduleNotification}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            5. Schedule
          </button>
          <button
            onClick={testUpdatePreferences}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            6. Preferences
          </button>
          <button
            onClick={testQuietHours}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            7. Quiet Hours
          </button>
          <button
            onClick={testTaskNotification}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            8. Task Notify
          </button>
          <button
            onClick={testNotificationGrouping}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            9. Grouping
          </button>
        </div>
      </div>

      {/* Test Log */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Test Log</h2>
        <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
          {testLog.length === 0 ? (
            <div className="text-gray-500">No tests run yet. Click "Run All Tests" to start.</div>
          ) : (
            testLog.map((log, index) => (
              <div key={index} className="mb-1">
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Current Preferences */}
      {preferences && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Current Preferences</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Push:</span>{' '}
              {preferences.push_enabled ? '✅' : '❌'}
            </div>
            <div>
              <span className="font-medium">Email:</span>{' '}
              {preferences.email_enabled ? '✅' : '❌'}
            </div>
            <div>
              <span className="font-medium">Sound:</span>{' '}
              {preferences.sound_enabled ? '✅' : '❌'}
            </div>
            <div>
              <span className="font-medium">Quiet Hours:</span>{' '}
              {preferences.quiet_hours_enabled ? '✅' : '❌'}
            </div>
            {preferences.quiet_hours_enabled && (
              <>
                <div className="col-span-2">
                  <span className="font-medium">Quiet Hours:</span>{' '}
                  {preferences.quiet_hours_start} - {preferences.quiet_hours_end}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Scheduled Notifications */}
      {scheduledNotifications.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Scheduled Notifications</h2>
          <div className="space-y-2">
            {scheduledNotifications.map((notif) => (
              <div
                key={notif.id}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">{notif.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {notif.message}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(notif.scheduled_for).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">📋 Testing Instructions</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Click "Run All Tests" to execute all tests automatically</li>
          <li>Check the test log for results</li>
          <li>Open the NotificationCenter (bell icon) to see created notifications</li>
          <li>Test filtering by type and read/unread status</li>
          <li>Test marking notifications as read/unread</li>
          <li>Test deleting notifications</li>
          <li>Check browser console for real-time subscription status</li>
          <li>Wait 2 minutes to verify scheduled notification delivery</li>
          <li>Open notification preferences to test the settings UI</li>
          <li>Test quiet hours by setting them to current time</li>
        </ol>
      </div>
    </div>
  );
};

export default NotificationSystemTest;
