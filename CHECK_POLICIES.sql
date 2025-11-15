-- Run this in Supabase SQL Editor to check what policies exist

-- 1. Check if RLS is enabled
SELECT 
  tablename, 
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('conversations', 'conversation_participants');

-- 2. Check existing policies on conversations
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd as command,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies 
WHERE tablename = 'conversations';

-- 3. Check existing policies on conversation_participants
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd as command,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies 
WHERE tablename = 'conversation_participants';

-- 4. Check if helper function exists
SELECT 
  proname as function_name,
  prosecdef as is_security_definer
FROM pg_proc 
WHERE proname = 'is_conversation_member';

-- 5. Test if you can insert (this will fail if policy doesn't work)
-- Replace 'YOUR_USER_ID' with your actual user ID: 6fd7107e-5f24-4123-8299-d77834aea296
DO $$
BEGIN
  -- Try to insert a test conversation
  INSERT INTO conversations (name, type, created_by)
  VALUES ('Test Personal Chat', 'personal', '6fd7107e-5f24-4123-8299-d77834aea296');
  
  RAISE NOTICE 'SUCCESS: Insert worked! Policy is correct.';
  
  -- Clean up the test
  DELETE FROM conversations WHERE name = 'Test Personal Chat' AND type = 'personal';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'FAILED: Insert blocked. Error: %', SQLERRM;
END $$;
