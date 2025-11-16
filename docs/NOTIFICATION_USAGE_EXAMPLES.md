# 📚 Notification System - Usage Examples

## Using the Notification Helpers Hook

The easiest way to send notifications is using the `useNotificationHelpers` hook:

```typescript
import { useNotificationHelpers } from '../hooks/useNotificationHelpers';

function MyComponent() {
  const {
    notifyTaskAssigned,
    notifyProjectTeam,
    showSuccess,
    showError
  } = useNotificationHelpers();

  // Use the helpers...
}
```

## Example 1: Task Assignment with Reminder

```typescript
import { useNotificationHelpers } from '../hooks/useNotificationHelpers';

function TaskAssignment() {
  const { notifyTaskAssigned, scheduleTaskReminder } = useNotificationHelpers();

  const assignTask = async (task, assigneeId, assigneeName) => {
    try {
      // Update task in database
      await updateTask(task.id, { assignee_id: assigneeId });

      // Send notification
      await notifyTaskAssigned(
        assigneeId,
        task.id,
        task.title,
        currentUser.full_name
      );

      // Schedule reminder 24 hours before deadline
      if (task.due_date) {
        await scheduleTaskReminder(
          assigneeId,
          task.id,
          task.title,
          task.due_date,
          24
        );
      }

      showSuccess(`Task assigned to ${assigneeName}`);
    } catch (error) {
      showError('Failed to assign task');
    }
  };

  return (
    <button onClick={() => assignTask(task, userId, userName)}>
      Assign Task
    </button>
  );
}
```

## Example 2: Project Update Notification

```typescript
import { useNotificationHelpers } from '../hooks/useNotificationHelpers';

function ProjectUpdate() {
  const { notifyProjectTeam, showSuccess } = useNotificationHelpers();

  const updateProjectStatus = async (projectId, newStatus) => {
    try {
      // Update project
      await updateProject(projectId, { status: newStatus });

      // Notify all team members
      await notifyProjectTeam(
        projectId,
        'Project Status Updated',
        `Project status changed to ${newStatus}`,
        `/projects/${projectId}`
      );

      showSuccess('Project updated and team notified');
    } catch (error) {
      showError('Failed to update project');
    }
  };

  return (
    <select onChange={(e) => updateProjectStatus(project.id, e.target.value)}>
      <option value="active">Active</option>
      <option value="on-hold">On Hold</option>
      <option value="completed">Completed</option>
    </select>
  );
}
```

## Example 3: Chat Mentions

```typescript
import { useNotificationHelpers } from '../hooks/useNotificationHelpers';

function ChatMessage() {
  const { notifyMention } = useNotificationHelpers();

  const sendMessage = async (content, conversationId) => {
    // Save message
    const message = await saveMessage(content, conversationId);

    // Check for mentions (@username)
    const mentions = content.match(/@(\w+)/g);
    
    if (mentions) {
      for (const mention of mentions) {
        const username = mention.substring(1);
        const user = await getUserByUsername(username);
        
        if (user) {
          await notifyMention(
            user.id,
            currentUser.full_name,
            `in ${conversationName}`,
            conversationId,
            'message'
          );
        }
      }
    }

    return message;
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      sendMessage(e.target.message.value, conversationId);
    }}>
      <input name="message" placeholder="Type a message... Use @username to mention" />
      <button type="submit">Send</button>
    </form>
  );
}
```

## Example 4: Task Comment with Watchers

```typescript
import { useNotificationHelpers } from '../hooks/useNotificationHelpers';

function TaskComments() {
  const { notifyTaskComment, showSuccess } = useNotificationHelpers();

  const addComment = async (taskId, content) => {
    try {
      // Save comment
      await saveComment(taskId, content, currentUser.id);

      // Notify task watchers (assignee and creator)
      await notifyTaskComment(
        taskId,
        currentUser.full_name,
        content,
        currentUser.id // exclude self
      );

      showSuccess('Comment added');
    } catch (error) {
      showError('Failed to add comment');
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      addComment(task.id, e.target.comment.value);
    }}>
      <textarea name="comment" placeholder="Add a comment..." />
      <button type="submit">Comment</button>
    </form>
  );
}
```

