# ✅ Notification System - Complete Testing Checklist

## Pre-Testing Setup

- [x] Database migration applied (`004_enhance_notifications.sql`)
- [x] All tables created (notifications, notification_preferences, notification_groups, scheduled_notifications, notification_delivery_log)
- [x] All functions created (should_send_notification, process_scheduled_notifications, etc.)
- [x] RLS policies enabled
- [x] Real-time enabled on notifications table
- [x] Test component created (`NotificationSystemTest.tsx`)
- [x] Test component integrated into app

## Core Functionality Tests

### 1. Create Notification Manually ✅
**Test**: Create a basic notification
```javascript
await notificationsApi.createNotification({
  user_id: currentUser.id,
  title: 'Test Notification',
  message: 'This is a test',
  type: 'info'
});
```

**Expected Result**:
- [ ] Notification appears in database
- [ ] Notification appears in NotificationCenter
- [ ] Unread count increases
- [ ] Toast notification appears

---

### 2. Verify Real-time Delivery ⚡
**Test**: Open app in two browser windows, create notification in one

**Expected Result**:
- [ ] Notification appears instantly in both windows
- [ ] No page refresh needed
- [ ] Real-time subscription is active (check console)

---

### 3. Test Toast Notifications 🎉
**Test**: Trigger different toast types
```javascript
showSuccess('Success message');
showError('Error message');
showWarning('Warning message');
showInfo('Info message');
```

**Expected Result**:
- [ ] Toast appears in top-right corner
- [ ] Correct icon and color for each type
- [ ] Auto-dismisses after 5 seconds
- [ ] Can be manually closed with X button

---

### 4. Test Browser Notifications 📱
**Test**: Request permission and send browser notification

**Expected Result**:
- [ ] Permission request appears
- [ ] Browser notification shows (if granted)
- [ ] Notification has correct title and body
- [ ] Icon displays correctly

---

### 5. Test Sound Alerts 🔊
**Test**: Create notification with sound enabled in preferences

**Expected Result**:
- [ ] Sound plays when notification arrives
- [ ] Sound respects user preferences
- [ ] No sound during quiet hours

---

### 6. Mark as Read/Unread 📖
**Test**: Click mark as read button on notification

**Expected Result**:
- [ ] Notification marked as read
- [ ] Unread count decreases
- [ ] Blue dot indicator disappears
- [ ] Can mark as unread again

---

### 7. Delete Notifications 🗑️
**Test**: Delete individual notification

**Expected Result**:
- [ ] Notification removed from list
- [ ] Unread count updates if was unread
- [ ] Notification removed from database

---

### 8. Mark All as Read 📚
**Test**: Click "Mark all as read" button

**Expected Result**:
- [ ] All notifications marked as read
- [ ] Unread count becomes 0
- [ ] All blue dots disappear

---

### 9. Clear Read Notifications 🧹
**Test**: Click "Clear read" button

**Expected Result**:
- [ ] All read notifications deleted
- [ ] Unread notifications remain
- [ ] Count updates correctly

---

### 10. Update Preferences ⚙️
**Test**: Change notification preferences and save

**Expected Result**:
- [ ] Preferences save successfully
- [ ] Success message appears
- [ ] Preferences persist after page refresh
- [ ] New notifications respect preferences

---

### 11. Test Quiet Hours 🌙
**Test**: Enable quiet hours for current time

**Expected Result**:
- [ ] Notifications suppressed during quiet hours
- [ ] Notifications resume after quiet hours end
- [ ] Scheduled notifications wait until after quiet hours

---

### 12. Schedule Notification ⏰
**Test**: Schedule notification for 2 minutes from now

**Expected Result**:
- [ ] Notification created in scheduled_notifications table
- [ ] Notification appears after scheduled time
- [ ] Marked as sent in database

---

### 13. Verify Scheduled Processing 🔄
**Test**: Manually run `process_scheduled_notifications()`

**Expected Result**:
- [ ] Pending scheduled notifications processed
- [ ] Notifications created in notifications table
- [ ] Marked as sent with sent_at timestamp

---

### 14. Test Notification Grouping 📦
**Test**: Create 5+ similar notifications

**Expected Result**:
- [ ] Notifications grouped by date (Today, Yesterday, etc.)
- [ ] Group headers display correctly
- [ ] Notifications sorted within groups

---

