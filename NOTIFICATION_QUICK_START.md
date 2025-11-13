# Notification System - Quick Start Guide

## 🚀 5-Minute Integration

### Step 1: Import the Hook

```tsx
import { useNotificationIntegration } from '../hooks/useNotificationIntegration';
```

### Step 2: Use in Your Component

```tsx
const MyComponent = () => {
  const { showToast, notifyUserAction } = useNotificationIntegration();
  
  // Your component logic
};
```

### Step 3: Add Notifications

```tsx
// Quick toast notification
showToast('success', 'Operation completed!');

// Persistent notification in notification center
notifyUserAction('created', 'John Doe');
```

## 📋 Common Use Cases

### User Management

```tsx
const { notifyUserAction } = useNotificationIntegration();

// User created
notifyUserAction('created', userName);

// User updated
notifyUserAction('updated', userName);

// User deleted
notifyUserAction('deleted', userName);
```

### Content Management

```tsx
const { notifyContentAction } = useNotificationIntegration();

// Content published
notifyContentAction('published', 'Article', 'My Article Title');

// Content updated
notifyContentAction('updated', 'Video', 'Tutorial Video');
```

### Form Validation

```tsx
const { showToast } = useNotificationIntegration();

if (!isValid) {
  showToast('warning', 'Please fill all required fields');
  return;
}

showToast('success', 'Form submitted successfully!');
```

### Error Handling

```tsx
const { showToast } = useNotificationIntegration();

try {
  await api.saveData(data);
  showToast('success', 'Data saved successfully');
} catch (error) {
  showToast('error', 'Failed to save data');
}
```

### System Alerts

```tsx
const { notifySystemAlert } = useNotificationIntegration();

// Regular alert
notifySystemAlert('System maintenance scheduled for tonight');

// Security alert
notifySystemAlert('Unusual login activity detected', true);
```

## 🎨 Notification Types

| Type | Color | Use For |
|------|-------|---------|
| `success` | Green | Successful operations |
| `info` | Blue | Informational messages |
| `warning` | Yellow | Warnings and cautions |
| `error` | Red | Errors and failures |

## 🔔 Where to Find Notifications

1. **Header Bell Icon**: Click to see all notifications
2. **Toast Popups**: Appear in top-right corner
3. **Settings Page**: Configure preferences under Settings → Notifications

## 💡 Pro Tips

1. **Use toast for immediate feedback**: Quick confirmations
2. **Use notification center for important events**: Things users should review later
3. **Keep messages short**: 1-2 sentences max
4. **Be specific**: Include names, titles, and context
5. **Match type to action**: Success for completions, error for failures

## 🧪 Test It Out

Add this to any component to test:

```tsx
import { useNotificationIntegration } from '../hooks/useNotificationIntegration';

const TestButton = () => {
  const { showToast } = useNotificationIntegration();
  
  return (
    <button onClick={() => showToast('success', 'It works!')}>
      Test Notification
    </button>
  );
};
```

## 📚 Need More?

- Full documentation: `NOTIFICATION_SYSTEM.md`
- Demo component: `components/NotificationDemo.tsx`
- Implementation details: `NOTIFICATION_SYSTEM_SUMMARY.md`
