# 🚀 START TESTING NOTIFICATIONS - Quick Guide

## ✅ You're Ready to Test!

Everything is set up and ready. Here's how to start testing immediately.

---

## 🎯 Quick Start (3 Steps)

### Step 1: Start Your Dev Server
```bash
npm run dev
```

### Step 2: Open Your App
Navigate to: `http://localhost:5173` (or your dev server URL)

### Step 3: Access Test Page
In your browser console, run:
```javascript
// Navigate to test page
window.location.href = '/crm';
// Then manually navigate to notification-test page
// Or add it to your sidebar menu temporarily
```

---

## 🧪 Automated Test Suite

We've created a comprehensive test component: `NotificationSystemTest.tsx`

**Features**:
- ✅ One-click "Run All Tests" button
- ✅ Individual test buttons for each feature
- ✅ Real-time test log
- ✅ Visual test results
- ✅ Current stats display
- ✅ Preferences viewer
- ✅ Scheduled notifications viewer

---

## 🎮 Manual Testing (Browser Console)

### Get Your User ID
```javascript
// In browser console
const { currentUser } = useAuth();
console.log('User ID:', currentUser.id);
```

### Test 1: Create a Notification
```javascript
import { notificationsApi } from './utils/api/notifications';

await notificationsApi.createNotification({
  user_id: 'YOUR_USER_ID',
  title: '🎉 Test Notification',
  message: 'If you see this, it works!',
  type: 'success'
});
```

### Test 2: Check NotificationCenter
1. Look for the **bell icon** 🔔 in your header
2. Click it to open NotificationCenter
3. You should see your test notification!

### Test 3: Test Toast
```javascript
import { useNotifications } from './context/NotificationContext';

const { showToast } = useNotifications();
showToast({
  title: 'Toast Test',
  message: 'This should appear in top-right!',
  type: 'success'
});
```

### Test 4: Schedule a Notification
```javascript
// Schedule for 1 minute from now
const oneMinute = new Date(Date.now() + 60000);

await notificationsApi.scheduleNotification({
  user_id: 'YOUR_USER_ID',
  title: '⏰ Scheduled Test',
  message: 'This was scheduled 1 minute ago',
  type: 'info',
  scheduled_for: oneMinute.toISOString()
});

// Wait 1 minute and check!
```

### Test 5: Update Preferences
```javascript
await notificationsApi.updatePreferences('YOUR_USER_ID', {
  sound_enabled: true,
  task_assigned: true,
  quiet_hours_enabled: false
});

console.log('Preferences updated!');
```

---

## 📊 Quick SQL Tests (Supabase Dashboard)

### Check Tables
```sql
-- Should return 5 tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'notification%';
```

### View Your Notifications
```sql
-- Replace with your user ID
SELECT * FROM notifications 
WHERE user_id = 'YOUR_USER_ID'
ORDER BY created_at DESC;
```

### View Your Preferences
```sql
SELECT * FROM notification_preferences 
WHERE user_id = 'YOUR_USER_ID';
```

### View Scheduled Notifications
```sql
SELECT * FROM scheduled_notifications 
WHERE user_id = 'YOUR_USER_ID' 
AND NOT sent;
```

### Manually Process Scheduled
```sql
SELECT process_scheduled_notifications();
```

---

## ✅ Quick Verification Checklist

After running tests, verify these work:

### Core Features
- [ ] ✅ Notifications appear in NotificationCenter
- [ ] ✅ Unread count badge shows correct number
- [ ] ✅ Toast notifications appear and auto-dismiss
- [ ] ✅ Real-time updates work (test with 2 browser windows)
- [ ] ✅ Mark as read/unread works
- [ ] ✅ Delete notification works

### Filtering & Grouping
- [ ] ✅ Filter by type works
- [ ] ✅ Filter by read/unread works
- [ ] ✅ Date grouping works (Today, Yesterday, etc.)

### Preferences
- [ ] ✅ Preferences modal opens
- [ ] ✅ Settings save correctly
- [ ] ✅ Quiet hours can be configured

### Advanced
- [ ] ✅ Scheduled notifications are created
- [ ] ✅ Browser notifications work (if permission granted)
- [ ] ✅ Sound alerts work (if enabled)

---

## 🎯 Real-time Test (Most Important!)

This proves the system works end-to-end:

