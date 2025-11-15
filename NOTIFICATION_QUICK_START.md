# 🚀 Notification System - Quick Start Guide

## Step 1: Apply Database Migration

Run the migration to create all necessary tables and functions:

```bash
# Via Supabase CLI
supabase db push

# Or via SQL Editor in Supabase Dashboard
# Copy and paste contents of: supabase/migrations/004_enhance_notifications.sql
```

## Step 2: Verify Tables Created

Check that these tables exist in your database:
- ✅ `notifications` (already exists)
- ✅ `notification_preferences`
- ✅ `notification_groups`
- ✅ `scheduled_notifications`
- ✅ `notification_delivery_log`

## Step 3: Test the System

### A. Create a Test Notification

```typescript
import { notificationsApi } from './utils/api';

// Send a simple notification
await notificationsApi.createNotification({
  user_id: 'your-user-id',
  title: 'Test Notification',
  message: 'This is a test notification',
  type: 'info'
});
```

### B. Check User Preferences

```typescript
// Get preferences (creates default if not exists)
const prefs = await notificationsApi.getPreferences('your-user-id');
console.log('User preferences:', prefs);
```

### C. Schedule a Notification

```typescript
// Schedule for 1 hour from now
const scheduledTime = new Date();
scheduledTime.setHours(scheduledTime.getHours() + 1);

await notificationsApi.scheduleNotification({
  user_id: 'your-user-id',
  title: 'Scheduled Reminder',
  message: 'This was scheduled 1 hour ago',
  type: 'info',
  scheduled_for: scheduledTime.toISOString()
});
```

## Step 4: Add to Your App

### Update Your Main App Component

```typescript
// App.tsx or similar
import { NotificationProvider } from './context/NotificationContext';
import NotificationCenter from './components/notifications/NotificationCenter';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        {/* Your existing app content */}
        
        {/* Add notification bell in header/navbar */}
        <header>
          <NotificationCenter />
        </header>
        
        {/* Rest of your app */}
      </NotificationProvider>
    </AuthProvider>
  );
}
```

## Step 5: Integrate with Work Management

### Task Assignment

```typescript
// When assigning a task
import { notificationsApi } from './utils/api';

async function assignTask(taskId: string, assigneeId: string, assignedBy: string) {
  // ... your task assignment logic ...
  
  // Send notification
  await notificationsApi.notifyTaskAssigned(
    assigneeId,
    taskId,
    task.title,
    assignedBy
  );
  
  // Schedule deadline reminder (24 hours before)
  if (task.due_date) {
    await notificationsApi.scheduleTaskDeadlineReminder(
      assigneeId,
      taskId,
      task.title,
      task.due_date,
      24
    );
  }
}
```

### Task Comments

```typescript
// When someone comments on a task
async function addTaskComment(taskId: string, commenterId: string, content: string) {
  // ... your comment logic ...
  
  // Notify task watchers (assignee and creator)
  await notificationsApi.notifyTaskWatchers(
    taskId,
    'New Comment',
    `${commenterName} commented: ${content.substring(0, 100)}`,
    commenterId // exclude the commenter
  );
}
```

## Step 6: Integrate with Chat

### New Messages

```typescript
// When sending a message
async function sendMessage(conversationId: string, senderId: string, content: string) {
  // ... your message sending logic ...
  
  // Get conversation participants
  const { data: participants } = await supabase
    .from('conversation_participants')
    .select('user_id')
    .eq('conversation_id', conversationId)
    .neq('user_id', senderId);
  
  // Notify each participant
  for (const participant of participants) {
    await notificationsApi.createNotification({
      user_id: participant.user_id,
      title: `New message from ${senderName}`,
      message: content.substring(0, 100),
      type: 'mention',
      action_url: `/chat/${conversationId}`,
      metadata: { conversationId, messageId: message.id }
    });
  }
}
```

## Step 7: Set Up Scheduled Notification Processing

### Option A: Using pg_cron (Recommended)

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule to run every 5 minutes
SELECT cron.schedule(
  'process-scheduled-notifications',
  '*/5 * * * *',
  $$SELECT process_scheduled_notifications()$$
);
```

### Option B: Using External Cron

Create an API endpoint:

```typescript
// pages/api/notifications/process-scheduled.ts
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Verify secret token
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Process scheduled notifications
  const { data, error } = await supabase.rpc('process_scheduled_notifications');
  
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  
  return res.json({ processed: data });
}
```

Then set up a cron job (e.g., via Vercel Cron, GitHub Actions, or cron-job.org):

```yaml
# .github/workflows/process-notifications.yml
name: Process Scheduled Notifications
on:
  schedule:
    - cron: '*/5 * * * *' # Every 5 minutes

