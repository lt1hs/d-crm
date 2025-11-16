# 🔔 Enhanced Notification System

## Overview
A comprehensive notification system with user preferences, scheduled notifications, notification grouping, and multi-channel delivery.

## Features Implemented

### 1. **Core Notification System** ✅
- Real-time notifications via Supabase subscriptions
- Toast notifications with auto-dismiss
- Browser notifications (with permission)
- Sound alerts
- Unread count tracking
- Mark as read/unread
- Delete notifications
- Bulk operations

### 2. **Notification Preferences** ✅
- **Channels**: Push, Email, Browser, Sound
- **Task Notifications**: Assigned, Completed, Commented, Due Soon, Overdue
- **Chat & Mentions**: Chat messages, Direct messages, Mentions
- **Project Notifications**: Updates, Deadlines
- **System Notifications**: System updates and announcements

### 3. **Quiet Hours** ✅
- Configure quiet hours (e.g., 22:00 - 08:00)
- Automatically suppress notifications during quiet hours
- Timezone-aware

### 4. **Notification Digest** ✅
- Daily digest at configurable time
- Weekly digest on configurable day
- Batches notifications into summary emails

### 5. **Notification Grouping** ✅
- Groups similar notifications together
- Reduces notification fatigue
- Shows count of grouped notifications
- Example: "5 new tasks assigned to you"

### 6. **Scheduled Notifications** ✅
- Schedule notifications for future delivery
- Task deadline reminders (24h, 1h before)
- Project milestone reminders
- Automatic processing via database function

### 7. **Enhanced UI** ✅
- Grouped by date (Today, Yesterday, This Week, Older)
- Filter by type (task, mention, system, etc.)
- Filter by read/unread status
- Settings modal for preferences
- Improved visual design with icons and colors

### 8. **Delivery Tracking** ✅
- Logs all notification delivery attempts
- Tracks success/failure per channel
- Useful for debugging and analytics

## Database Schema

### Tables Created

#### `notification_preferences`
```sql
- user_id (UUID, unique)
- Channel settings (push, email, browser, sound)
- Type-specific settings (task_assigned, mentions, etc.)
- Quiet hours configuration
- Digest settings
```

#### `notification_groups`
```sql
- user_id (UUID)
- group_key (TEXT) - e.g., "task_assigned_project_123"
- title (TEXT)
- count (INTEGER)
- last_notification_id (UUID)
- read (BOOLEAN)
```

#### `scheduled_notifications`
```sql
- user_id (UUID)
- title, message, type
- scheduled_for (TIMESTAMPTZ)
- sent (BOOLEAN)
- sent_at (TIMESTAMPTZ)
```

#### `notification_delivery_log`
```sql
- notification_id (UUID)
- user_id (UUID)
- channel (push/email/browser/sms)
- status (pending/sent/failed/skipped)
- error_message (TEXT)
- delivered_at (TIMESTAMPTZ)
```

### Database Functions

#### `should_send_notification(user_id, notification_type)`
- Checks user preferences
- Respects quiet hours
- Returns boolean

#### `process_scheduled_notifications()`
- Processes pending scheduled notifications
- Checks preferences before sending
- Marks as sent after delivery
- Run via cron job or periodic trigger

#### `group_notification(user_id, group_key, title, notification_id)`
- Groups similar notifications
- Updates count and last notification
- Reduces notification spam

#### `create_default_notification_preferences()`
- Automatically creates default preferences for new users
- Triggered on user creation

## API Methods

### Preferences
```typescript
notificationsApi.getPreferences(userId)
notificationsApi.updatePreferences(userId, preferences)
notificationsApi.createDefaultPreferences(userId)
```

### Scheduled Notifications
```typescript
notificationsApi.scheduleNotification(notification)
notificationsApi.getScheduledNotifications(userId)
notificationsApi.cancelScheduledNotification(notificationId)
notificationsApi.scheduleTaskDeadlineReminder(userId, taskId, taskTitle, dueDate, hoursBefore)
```

### Notification Groups
```typescript
notificationsApi.getNotificationGroups(userId)
notificationsApi.markGroupAsRead(groupId)
```

### Bulk Operations
```typescript
notificationsApi.markMultipleAsRead(notificationIds)
notificationsApi.deleteMultiple(notificationIds)
```

### Team Notifications
```typescript
notificationsApi.notifyProjectTeam(projectId, title, message, actionUrl)
notificationsApi.notifyTaskWatchers(taskId, title, message, excludeUserId)
```

## Components

### `NotificationCenter`
- Bell icon with unread badge
- Dropdown panel with notifications
- Grouped by date
- Filter by type and read status
- Quick actions (mark all read, clear read)
- Settings button

### `NotificationPreferences`
- Comprehensive settings UI
- Toggle switches for all preferences
- Time pickers for quiet hours and digest
- Day selector for weekly digest
- Save button with feedback

### `NotificationContext`
- Provides notification state
- Handles real-time subscriptions
- Toast management
- Browser notification permission
- Sound playback

## Usage Examples

### 1. Send a Task Assignment Notification
```typescript
await notificationsApi.notifyTaskAssigned(
  userId,
  taskId,
  'Update homepage design',
  'John Doe'
);
```

### 2. Schedule a Deadline Reminder
```typescript
await notificationsApi.scheduleTaskDeadlineReminder(
  userId,
  taskId,
  'Update homepage design',
  '2025-11-20T17:00:00Z',
  24 // 24 hours before
);
```

