import React from 'react';
import { useNotificationIntegration } from '../hooks/useNotificationIntegration';
import { IconBell } from './Icons';

/**
 * Demo component showing how to use the notification system
 * This can be removed or used as a reference
 */
const NotificationDemo: React.FC = () => {
  const {
    notifyUserAction,
    notifyContentAction,
    notifySystemAlert,
    notifyComment,
    notifyMention,
    showToast,
  } = useNotificationIntegration();

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex items-center gap-3 mb-6">
        <IconBell className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Notification System Demo</h2>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">User Actions</h3>
          <div className="flex gap-2">
            <button
              onClick={() => notifyUserAction('created', 'John Doe')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              type="button"
            >
              User Created
            </button>
            <button
              onClick={() => notifyUserAction('updated', 'Jane Smith')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              type="button"
            >
              User Updated
            </button>
            <button
              onClick={() => notifyUserAction('deleted', 'Bob Wilson')}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              type="button"
            >
              User Deleted
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Content Actions</h3>
          <div className="flex gap-2">
            <button
              onClick={() => notifyContentAction('published', 'Article', 'New Feature Release')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              type="button"
            >
              Content Published
            </button>
            <button
              onClick={() => notifyContentAction('updated', 'Video', 'Tutorial Series')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              type="button"
            >
              Content Updated
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">System Alerts</h3>
          <div className="flex gap-2">
            <button
              onClick={() => notifySystemAlert('System maintenance scheduled', false)}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              type="button"
            >
              System Alert
            </button>
            <button
              onClick={() => notifySystemAlert('Unusual login activity detected', true)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              type="button"
            >
              Security Alert
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Social Notifications</h3>
          <div className="flex gap-2">
            <button
              onClick={() => notifyComment('Alice', 'Getting Started Guide')}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              type="button"
            >
              New Comment
            </button>
            <button
              onClick={() => notifyMention('Charlie', 'Project Discussion')}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              type="button"
            >
              Mention
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Toast Notifications</h3>
          <div className="flex gap-2">
            <button
              onClick={() => showToast('success', 'Operation completed successfully!')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              type="button"
            >
              Success Toast
            </button>
            <button
              onClick={() => showToast('info', 'Here is some information')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              type="button"
            >
              Info Toast
            </button>
            <button
              onClick={() => showToast('warning', 'Please be careful!')}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              type="button"
            >
              Warning Toast
            </button>
            <button
              onClick={() => showToast('error', 'Something went wrong!')}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              type="button"
            >
              Error Toast
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Usage Example:</h4>
        <pre className="text-sm text-blue-800 dark:text-blue-200 overflow-x-auto">
{`import { useNotificationIntegration } from '../hooks/useNotificationIntegration';

const MyComponent = () => {
  const { notifyUserAction, showToast } = useNotificationIntegration();
  
  const handleUserCreate = () => {
    // Your logic here
    notifyUserAction('created', 'John Doe');
  };
  
  return <button onClick={handleUserCreate}>Create User</button>;
};`}
        </pre>
      </div>
    </div>
  );
};

export default NotificationDemo;
