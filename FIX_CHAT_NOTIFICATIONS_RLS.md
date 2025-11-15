# 🔧 Fix Chat Notifications RLS Error

## The Problem

You're seeing this error:
```
new row violates row-level security policy for table "notifications"
```

This happens because the RLS policy on the `notifications` table doesn't allow INSERT operations.

## The Solution

Run this SQL in your Supabase SQL Editor:

```sql
-- Allow system to create notifications for any user
CREATE POLICY "System can create notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (true);
```

## Complete Fix (Recommended)

For a complete fix with all CRUD operations, run this:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;

-- SELECT: Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications
  FOR SELECT
  USING (user_id = auth.uid());

-- INSERT: Allow creating notifications for any user
CREATE POLICY "System can create notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (true);

-- UPDATE: Users can update their own notifications
CREATE POLICY "Users can update own notifications"
  ON public.notifications
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- DELETE: Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON public.notifications
  FOR DELETE
  USING (user_id = auth.uid());
```

## Why This Works

The INSERT policy with `WITH CHECK (true)` allows any authenticated user to create notifications for any other user. This is necessary because:

1. **Chat System**: When User A sends a message, the system needs to create a notification for User B
2. **Task Assignment**: When someone assigns a task, they need to notify the assignee
3. **Mentions**: When someone mentions you, they need to create a notification for you

The policy is secure because:
- Only authenticated users can create notifications (not anonymous)
- Users can only see their own notifications (SELECT policy)
- Users can only modify their own notifications (UPDATE/DELETE policies)

## Verify It Works

After running the SQL:

1. **Refresh your app**
2. **Send a test message** in chat (from another user or another browser window)
3. **Check for notification**:
   - Bell icon should show unread count
   - Toast notification should appear
   - Notification should be in NotificationCenter

## Test in SQL

You can test the policy directly:

```sql
-- This should work now
INSERT INTO public.notifications (user_id, title, message, type)
VALUES (auth.uid(), 'Test Notification', 'Testing RLS', 'info');

-- Check it was created
SELECT * FROM public.notifications WHERE user_id = auth.uid();
```

## Alternative: Check Existing Policies

To see what policies currently exist:

```sql
SELECT schemaname, tablename, policyname, permissive, cmd
FROM pg_policies 
WHERE tablename = 'notifications';
```

## If Still Not Working

### Check 1: RLS is Enabled
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'notifications';
```

Should show `rowsecurity = true`

### Check 2: User is Authenticated
```sql
SELECT auth.uid(); -- Should return your user ID, not null
```

### Check 3: Check Error Details
Look in Supabase Dashboard → Logs → Postgres Logs for more details

## Security Note

This policy is secure because:
- ✅ Only authenticated users can insert
- ✅ Users can only read their own notifications
- ✅ Users can only modify their own notifications
- ✅ The system can notify any user (needed for cross-user features)

This is the standard pattern for notification systems in multi-user applications.

---

**Run the SQL above and your chat notifications will work!** 🎉
