# 🧪 Test Notifications System NOW

## Quick Access

The notification test suite is now integrated into your app!

### Option 1: Direct Navigation (Easiest)

1. **Start your development server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Open your browser console** and run:
   ```javascript
   // Navigate to test page
   window.location.hash = '#notification-test';
   ```

3. Or manually navigate in your app to trigger the test page

### Option 2: Add to Sidebar Menu

Add this to your `Sidebar.tsx` menu items (temporarily for testing):

```typescript
{
  icon: IconBell,
  label: '🧪 Test Notifications',
  page: 'notification-test',
  badge: 'TEST'
}
```

### Option 3: Browser Console Testing

Open your browser console and test directly:

```javascript
// Import the API
import { notificationsApi } from './utils/api/notifications';

// Get current user ID (replace with your actual user ID)
const userId = 'your-user-id-here';

// Test 1: Create a notification
await notificationsApi.createNotification({
  user_id: userId,
  title: 'Test Notification',
  message: 'This is a test!',
  type: 'info'
});

// Test 2: Get preferences
const prefs = await notificationsApi.getPreferences(userId);
console.log('Preferences:', prefs);

// Test 3: Schedule a notification
await notificationsApi.scheduleNotification({
  user_id: userId,
  title: 'Scheduled Test',
  message: 'This will arrive in 2 minutes',
  type: 'info',
  scheduled_for: new Date(Date.now() + 2 * 60 * 1000).toISOString()
});
```

## Manual Testing Steps

### 1. Test Real-time Notifications

1. Open your app in **two browser windows**
2. Log in as the same user in both
3. In window 1, create a notification via console:
   ```javascript
   await notificationsApi.createNotification({
     user_id: 'your-user-id',
     title: 'Real-time Test',
     message: 'Check if this appears instantly!',
     type: 'success'
   });
   ```
4. Watch window 2 - notification should appear instantly! ⚡

### 2. Test Toast Notifications

Open browser console:
```javascript
// Get the notification context
const { showToast } = useNotifications();

// Show different toast types
showToast({ title: 'Success!', message: 'It works!', type: 'success' });
showToast({ title: 'Error!', message: 'Something failed', type: 'error' });
showToast({ title: 'Warning!', message: 'Be careful', type: 'warning' });
showToast({ title: 'Info', message: 'Just FYI', type: 'info' });
```

### 3. Test Browser Notifications

```javascript
// Request permission
await Notification.requestPermission();

// Send test notification
new Notification('Test Browser Notification', {
  body: 'This is a browser notification',
  icon: '/favicon.ico'
});
```

### 4. Test Notification Center UI

1. Click the **bell icon** in your header
2. You should see the NotificationCenter dropdown
3. Test these features:
   - ✅ Filter by "All" vs "Unread"
   - ✅ Filter by type (info, task, mention, etc.)
   - ✅ Mark individual notification as read
   - ✅ Mark all as read
   - ✅ Delete notification
   - ✅ Clear all read notifications
   - ✅ Click "Settings" to open preferences

### 5. Test Notification Preferences

1. Open NotificationCenter
2. Click "Settings" button
3. Test toggling different preferences:
   - ✅ Enable/disable channels (push, email, browser, sound)
   - ✅ Enable/disable notification types
   - ✅ Set quiet hours
   - ✅ Enable daily/weekly digest
4. Click "Save Changes"
5. Verify preferences are saved (refresh page and check)

### 6. Test Scheduled Notifications

```javascript
// Schedule for 1 minute from now
const oneMinuteLater = new Date(Date.now() + 60 * 1000);

await notificationsApi.scheduleNotification({
  user_id: 'your-user-id',
  title: 'Scheduled Notification',
  message: 'This was scheduled 1 minute ago',
  type: 'info',
  scheduled_for: oneMinuteLater.toISOString()
});

// Wait 1 minute and check if it arrives!
```

### 7. Test Quiet Hours

1. Open notification preferences
2. Enable "Quiet Hours"
3. Set start time to current time
4. Set end time to 1 hour from now
5. Try creating a notification
6. It should be suppressed during quiet hours

### 8. Test Notification Grouping