### 3. Notify Project Team
```typescript
await notificationsApi.notifyProjectTeam(
  projectId,
  'Project Milestone Reached',
  'We have completed Phase 1 of the project!',
  `/projects/${projectId}`
);
```

### 4. Update User Preferences
```typescript
await notificationsApi.updatePreferences(userId, {
  quiet_hours_enabled: true,
  quiet_hours_start: '22:00',
  quiet_hours_end: '08:00',
  task_assigned: true,
  chat_messages: false
});
```

### 5. Show Toast Notification
```typescript
const { showToast } = useNotifications();

showToast({
  title: 'Success!',
  message: 'Task completed successfully',
  type: 'success',
  duration: 3000
});
```

## Integration Points

### Work Management
- Task assigned → Notify assignee
- Task completed → Notify creator
- Task commented → Notify watchers
- Task due soon → Schedule reminder
- Task overdue → Send alert

### Chat System
- New message → Notify participants (except sender)
- Mention in chat → Notify mentioned user
- Direct message → High priority notification

### Project Management
- Project created → Notify team members
- Project deadline → Schedule reminders
- Project milestone → Notify stakeholders

## Setup Instructions

### 1. Run Migration
```bash
# Apply the migration to your Supabase database
psql -h your-db-host -U postgres -d your-db-name -f supabase/migrations/004_enhance_notifications.sql
```

Or via Supabase Dashboard:
1. Go to SQL Editor
2. Paste contents of `004_enhance_notifications.sql`
3. Run the query

### 2. Set Up Cron Job (Optional)
For scheduled notifications, set up a cron job to process them:

```sql
-- Using pg_cron extension
SELECT cron.schedule(
  'process-scheduled-notifications',
  '*/5 * * * *', -- Every 5 minutes
  $$SELECT process_scheduled_notifications()$$
);
```

Or use an external cron service to call:
```typescript
// API endpoint
POST /api/notifications/process-scheduled
```

### 3. Configure Email Service (Optional)
For email notifications, integrate with:
- SendGrid
- AWS SES
- Mailgun
- Resend

### 4. Add to Your App
```typescript
// In your main App component
import { NotificationProvider } from './context/NotificationContext';
import NotificationCenter from './components/notifications/NotificationCenter';

function App() {
  return (
    <NotificationProvider>
      {/* Your app content */}
      <NotificationCenter />
    </NotificationProvider>
  );
}
```

## Best Practices

### 1. Respect User Preferences
Always check preferences before sending:
```typescript
const shouldSend = await supabase.rpc('should_send_notification', {
  p_user_id: userId,
  p_notification_type: 'task_assigned'
});

if (shouldSend) {
  // Send notification
}
```

### 2. Group Similar Notifications
```typescript
// Instead of 10 separate "task assigned" notifications
// Group them: "10 new tasks assigned to you"
await supabase.rpc('group_notification', {
  p_user_id: userId,
  p_group_key: 'task_assigned_today',
  p_title: 'New tasks assigned',
  p_notification_id: notificationId
});
```

### 3. Use Scheduled Notifications for Reminders
```typescript
// Don't send immediately, schedule for optimal time
await notificationsApi.scheduleNotification({
  user_id: userId,
  title: 'Daily Standup Reminder',
  message: 'Your daily standup starts in 15 minutes',
  type: 'info',
  scheduled_for: standupTime.toISOString()
});
```

### 4. Provide Action URLs
Always include action URLs so users can navigate directly:
```typescript
{
  action_url: `/work/tasks/${taskId}`,
  metadata: { taskId, projectId }
}
```

### 5. Clean Up Old Notifications
```sql
-- Delete notifications older than 30 days
DELETE FROM notifications
WHERE created_at < NOW() - INTERVAL '30 days'
AND read = true;
```

## Performance Considerations

1. **Indexes**: All necessary indexes are created in migration
2. **RLS Policies**: Efficient policies that use user_id
3. **Pagination**: Limit queries to 50 notifications by default
4. **Real-time**: Uses Supabase real-time for instant delivery
5. **Batching**: Group similar notifications to reduce load

## Future Enhancements

- [ ] Mobile push notifications (FCM/APNS)
- [ ] SMS notifications via Twilio
- [ ] Slack/Teams integration
- [ ] Notification templates
- [ ] A/B testing for notification content
- [ ] Analytics dashboard
- [ ] Notification priority levels
- [ ] Snooze functionality
- [ ] Custom notification sounds
- [ ] Rich media notifications (images, videos)

## Troubleshooting

### Notifications Not Appearing
1. Check RLS policies are enabled
2. Verify real-time subscription is active
3. Check browser notification permissions
4. Verify user preferences allow the notification type

### Scheduled Notifications Not Sending
1. Ensure cron job is running
2. Check `scheduled_notifications` table for pending items
3. Verify `process_scheduled_notifications()` function works
4. Check user preferences and quiet hours

### Performance Issues
1. Add more indexes if needed
2. Implement pagination
3. Archive old notifications
4. Use notification grouping more aggressively

## Support

For issues or questions:
1. Check the database logs
2. Review RLS policies
3. Test with SQL queries directly
4. Check browser console for errors

---

**Status**: ✅ Complete and Ready for Production
**Version**: 1.0.0
**Last Updated**: November 15, 2025