### 15. Test Type Filtering 🎯
**Test**: Filter notifications by type (task, mention, etc.)

**Expected Result**:
- [ ] Only selected type shows
- [ ] Filter buttons work correctly
- [ ] "All" shows all types

---

### 16. Test Date Grouping 📅
**Test**: Create notifications on different days

**Expected Result**:
- [ ] Grouped into: Today, Yesterday, This Week, Older
- [ ] Correct grouping logic
- [ ] Groups display in correct order

---

## Advanced Feature Tests

### 17. Test Task Assignment Notification 📋
**Test**: Use `notifyTaskAssigned()` helper

**Expected Result**:
- [ ] Notification sent to assignee
- [ ] Correct title and message
- [ ] Action URL works
- [ ] Metadata includes task info

---

### 18. Test Project Team Notification 👥
**Test**: Use `notifyProjectTeam()` helper

**Expected Result**:
- [ ] All team members notified
- [ ] Batch insert works
- [ ] No duplicate notifications

---

### 19. Test Mention Notification 💬
**Test**: Use `notifyMention()` helper

**Expected Result**:
- [ ] Mentioned user notified
- [ ] Context information correct
- [ ] Action URL navigates correctly

---

### 20. Test Deadline Reminder ⏳
**Test**: Use `scheduleDeadlineReminder()` helper

**Expected Result**:
- [ ] Reminder scheduled correctly
- [ ] Multiple reminders (1 week, 1 day, 1 hour)
- [ ] Only future reminders scheduled

---

### 21. Test Notification Preferences UI 🎨
**Test**: Open preferences modal and test all settings

**Expected Result**:
- [ ] All toggles work
- [ ] Time pickers work
- [ ] Day selector works
- [ ] Save button works
- [ ] Changes persist

---

### 22. Test Quiet Hours Logic 🕐
**Test**: Set quiet hours and verify suppression

**Expected Result**:
- [ ] Notifications suppressed during hours
- [ ] `should_send_notification()` returns false
- [ ] Notifications resume after

---

### 23. Test Daily Digest 📧
**Test**: Enable daily digest

**Expected Result**:
- [ ] Setting saves correctly
- [ ] Time picker works
- [ ] (Email integration needed for full test)

---

### 24. Test Weekly Digest 📬
**Test**: Enable weekly digest

**Expected Result**:
- [ ] Setting saves correctly
- [ ] Day selector works
- [ ] (Email integration needed for full test)

---

### 25. Test Notification Summary 📊
**Test**: Call `getNotificationSummary()`

**Expected Result**:
- [ ] Returns aggregated stats
- [ ] Grouped by type
- [ ] Shows total and unread counts

---

## UI/UX Tests

### 26. Test NotificationCenter Dropdown 🔽
**Test**: Click bell icon

**Expected Result**:
- [ ] Dropdown opens smoothly
- [ ] Positioned correctly
- [ ] Backdrop closes dropdown
- [ ] Scrollable if many notifications

---

### 27. Test Unread Badge 🔴
**Test**: Check badge on bell icon

**Expected Result**:
- [ ] Shows correct unread count
- [ ] Updates in real-time
- [ ] Shows "9+" for 10+ notifications
- [ ] Animates (pulse effect)

---

### 28. Test Notification Icons 🎨
**Test**: Check icons for different types

**Expected Result**:
- [ ] Correct emoji/icon for each type
- [ ] Colors match type
- [ ] Icons display consistently

---

### 29. Test Action URLs 🔗
**Test**: Click notification with action URL

**Expected Result**:
- [ ] Navigates to correct page
- [ ] Marks notification as read
- [ ] Closes dropdown

---

### 30. Test Empty States 📭
**Test**: View notifications when none exist

**Expected Result**:
- [ ] Shows "No notifications" message
- [ ] Shows appropriate icon
- [ ] No errors in console

---

## Performance Tests

### 31. Test with Many Notifications 📈
**Test**: Create 100+ notifications

**Expected Result**:
- [ ] List renders smoothly
- [ ] Scrolling is smooth
- [ ] No lag or freezing
- [ ] Pagination works (if implemented)

---

### 32. Test Real-time Performance ⚡
**Test**: Create notifications rapidly

**Expected Result**:
- [ ] All notifications arrive
- [ ] No duplicates
- [ ] No missed notifications
- [ ] UI remains responsive

