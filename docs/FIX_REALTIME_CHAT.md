# Fix Real-Time Chat & Online Status

## Problem
- Messages don't appear in real-time
- Need to refresh to see new messages
- Online status not updating

## Root Cause
Supabase Realtime is not enabled for the chat tables.

## Solution

### Step 1: Enable Realtime in Supabase Dashboard

**Option A: Using SQL (Recommended)**
1. Open Supabase Dashboard → SQL Editor
2. Run `ENABLE_REALTIME.sql`
3. You should see the tables listed

**Option B: Using Dashboard UI**
1. Go to Supabase Dashboard → Database → Replication
2. Find these tables and enable replication:
   - `messages` ✅
   - `conversations` ✅
   - `users` ✅
3. Click "Save"

### Step 2: Verify Realtime is Working

Open browser console and look for:
```
Setting up real-time message subscription...
Subscription status: SUBSCRIBED
```

When a message is sent, you should see:
```
New message received: {id: "...", content: "...", ...}
Reloading messages for active conversation...
```

### Step 3: Test

1. Open your app in two different browsers (or incognito)
2. Login as different users
3. Start a chat between them
4. Send a message from User A
5. User B should see it immediately without refresh

## Online Status

The online status is currently static. To make it dynamic:

### Option 1: Use Supabase Presence (Recommended)

Add this to `EnhancedChatContext.tsx`:

```typescript
// Track user presence
useEffect(() => {
  if (!currentUser) return;

  const channel = supabase.channel('online-users');
  
  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      console.log('Online users:', state);
      // Update users list with online status
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          user_id: currentUser.id,
          online_at: new Date().toISOString()
        });
      }
    });

  return () => {
    channel.unsubscribe();
  };
}, [currentUser]);
```

### Option 2: Update Status in Database

Update user status when they login/logout:

```typescript
// On login
await supabase
  .from('users')
  .update({ status: 'online' })
  .eq('id', userId);

// On logout or window close
await supabase
  .from('users')
  .update({ status: 'offline' })
  .eq('id', userId);
```

## Troubleshooting

### Messages still not appearing in real-time?

1. **Check console for errors**
   - Look for "Subscription status: SUBSCRIBED"
   - If you see "CLOSED" or errors, realtime isn't working

2. **Verify Realtime is enabled**
   ```sql
   SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
   ```
   Should show `messages`, `conversations`, and `users`

3. **Check Supabase project settings**
   - Go to Settings → API
   - Ensure Realtime is enabled (not paused)

4. **Check RLS policies**
   - Users need SELECT permission on messages table
   - Run: `SELECT * FROM pg_policies WHERE tablename = 'messages';`

### Subscription not connecting?

1. **Check Supabase URL and keys**
   - Verify `.env.local` has correct values
   - `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

2. **Check browser console**
   - Look for WebSocket connection errors
   - Check if blocked by firewall/proxy

3. **Try reconnecting**
   - Refresh the page
   - Clear browser cache
   - Try different browser

### Online status not updating?

1. **Enable realtime for users table**
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE users;
   ```

2. **Subscribe to user changes**
   - Add subscription for users table
   - Update UI when status changes

3. **Use Supabase Presence**
   - More reliable for online/offline status
   - Automatically handles disconnections

## Performance Tips

1. **Limit subscription scope**
   - Only subscribe to active conversation
   - Unsubscribe when leaving chat

2. **Batch updates**
   - Don't reload entire conversation list on every message
   - Only update the specific conversation

3. **Use filters**
   - Filter realtime events by conversation_id
   - Reduces unnecessary updates

## Example: Filtered Subscription

```typescript
const subscription = supabase
  .channel(`conversation:${conversationId}`)
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${conversationId}` // Only this conversation
    },
    (payload) => {
      // Handle new message
    }
  )
  .subscribe();
```

---

**After enabling realtime, messages should appear instantly!** 🚀