Create multiple similar notifications:
```javascript
for (let i = 0; i < 5; i++) {
  await notificationsApi.createNotification({
    user_id: 'your-user-id',
    title: 'Task Assigned',
    message: `Task ${i + 1} assigned to you`,
    type: 'task'
  });
}

// Check NotificationCenter - they should be grouped by date
```

## Quick SQL Tests (Supabase SQL Editor)

### Check if tables exist:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'notification%';
```

Expected result:
- notifications
- notification_preferences
- notification_groups
- scheduled_notifications
- notification_delivery_log

### Check if functions exist:
```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%notification%';
```

Expected result:
- should_send_notification
- process_scheduled_notifications
- group_notification
- create_default_notification_preferences

### Test creating a notification:
```sql
INSERT INTO notifications (user_id, title, message, type)
VALUES (
  'your-user-id-here',
  'SQL Test Notification',
  'Created directly from SQL',
  'info'
);
```

### Check your notifications:
```sql
SELECT * FROM notifications 
WHERE user_id = 'your-user-id-here'
ORDER BY created_at DESC
LIMIT 10;
```

### Check your preferences:
```sql
SELECT * FROM notification_preferences 
WHERE user_id = 'your-user-id-here';
```

### Test scheduled notifications:
```sql
-- Schedule a notification for 2 minutes from now
INSERT INTO scheduled_notifications (
  user_id, 
  title, 
  message, 
  type, 
  scheduled_for
)
VALUES (
  'your-user-id-here',
  'SQL Scheduled Test',
  'This was scheduled via SQL',
  'info',
  NOW() + INTERVAL '2 minutes'
);

-- Check scheduled notifications
SELECT * FROM scheduled_notifications 
WHERE user_id = 'your-user-id-here' 
AND NOT sent;
```

### Manually process scheduled notifications:
```sql
SELECT process_scheduled_notifications();
```

## Verification Checklist

After running tests, verify:

- [ ] ✅ Notifications appear in NotificationCenter
- [ ] ✅ Unread count badge shows correct number
- [ ] ✅ Toast notifications appear and auto-dismiss
- [ ] ✅ Browser notifications work (if permission granted)
- [ ] ✅ Real-time updates work (test with 2 windows)
- [ ] ✅ Filtering by type works
- [ ] ✅ Filtering by read/unread works
- [ ] ✅ Date grouping works (Today, Yesterday, etc.)
- [ ] ✅ Mark as read works
- [ ] ✅ Delete notification works
- [ ] ✅ Preferences save correctly
- [ ] ✅ Quiet hours work
- [ ] ✅ Scheduled notifications are created
- [ ] ✅ Scheduled notifications are delivered (wait for scheduled time)

## Troubleshooting

### Notifications not appearing?

1. **Check browser console** for errors
2. **Check Supabase logs** in dashboard
3. **Verify RLS policies**:
   ```sql
   SELECT * FROM pg_policies 
   WHERE tablename = 'notifications';
   ```
4. **Check real-time subscription**:
   ```javascript
   // In browser console
   console.log('Supabase channels:', supabase.getChannels());
   ```

### Scheduled notifications not processing?

1. **Check if cron job is set up** (see NOTIFICATION_QUICK_START.md)
2. **Manually trigger processing**:
   ```sql
   SELECT process_scheduled_notifications();
   ```
3. **Check scheduled notifications table**:
   ```sql
   SELECT * FROM scheduled_notifications WHERE NOT sent;
   ```

### Preferences not saving?

1. **Check RLS policies** allow updates
2. **Verify user_id** matches authenticated user
3. **Check browser console** for errors

## Success Indicators

You'll know everything is working when:

1. 🔔 Bell icon shows unread count
2. 🎉 Toast notifications appear smoothly
3. ⚡ Real-time updates are instant
4. 📱 Browser notifications work
5. ⚙️ Preferences save and persist
6. ⏰ Scheduled notifications arrive on time
7. 🎯 Filtering and grouping work perfectly

## Next Steps

Once basic testing is complete:

1. Integrate with your work management system
2. Add notification triggers for task assignments
3. Set up email notifications (optional)
4. Configure cron job for scheduled processing
5. Add mobile push notifications (optional)

---

**Ready to test?** Start your dev server and open the app! 🚀

```bash
npm run dev
```

Then navigate to the notification test page or use the browser console to run tests!