---

### 33. Test Database Performance 💾
**Test**: Query notifications with filters

**Expected Result**:
- [ ] Queries execute quickly (< 200ms)
- [ ] Indexes are used
- [ ] No full table scans

---

## Security Tests

### 34. Test RLS Policies 🔒
**Test**: Try to access another user's notifications

**Expected Result**:
- [ ] Cannot see other users' notifications
- [ ] Cannot modify other users' notifications
- [ ] Cannot delete other users' notifications

---

### 35. Test Preference Security 🛡️
**Test**: Try to modify another user's preferences

**Expected Result**:
- [ ] Cannot update other users' preferences
- [ ] RLS blocks unauthorized access
- [ ] Error handled gracefully

---

## Integration Tests

### 36. Test with Work Management 💼
**Test**: Assign a task and verify notification

**Expected Result**:
- [ ] Assignee receives notification
- [ ] Notification has correct details
- [ ] Action URL works

---

### 37. Test with Chat System 💬
**Test**: Send a message and verify notification

**Expected Result**:
- [ ] Participants notified (except sender)
- [ ] Notification has message preview
- [ ] Action URL opens chat

---

### 38. Test with Project Management 📁
**Test**: Update project and notify team

**Expected Result**:
- [ ] All team members notified
- [ ] Notification has project details
- [ ] Action URL works

---

## Error Handling Tests

### 39. Test Network Errors 🌐
**Test**: Disconnect network and try to create notification

**Expected Result**:
- [ ] Error handled gracefully
- [ ] User sees error message
- [ ] No app crash

---

### 40. Test Invalid Data ❌
**Test**: Try to create notification with invalid data

**Expected Result**:
- [ ] Validation catches errors
- [ ] User sees helpful error message
- [ ] Database constraints enforced

---

## Browser Compatibility Tests

### 41. Test in Chrome ✅
- [ ] All features work
- [ ] No console errors
- [ ] UI renders correctly

### 42. Test in Firefox ✅
- [ ] All features work
- [ ] No console errors
- [ ] UI renders correctly

### 43. Test in Safari ✅
- [ ] All features work
- [ ] No console errors
- [ ] UI renders correctly

### 44. Test in Edge ✅
- [ ] All features work
- [ ] No console errors
- [ ] UI renders correctly

---

## Mobile Tests

### 45. Test on Mobile Browser 📱
- [ ] UI responsive
- [ ] Touch interactions work
- [ ] Dropdown works on mobile
- [ ] No layout issues

---

## Accessibility Tests

### 46. Test Keyboard Navigation ⌨️
- [ ] Can navigate with Tab
- [ ] Can close with Escape
- [ ] Can activate with Enter/Space
- [ ] Focus indicators visible

### 47. Test Screen Reader 🔊
- [ ] Notifications announced
- [ ] Buttons have labels
- [ ] ARIA attributes correct
- [ ] Semantic HTML used

---

## Final Verification

### 48. Check Database Tables ✅
```sql
SELECT COUNT(*) FROM notifications;
SELECT COUNT(*) FROM notification_preferences;
SELECT COUNT(*) FROM notification_groups;
SELECT COUNT(*) FROM scheduled_notifications;
```

### 49. Check Functions ✅
```sql
SELECT process_scheduled_notifications();
SELECT should_send_notification('user-id', 'task_assigned');
```

### 50. End-to-End Test 🎯
**Complete workflow**:
1. Create notification
2. Receive in real-time
3. See toast
4. Check NotificationCenter
5. Filter by type
6. Mark as read
7. Update preferences
8. Schedule notification
9. Wait for delivery
10. Verify all working

---

## Test Results Summary

**Total Tests**: 50  
**Passed**: ___  
**Failed**: ___  
**Skipped**: ___  

**Overall Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

---

## Notes

Use this space to document any issues found during testing:

```
Issue 1: [Description]
- Steps to reproduce:
- Expected behavior:
- Actual behavior:
- Fix applied:

Issue 2: [Description]
...
```

---

## Sign-off

**Tested By**: _______________  
**Date**: _______________  
**Status**: ⬜ Pass | ⬜ Fail | ⬜ Needs Review  

---

**Ready for Production**: ⬜ Yes | ⬜ No | ⬜ With Conditions

**Conditions** (if any):
- [ ] Condition 1
- [ ] Condition 2
