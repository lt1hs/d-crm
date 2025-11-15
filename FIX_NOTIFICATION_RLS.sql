-- =====================================================
-- FIX: Notification RLS Policy for INSERT
-- =====================================================
-- The chat notification system needs permission to create notifications

-- Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'notifications';

-- Drop existing restrictive policies if any
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;

-- Create comprehensive RLS policies for notifications

-- 1. SELECT: Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications
  FOR SELECT
  USING (user_id = auth.uid());

-- 2. INSERT: Allow creating notifications for any user (system can notify anyone)
CREATE POLICY "System can create notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (true);

-- 3. UPDATE: Users can update their own notifications (mark as read, etc.)
CREATE POLICY "Users can update own notifications"
  ON public.notifications
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 4. DELETE: Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON public.notifications
  FOR DELETE
  USING (user_id = auth.uid());

-- Verify policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename = 'notifications'
ORDER BY policyname;

-- Test: Try to create a notification
-- INSERT INTO public.notifications (user_id, title, message, type)
-- VALUES (auth.uid(), 'Test Notification', 'Testing RLS', 'info');