jobs:
  process:
    runs-on: ubuntu-latest
    steps:
      - name: Process notifications
        run: |
          curl -X POST https://your-app.com/api/notifications/process-scheduled \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

## Step 8: Add Notification Preferences to User Settings

```typescript
// In your user settings page
import NotificationPreferences from './components/notifications/NotificationPreferences';

function UserSettings() {
  return (
    <div>
      <h1>Settings</h1>
      
      {/* Other settings tabs */}
      
      <div className="tab-content">
        <NotificationPreferences />
      </div>
    </div>
  );
}
```

## Step 9: Test Everything

### Test Checklist

- [ ] Create a notification manually
- [ ] Verify it appears in NotificationCenter
- [ ] Check toast notification appears
- [ ] Test browser notification (if permission granted)
- [ ] Test sound alert
- [ ] Mark notification as read
- [ ] Delete notification
- [ ] Test "Mark all as read"
- [ ] Test "Clear read notifications"
- [ ] Update notification preferences
- [ ] Test quiet hours (set to current time and verify no notifications)
- [ ] Schedule a notification for 1 minute from now
- [ ] Verify scheduled notification is sent
- [ ] Test notification grouping
- [ ] Test filtering by type
- [ ] Test filtering by read/unread

## Common Use Cases

### 1. Daily Standup Reminder

```typescript
// Schedule daily standup reminder for all team members
async function scheduleStandupReminders() {
  const standupTime = new Date();
  standupTime.setHours(9, 45, 0, 0); // 9:45 AM
  
  const { data: users } = await supabase
    .from('users')
    .select('id');
  
  for (const user of users) {
    await notificationsApi.scheduleNotification({
      user_id: user.id,
      title: 'Daily Standup',
      message: 'Daily standup starts in 15 minutes',
      type: 'info',
      scheduled_for: standupTime.toISOString()
    });
  }
}
```

### 2. Project Deadline Alert

```typescript
// Alert team 1 week before project deadline
async function alertProjectDeadline(projectId: string, deadline: string) {
  const alertTime = new Date(deadline);
  alertTime.setDate(alertTime.getDate() - 7); // 1 week before
  
  await notificationsApi.notifyProjectTeam(
    projectId,
    'Project Deadline Approaching',
    'Your project deadline is in 1 week',
    `/projects/${projectId}`
  );
}
```

### 3. Overdue Task Alerts

```typescript
// Check for overdue tasks and send alerts
async function checkOverdueTasks() {
  const { data: overdueTasks } = await supabase
    .from('tasks')
    .select('id, title, assignee_id, due_date')
    .lt('due_date', new Date().toISOString())
    .eq('status', 'todo');
  
  for (const task of overdueTasks) {
    if (task.assignee_id) {
      await notificationsApi.createNotification({
        user_id: task.assignee_id,
        title: 'Task Overdue',
        message: `"${task.title}" is overdue`,
        type: 'error',
        action_url: `/work/tasks/${task.id}`,
        metadata: { taskId: task.id }
      });
    }
  }
}
```

## Troubleshooting

### Notifications Not Showing Up

1. Check browser console for errors
2. Verify real-time subscription is active:
   ```typescript
   console.log('Subscription status:', channel.state);
   ```
3. Check RLS policies in Supabase
4. Verify user has notifications_enabled = true

### Scheduled Notifications Not Processing

1. Check if cron job is running
2. Manually test the function:
   ```sql
   SELECT process_scheduled_notifications();
   ```
3. Check scheduled_notifications table:
   ```sql
   SELECT * FROM scheduled_notifications WHERE NOT sent;
   ```

### Preferences Not Saving

1. Check RLS policies allow updates
2. Verify user_id matches auth.uid()
3. Check browser console for errors

## Next Steps

- [ ] Set up email notifications (SendGrid, AWS SES, etc.)
- [ ] Add mobile push notifications (FCM/APNS)
- [ ] Create notification analytics dashboard
- [ ] Implement notification templates
- [ ] Add Slack/Teams integration

---

**Need Help?** Check `NOTIFICATION_SYSTEM_COMPLETE.md` for detailed documentation.
