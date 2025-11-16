# 🧪 Test Chat Notifications - Step by Step

## Prerequisites

1. ✅ RLS policy for INSERT on notifications table
2. ✅ Chat notifications hook integrated
3. ✅ Two users (or two browser windows)

## Test Scenario

### Setup
1. **Window 1**: Log in as User A
2. **Window 2**: Log in as User B
3. **Both**: Open browser console (F12)

### Step 1: Verify Hook is Running

In both consoles, you should see:
```
🔔 Setting up chat notifications for user: [user-id]
📡 Chat notifications subscription status: SUBSCRIBED
```

If you don't see this, the hook isn't running. Refresh the page.

### Step 2: Send a Message

**In Window 1 (User A)**:
1. Open chat
2. Start a conversation with User B (or use existing conversation)
3. Send a message: "Hello, this is a test!"

### Step 3: Check Window 1 Console (Sender)

You should see:
```
📨 New message received: [message-id] from: [user-a-id]
⏭️ Skipping own message
```

This is correct - you don't get notified of your own messages.

### Step 4: Check Window 2 Console (Receiver)

You should see:
```
📨 New message received: [message-id] from: [user-a-id]
💬 Conversation type: direct (or group/channel)
✅ Creating notification for message from: User A
🎉 Notification created successfully!
```

### Step 5: Check Window 2 UI (Receiver)

You should see:
- 🔔 Bell icon shows unread count (1)
- 🎉 Toast notification appears: "New message from User A"
- 📋 Notification in NotificationCenter when you click the bell

---

## Troubleshooting

### Issue: No logs in console

**Problem**: Hook not running

**Fix**: 
1. Hard refresh (Ctrl+Shift+R)
2. Check that you're logged in
3. Check browser console for errors

### Issue: "⏭️ Skipping own message" for both users

**Problem**: Both windows logged in as same user

**Fix**: Log in as different users in each window

### Issue: "⏭️ Not a participant in this conversation"

**Problem**: User B is not in the conversation

**Fix**: 
1. Make sure you're sending to a conversation that includes User B
2. Check in SQL:
```sql
SELECT * FROM conversation_participants 
WHERE conversation_id = 'YOUR_CONVERSATION_ID';
```

### Issue: "⏭️ Skipping personal chat notification"

**Problem**: You're using personal chat (notes to yourself)

**Fix**: Use a direct chat, group chat, or channel instead. Personal chat is for notes to yourself, so no notifications are sent.

### Issue: "❌ Error creating chat notification"

**Problem**: RLS policy blocking or other error

**Fix**: Check the error details in console. Likely need to run:
```sql
CREATE POLICY "System can create notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (true);
```

### Issue: Logs show success but no notification appears

**Problem**: Notification created but not showing in UI

**Fix**:
1. Check NotificationCenter - click the bell icon
2. Check database:
```sql
SELECT * FROM notifications 
WHERE user_id = 'USER_B_ID' 
ORDER BY created_at DESC 
LIMIT 5;
```
3. If notification is in database but not showing, refresh the page

---

## Quick SQL Checks

### Check if notification was created
```sql
SELECT id, user_id, title, message, created_at 
FROM notifications 
ORDER BY created_at DESC 
LIMIT 5;
```

### Check conversation type
```sql
SELECT id, name, type 
FROM conversations 
WHERE id = 'YOUR_CONVERSATION_ID';
```

### Check participants
```sql
SELECT cp.*, u.full_name 
FROM conversation_participants cp
JOIN users u ON u.id = cp.user_id
WHERE cp.conversation_id = 'YOUR_CONVERSATION_ID';
```

### Check messages
```sql
SELECT id, conversation_id, sender_id, content, created_at 
FROM messages 
ORDER BY created_at DESC 
LIMIT 5;
```

---

## Expected Console Output

### Sender (User A):
```
🔔 Setting up chat notifications for user: user-a-id
📡 Chat notifications subscription status: SUBSCRIBED
📨 New message received: msg-123 from: user-a-id
⏭️ Skipping own message
```

### Receiver (User B):
```
🔔 Setting up chat notifications for user: user-b-id
📡 Chat notifications subscription status: SUBSCRIBED
📨 New message received: msg-123 from: user-a-id
💬 Conversation type: direct
✅ Creating notification for message from: User A
🎉 Notification created successfully!
```

---

## Success Checklist

After sending a test message, verify:

- [ ] ✅ Sender console shows "⏭️ Skipping own message"
- [ ] ✅ Receiver console shows "🎉 Notification created successfully!"
- [ ] ✅ Receiver sees toast notification
- [ ] ✅ Receiver's bell icon shows unread count
- [ ] ✅ Notification appears in NotificationCenter
- [ ] ✅ Clicking notification navigates to chat
- [ ] ✅ No errors in console

---

## If Everything Works

Congratulations! 🎉 Your chat notification system is working perfectly!

Now you can:
1. Test with different conversation types (direct, group, channel)
2. Test with multiple users
3. Test notification preferences
4. Integrate with other features (task assignments, mentions, etc.)

---

## If Still Not Working

1. **Share console logs** - Copy the console output from both windows
2. **Check SQL** - Run the SQL queries above and share results
3. **Check RLS** - Verify the INSERT policy exists
4. **Check realtime** - Verify realtime is enabled on messages table

**With the detailed logging, we can pinpoint exactly where it's failing!**