## Example 5: Deadline Reminders

```typescript
import { useNotificationHelpers } from '../hooks/useNotificationHelpers';

function TaskDeadline() {
  const { scheduleDeadlineReminders, showSuccess } = useNotificationHelpers();

  const setDeadline = async (taskId, deadline) => {
    try {
      // Update task deadline
      await updateTask(taskId, { due_date: deadline });

      // Schedule reminders (1 week, 1 day, 1 hour before)
      await scheduleDeadlineReminders(
        task.assignee_id,
        taskId,
        task.title,
        'task',
        deadline
      );

      showSuccess('Deadline set with reminders');
    } catch (error) {
      showError('Failed to set deadline');
    }
  };

  return (
    <input
      type="datetime-local"
      onChange={(e) => setDeadline(task.id, e.target.value)}
    />
  );
}
```

## Example 6: Toast Notifications

```typescript
import { useNotificationHelpers } from '../hooks/useNotificationHelpers';

function FormSubmit() {
  const { showSuccess, showError, showWarning, showInfo } = useNotificationHelpers();

  const handleSubmit = async (data) => {
    try {
      // Validation
      if (!data.title) {
        showWarning('Please enter a title');
        return;
      }

      showInfo('Saving...');

      // Save data
      await saveData(data);

      showSuccess('Data saved successfully!');
    } catch (error) {
      showError('Failed to save data');
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(formData);
    }}>
      {/* form fields */}
    </form>
  );
}
```

## Example 7: Batch Notifications

```typescript
import { useNotificationHelpers } from '../hooks/useNotificationHelpers';

function BulkTaskAssignment() {
  const { notifyMultipleUsers, showSuccess } = useNotificationHelpers();

  const assignTasksToTeam = async (taskIds, teamMemberIds) => {
    try {
      // Assign tasks
      await bulkAssignTasks(taskIds, teamMemberIds);

      // Notify all team members
      await notifyMultipleUsers(
        teamMemberIds,
        'New Tasks Assigned',
        `You have been assigned ${taskIds.length} new tasks`,
        'info',
        '/work/tasks'
      );

      showSuccess(`${taskIds.length} tasks assigned to ${teamMemberIds.length} team members`);
    } catch (error) {
      showError('Failed to assign tasks');
    }
  };

  return (
    <button onClick={() => assignTasksToTeam(selectedTasks, selectedMembers)}>
      Assign to Team
    </button>
  );
}
```

## Example 8: System Announcements

```typescript
import { notificationsApi } from '../utils/api';

function AdminAnnouncement() {
  const [announcement, setAnnouncement] = useState('');

  const sendAnnouncement = async () => {
    try {
      // Get all users
      const { data: users } = await supabase
        .from('users')
        .select('id');

      // Send to all users
      for (const user of users) {
        await notificationsApi.createNotification({
          user_id: user.id,
          title: 'System Announcement',
          message: announcement,
          type: 'system'
        });
      }

      alert('Announcement sent to all users');
    } catch (error) {
      alert('Failed to send announcement');
    }
  };

  return (
    <div>
      <textarea
        value={announcement}
        onChange={(e) => setAnnouncement(e.target.value)}
        placeholder="Enter announcement..."
      />
      <button onClick={sendAnnouncement}>
        Send to All Users
      </button>
    </div>
  );
}
```

## Example 9: Direct API Usage

If you need more control, use the API directly:

