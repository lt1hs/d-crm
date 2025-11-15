# 🐛 Debug Chat Notifications

## Step-by-Step Debugging

### Step 1: Check Browser Console

Open browser console (F12) and look for:
- ✅ "🔔 Setting up chat notifications" - This means the hook is running
- ❌ Any error messages

### Step 2: Verify RLS Policy

Run in Supabase SQL Editor:

```sql
-- Check if INSERT policy exists
SELECT policyname, cmd, with_check 
FROM pg_policies 
WHERE tablename = 'notifications' AND cmd = 'INSERT';
```

**Expected**: Should show a policy with `cmd = 'INSERT'`

### Step 3: Test Manual Notification Creation

In browser console:

```javascript
// Get your user ID
const { currentUser } = useAuth();
console.log('User ID:', currentUser.id);

// Try to create a notification manually
import { notificationsApi } from './utils/api/notifications';

await notificationsApi.createNotification({
  user_id: currentUser.id,
  title: 'Manual Test',
  message: 'Testing notification creation',
  type: 'info'
});
```

**Expected**: Should create notification without errors

### Step 4: Check Real-time Subscription

In browser console:

```javascript
// Check if chat-notifications channel is active
console.log('Supabase channels:', supabase.getChannels());
```

Look for a channel named `'chat-notifications'`

### Step 5: Test Message Sending

1. Open your app in **two browser windows**
2. Log in as **different users** in each window
3. Send a message from User A to User B
4. Check User B's console for:
   - "🔔 Setting up chat notifications"
   - Any errors or logs

### Step 6: Check Database

After sending a message, check in Supabase SQL Editor:

```sql
-- Check if notification was created
SELECT * FROM notifications 
ORDER BY created_at DESC 
LIMIT 5;

-- Check if message was created
SELECT * FROM messages 
ORDER BY created_at DESC 
LIMIT 5;
```

---

## Common Issues

### Issue 1: Hook Not Running

**Symptom**: No "🔔 Setting up chat notifications" in console

**Fix**: The hook is in `EnhancedChatContext`, make sure you're using the chat feature

### Issue 2: RLS Policy Blocking

**Symptom**: Error "violates row-level security policy"

**Fix**: Run the RLS fix SQL:
```sql
CREATE POLICY "System can create notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (true);
```

### Issue 3: Personal Chat Messages

**Symptom**: Notifications work for group chats but not direct messages

**Reason**: The code skips personal chat notifications:
```typescript
if (isPersonal) return; // Don't notify for personal chat
```

This is intentional - personal chat is just you talking to yourself.

### Issue 4: Own Messages

**Symptom**: Not getting notifications for your own messages

**Reason**: The code skips your own messages:
```typescript
if (message.sender_id === currentUser.id) return;
```

This is correct - you shouldn't be notified of your own messages.

### Issue 5: Not in Conversation

**Symptom**: No notification even though message was sent

**Reason**: You're not a participant in that conversation

**Check**:
```sql
SELECT * FROM conversation_participants 
WHERE user_id = 'YOUR_USER_ID';
```

---

## Quick Test Script

Run this complete test in browser console:

```javascript
console.log('=== CHAT NOTIFICATION DEBUG ===');

// 1. Check user
const { currentUser } = useAuth();
console.log('1. Current User:', currentUser?.id, currentUser?.email);

// 2. Check if hook is running
console.log('2. Look for "🔔 Setting up chat notifications" above');

// 3. Check Supabase channels
console.log('3. Active channels:', supabase.getChannels().map(c => c.topic));

// 4. Check RLS policies
console.log('4. Run this SQL to check policies:');
console.log('   SELECT * FROM pg_policies WHERE tablename = \'notifications\';');

// 5. Try manual notification
console.log('5. Testing manual notification...');
import { notificationsApi } from './utils/api/notifications';
try {
  await notificationsApi.createNotification({
    user_id: currentUser.id,
    title: 'Debug Test',
    message: 'If you see this, notifications work!',
    type: 'info'
  });
  console.log('✅ Manual notification created successfully!');
} catch (error) {
  console.error('❌ Manual notification failed:', error);
}

console.log('=== END DEBUG ===');
```

---

## Expected Behavior

When User A sends a message to User B:

1. **User A's side**:
   - Message appears in chat
   - No notification (it's their own message)

2. **User B's side**:
   - Message appears in chat (real-time)
   - Notification created in database
   - Toast notification appears
   - Bell icon shows unread count
   - Notification appears in NotificationCenter

---

## If Still Not Working

### Check 1: Realtime Enabled on Messages Table

In Supabase Dashboard:
1. Go to Database → Replication
2. Find `messages` table
3. Make sure realtime is enabled

### Check 2: Refresh App

Sometimes you need to:
1. Hard refresh (Ctrl+Shift+R)
2. Or restart dev server
3. Clear browser cache

### Check 3: Check Conversation Type

```sql
-- Check conversation type
SELECT id, name, type FROM conversations;
```

If type is `'personal'`, notifications are skipped by design.

---

## Next Steps

Based on the debug results, we can:
1. Fix RLS policies if needed
2. Enable realtime if not enabled
3. Fix the hook if not running
4. Adjust notification logic if needed

**Run the debug script above and share the results!**