1. **Open your app in TWO browser windows**
2. **Log in as the same user in both**
3. **In Window 1**, open browser console and run:
   ```javascript
   await notificationsApi.createNotification({
     user_id: 'YOUR_USER_ID',
     title: '⚡ Real-time Test',
     message: 'Check Window 2!',
     type: 'success'
   });
   ```
4. **Watch Window 2** - notification should appear **instantly**! ⚡

If this works, your real-time system is perfect! 🎉

---

## 🐛 Troubleshooting

### Notifications Not Appearing?

**Check 1**: Browser Console
```javascript
// Check for errors
console.log('Errors:', window.errors);

// Check Supabase connection
console.log('Supabase:', supabase);
```

**Check 2**: Supabase Dashboard
- Go to Table Editor
- Check `notifications` table
- Verify your notification was created

**Check 3**: RLS Policies
```sql
-- Check if RLS is enabled
SELECT tablename, policyname 
FROM pg_policies 
WHERE tablename = 'notifications';
```

### Real-time Not Working?

**Check 1**: Realtime Enabled
- Go to Supabase Dashboard > Database > Replication
- Ensure `notifications` table has realtime enabled

**Check 2**: Subscription Status
```javascript
// In browser console
console.log('Channels:', supabase.getChannels());
```

### Preferences Not Saving?

**Check**: User ID matches
```javascript
const { currentUser } = useAuth();
console.log('Current User:', currentUser.id);
// Make sure this matches the user_id you're using
```

---

## 📚 Documentation Reference

- **Complete Guide**: `NOTIFICATION_SYSTEM_COMPLETE.md`
- **Quick Start**: `NOTIFICATION_QUICK_START.md`
- **Usage Examples**: `NOTIFICATION_USAGE_EXAMPLES.md`
- **Testing Checklist**: `NOTIFICATION_TESTING_CHECKLIST.md`
- **Architecture**: `NOTIFICATION_SYSTEM_SUMMARY.md`

---

## 🎊 Success Indicators

You'll know everything works when:

1. 🔔 **Bell icon** shows unread count
2. 🎉 **Toast notifications** appear smoothly
3. ⚡ **Real-time updates** are instant (< 100ms)
4. 📱 **Browser notifications** work (if enabled)
5. ⚙️ **Preferences** save and persist
6. ⏰ **Scheduled notifications** arrive on time
7. 🎯 **Filtering** and **grouping** work perfectly
8. 🌙 **Quiet hours** suppress notifications correctly

---

## 🚀 Next Steps After Testing

Once you've verified everything works:

1. **Integrate with Work Management**
   - Add to task assignment flow
   - Add to task completion flow
   - Add to comment flow

2. **Integrate with Chat**
   - Add to message sending
   - Add to mention detection
   - Add to direct messages

3. **Set Up Cron Job**
   - For processing scheduled notifications
   - See `NOTIFICATION_QUICK_START.md` for details

4. **Optional Enhancements**
   - Email notifications (SendGrid/AWS SES)
   - Mobile push (FCM/APNS)
   - SMS notifications (Twilio)
   - Slack integration

---

## 💡 Pro Tips

1. **Use the Test Component**: It's the fastest way to verify everything
2. **Test Real-time First**: It's the most impressive feature
3. **Check Browser Console**: Most issues show up there
4. **Use Two Windows**: Best way to test real-time
5. **Start Simple**: Test basic features before advanced ones

---

## 🎯 Your Testing Mission

**Goal**: Verify all 50 test cases in `NOTIFICATION_TESTING_CHECKLIST.md`

**Time Estimate**: 30-45 minutes for complete testing

**Priority Tests** (Do these first):
1. ✅ Create notification manually
2. ✅ Verify real-time delivery
3. ✅ Test toast notifications
4. ✅ Test NotificationCenter UI
5. ✅ Test preferences

---

## 🎉 Ready? Let's Go!

```bash
# Start your dev server
npm run dev

# Open your browser
# Navigate to your app
# Open browser console
# Start testing!
```

**Good luck! You've got this!** 🚀

---

**Questions?** Check the documentation files or the code comments.

**Found a bug?** Document it in `NOTIFICATION_TESTING_CHECKLIST.md`

**Everything works?** Celebrate! 🎊 You now have a world-class notification system!
