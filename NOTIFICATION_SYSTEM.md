# Notification System Documentation

## Overview

The notification system provides a comprehensive solution for managing in-app notifications, toast messages, and user notification preferences. It includes:

- **In-app notification center** with unread badges
- **Toast notifications** for quick feedback
- **Notification preferences** management
- **Notification templates** for common actions
- **Integration hooks** for easy usage

## Components

### 1. NotificationCenter (`components/NotificationCenter.tsx`)

A dropdown notification panel accessible from the header that displays all notifications.

**Features:**
- Unread count badge
- Filter by all/unread
- Mark as read/Mark all as read
- Remove individual notifications
- Clear all notifications
- Timestamp formatting (e.g., "2m ago", "3h ago")
- Notification type indicators (success, error, warning, info)

### 2. NotificationSettings (`components/admin/settings/NotificationSettings.tsx`)

User settings page for managing notification preferences.

**Features:**
- Toggle notifications by channel (Email, Push, In-App)
- Category-based preferences (User Activity, Content Updates, System Alerts, etc.)
- Quiet hours configuration
- Bulk enable/disable options

### 3. NotificationProvider (`context/NotificationContext.tsx`)

React context provider that manages notification state.

**API:**
```typescript
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  showToast: (type, message, duration?) => void;
}
```

## Usage

### Basic Setup

The notification system is already integrated into the app. It's wrapped around the entire application in `App.tsx`:

```tsx
<AuthProvider>
  <NotificationProvider>
    <AppContent />
  </NotificationProvider>
</AuthProvider>
```

### Using Notifications in Components

#### Method 1: Using the Integration Hook (Recommended)

```tsx
import { useNotificationIntegration } from '../hooks/useNotificationIntegration';

const MyComponent = () => {
  const { notifyUserAction, showToast } = useNotificationIntegration();
  
  const handleUserCreate = async () => {
    try {
      // Your API call
      await createUser(userData);
      
      // Show notification
      notifyUserAction('created', userData.name);
    } catch (error) {
      showToast('error', 'Failed to create user');
    }
  };
  
  return <button onClick={handleUserCreate}>Create User</button>;
};
```

#### Method 2: Using the Context Directly

```tsx
import { useNotifications } from '../context/NotificationContext';

const MyComponent = () => {
  const { addNotification, showToast } = useNotifications();
  
  const handleAction = () => {
    // Add a notification to the notification center
    addNotification({
      type: 'success',
      category: 'user_activity',
      title: 'Action Completed',
      message: 'Your action was successful',
    });
    
    // Show a quick toast
    showToast('success', 'Action completed!');
  };
  
  return <button onClick={handleAction}>Do Action</button>;
};
```

### Notification Types

- `success` - Green, for successful operations
- `info` - Blue, for informational messages
- `warning` - Yellow, for warnings
- `error` - Red, for errors

### Notification Categories

- `user_activity` - User management actions
- `content_updates` - Content creation/updates
- `system_alerts` - System and security alerts
- `activity_logs` - Activity summaries
- `comments` - Comments and mentions

## Helper Functions

### Notification Templates (`utils/notificationHelpers.ts`)

Pre-built notification templates for common actions:

```typescript
import { notificationTemplates } from '../utils/notificationHelpers';

// User actions
notificationTemplates.userCreated('John Doe');
notificationTemplates.userUpdated('Jane Smith');
notificationTemplates.userDeleted('Bob Wilson');

// Content actions
notificationTemplates.contentPublished('Article', 'New Feature');
notificationTemplates.contentUpdated('Video', 'Tutorial');

// System alerts
notificationTemplates.systemAlert('Maintenance scheduled');
notificationTemplates.securityAlert('Unusual activity detected');

// Social
notificationTemplates.commentReceived('Alice', 'Getting Started');
notificationTemplates.mentionReceived('Charlie', 'Discussion');
```

### Browser Notifications

Request permission and show browser notifications:

```typescript
import { requestNotificationPermission, showBrowserNotification } from '../utils/notificationHelpers';

// Request permission
const hasPermission = await requestNotificationPermission();

// Show browser notification
if (hasPermission) {
  showBrowserNotification('New Message', {
    body: 'You have a new message',
    icon: '/icon.png',
  });
}
```

### Quiet Hours

Check if quiet hours are active:

```typescript
import { isQuietHoursActive } from '../utils/notificationHelpers';

const isQuiet = isQuietHoursActive('22:00', '08:00');
if (!isQuiet) {
  // Send notification
}
```

## Integration Hook API

The `useNotificationIntegration` hook provides convenient methods:

```typescript
const {
  notifyUserAction,      // (action, userName)
  notifyContentAction,   // (action, contentType, title)
  notifySystemAlert,     // (message, isSecurityAlert?)
  notifyComment,         // (userName, contentTitle)
  notifyMention,         // (userName, location)
  addNotification,       // Direct access to context
  showToast,            // Direct access to context
} = useNotificationIntegration();
```

## Examples

### Example 1: User Management

```tsx
const UserManagement = () => {
  const { notifyUserAction } = useNotificationIntegration();
  
  const handleCreateUser = async (userData) => {
    await api.createUser(userData);
    notifyUserAction('created', userData.name);
  };
  
  const handleUpdateUser = async (userId, userData) => {
    await api.updateUser(userId, userData);
    notifyUserAction('updated', userData.name);
  };
  
  const handleDeleteUser = async (userId, userName) => {
    await api.deleteUser(userId);
    notifyUserAction('deleted', userName);
  };
  
  // ... component JSX
};
```

### Example 2: Content Publishing

```tsx
const ContentEditor = () => {
  const { notifyContentAction, showToast } = useNotificationIntegration();
  
  const handlePublish = async () => {
    try {
      await api.publishContent(content);
      notifyContentAction('published', 'Article', content.title);
    } catch (error) {
      showToast('error', 'Failed to publish content');
    }
  };
  
  // ... component JSX
};
```

### Example 3: Form Validation

```tsx
const MyForm = () => {
  const { showToast } = useNotificationIntegration();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isValid) {
      showToast('warning', 'Please fill all required fields');
      return;
    }
    
    // Submit form
    showToast('success', 'Form submitted successfully!');
  };
  
  // ... component JSX
};
```

## Demo Component

A demo component is available at `components/NotificationDemo.tsx` that shows all notification types and usage examples. You can temporarily add it to your dashboard to test the notification system:

```tsx
import NotificationDemo from './components/NotificationDemo';

// In your component
<NotificationDemo />
```

## Persistence

Notifications are automatically saved to `localStorage` and restored on page reload. The system keeps the last 100 notifications.

## Styling

The notification system uses Tailwind CSS and supports dark mode. Toast animations are defined in `index.css`.

## Best Practices

1. **Use appropriate notification types**: Match the type to the action (success for completions, error for failures, etc.)

2. **Keep messages concise**: Notification messages should be brief and actionable

3. **Don't overuse notifications**: Only notify for important events that users need to know about

4. **Use toast for immediate feedback**: Use toast notifications for quick confirmations, use the notification center for persistent messages

5. **Respect quiet hours**: Check quiet hours before sending non-critical notifications

6. **Provide context**: Include relevant information like user names, content titles, etc.

## Future Enhancements

Potential improvements for the notification system:

- Email notification integration
- Push notification support (Service Workers)
- Notification sound effects
- Notification grouping
- Real-time notifications via WebSocket
- Notification action buttons
- Rich media in notifications (images, videos)
- Notification scheduling
- Per-user notification preferences storage
