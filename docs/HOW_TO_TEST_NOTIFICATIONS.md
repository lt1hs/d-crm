# 🎯 How to Access the Notification Test Page

## Quick Access

The notification test page is now available in your app's sidebar!

### Step 1: Start Your Dev Server
```bash
npm run dev
```

### Step 2: Open Your App
Navigate to: `http://localhost:5173` (or your dev server URL)

### Step 3: Find the Test Page in Sidebar

Look in the **Admin** section of your sidebar menu:

```
📊 Dashboard
✅ Work Management
📅 Calendar
💬 Chat
...

👥 Admin Section:
├─ 👥 Users
├─ 📋 Activity Logs
└─ 🔔 🧪 Test Notifications  ← Click here!
```

### Step 4: Run Tests

Once on the test page, you'll see:

1. **Stats Dashboard** - Shows current notification counts
2. **Test Controls** - Buttons to run individual or all tests
3. **Test Log** - Real-time log of test results
4. **Current Preferences** - Your notification settings
5. **Scheduled Notifications** - List of pending notifications

Click **"🚀 Run All Tests"** to execute the complete test suite!

---

## Alternative: Direct Browser Console Testing

If you prefer to test via console:

### 1. Get Your User ID
```javascript
// Open browser console (F12)
// Paste this:
const { currentUser } = useAuth();
console.log('User ID:', currentUser.id);
```

### 2. Create a Test Notification
```javascript
import { notificationsApi } from './utils/api/notifications';

await notificationsApi.createNotification({
  user_id: 'YOUR_USER_ID_HERE',
  title: '🎉 Test Notification',
  message: 'If you see this, it works!',
  type: 'success'
});
```

### 3. Check the Bell Icon
Look for the bell icon 🔔 in your header - it should show an unread count!

---

## What to Test

### Quick Tests (5 minutes)
- [ ] Click "Run All Tests" button
- [ ] Check test log for results
- [ ] Open NotificationCenter (bell icon)
- [ ] Verify notifications appear
- [ ] Test filtering by type
- [ ] Test marking as read

### Real-time Test (Most Important!)
1. Open your app in **two browser windows**
2. Log in as the same user in both
3. In window 1, click "1. Create" test button
4. Watch window 2 - notification should appear **instantly**! ⚡

### Full Test Suite (30 minutes)
Follow the complete checklist in: `NOTIFICATION_TESTING_CHECKLIST.md`

---

## Troubleshooting

### Can't See the Test Page?

**Check 1**: Make sure you're logged in as an admin user

**Check 2**: Check the sidebar - it's in the "Admin" section

**Check 3**: If still not visible, manually navigate:
```javascript
// In browser console
window.location.href = '/crm';
// Then look for "🧪 Test Notifications" in sidebar
```

### Test Page Shows "Please log in"?

You need to be authenticated. Log in first, then access the test page.

### Tests Failing?

1. **Check Supabase connection** - Verify your .env.local has correct credentials
2. **Check database migration** - Ensure you ran the migration
3. **Check browser console** - Look for error messages
4. **Check Supabase logs** - Go to Supabase Dashboard > Logs

---

## Quick Verification

After running tests, you should see:

✅ **Notifications created** - Check the stats dashboard  
✅ **Toast notifications** - Should appear in top-right  
✅ **Bell icon badge** - Shows unread count  
✅ **NotificationCenter** - Opens when clicking bell  
✅ **Test log** - Shows green checkmarks ✅  

---

## Next Steps

Once basic tests pass:

1. ✅ Test real-time functionality (2 windows)
2. ✅ Test notification preferences
3. ✅ Test scheduled notifications
4. ✅ Test filtering and grouping
5. ✅ Integrate with your work management system

---

## Need Help?

- **Full Documentation**: `NOTIFICATION_SYSTEM_COMPLETE.md`
- **Quick Start**: `NOTIFICATION_QUICK_START.md`
- **Usage Examples**: `NOTIFICATION_USAGE_EXAMPLES.md`
- **Testing Checklist**: `NOTIFICATION_TESTING_CHECKLIST.md`

---

## 🎉 You're Ready!

The test page is now accessible in your sidebar. Just:

1. Start your dev server
2. Open your app
3. Look in the Admin section
4. Click "🧪 Test Notifications"
5. Click "Run All Tests"

**Happy testing!** 🚀