```typescript
import { notificationsApi } from '../utils/api';

async function customNotification() {
  // Create a custom notification
  await notificationsApi.createNotification({
    user_id: 'user-id',
    title: 'Custom Notification',
    message: 'This is a custom notification with metadata',
    type: 'info',
    action_url: '/custom/page',
    metadata: {
      customField: 'value',
      anotherField: 123
    }
  });

  // Schedule for later
  await notificationsApi.scheduleNotification({
    user_id: 'user-id',
    title: 'Scheduled Notification',
    message: 'This will be sent later',
    type: 'info',
    scheduled_for: new Date('2025-12-01T10:00:00Z').toISOString()
  });

  // Get user preferences
  const prefs = await notificationsApi.getPreferences('user-id');
  console.log('User preferences:', prefs);

  // Update preferences
  await notificationsApi.updatePreferences('user-id', {
    task_assigned: false,
    quiet_hours_enabled: true,
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00'
  });
}
```

## Example 10: Real-time Notification Listener

```typescript
import { useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';

function NotificationListener() {
  const { notifications } = useNotifications();

  useEffect(() => {
    // React to new notifications
    const latestNotification = notifications[0];
    
    if (latestNotification && !latestNotification.read) {
      console.log('New notification:', latestNotification);
      
      // Custom handling based on type
      switch (latestNotification.type) {
        case 'task':
          // Handle task notification
          break;
        case 'mention':
          // Handle mention notification
          break;
        case 'system':
          // Handle system notification
          break;
      }
    }
  }, [notifications]);

  return null;
}
```

## Example 11: Notification Preferences UI

```typescript
import NotificationPreferences from '../components/notifications/NotificationPreferences';

function UserSettings() {
  return (
    <div className="settings-page">
      <h1>Settings</h1>
      
      <div className="tabs">
        <button>Profile</button>
        <button>Security</button>
        <button>Notifications</button>
      </div>

      <div className="tab-content">
        <NotificationPreferences />
      </div>
    </div>
  );
}
```

## Example 12: Custom Toast with Action

```typescript
import { useNotifications } from '../context/NotificationContext';

function CustomToast() {
  const { showToast } = useNotifications();

  const showActionToast = () => {
    showToast({
      title: 'New Task Assigned',
      message: 'You have been assigned a new task',
      type: 'task',
      action_url: '/work/tasks/123',
      duration: 10000 // Show for 10 seconds
    });
  };

  return (
    <button onClick={showActionToast}>
      Show Toast with Action
    </button>
  );
}
```

## Best Practices

### 1. Always Exclude Self from Notifications
```typescript
// Don't notify the user who performed the action
await notifyTaskComment(taskId, userName, comment, currentUser.id);
```

### 2. Provide Action URLs
```typescript
// Always include a way for users to navigate to the relevant content
{
  action_url: `/work/tasks/${taskId}`,
  metadata: { taskId, projectId }
}
```

### 3. Keep Messages Concise
```typescript
// Truncate long messages
message: content.substring(0, 100) + (content.length > 100 ? '...' : '')
```

### 4. Use Appropriate Types
```typescript
// Use the right notification type for better UX
type: 'success' // For completions
type: 'error'   // For failures
type: 'warning' // For deadlines
type: 'info'    // For general updates
type: 'task'    // For task-related
type: 'mention' // For mentions
type: 'system'  // For system messages
```

### 5. Handle Errors Gracefully
```typescript
try {
  await notifyTaskAssigned(...);
} catch (error) {
  console.error('Notification failed:', error);
  // Don't block the main operation if notification fails
}
```

### 6. Batch Similar Notifications
```typescript
// Instead of sending 10 separate notifications
// Group them into one: "10 new tasks assigned"
```

### 7. Respect User Preferences
```typescript
// The system automatically checks preferences
// But you can also check manually if needed
const prefs = await notificationsApi.getPreferences(userId);
if (prefs.task_assigned) {
  // Send notification
}
```

---

**More Examples?** Check the source code in:
- `hooks/useNotificationHelpers.ts`
- `utils/api/notifications.ts`
- `context/NotificationContext.tsx`
