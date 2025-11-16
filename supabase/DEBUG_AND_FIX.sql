-- ============================================
-- DEBUG AND FIX - Run this to see what's wrong and fix it
-- ============================================

-- 1. Check current policies on conversations
SELECT 'Current policies on conversations:' as info;
SELECT 
  policyname, 
  cmd as command,
  roles,
  CASE 
    WHEN qual IS NOT NULL THEN 'Has USING clause'
    ELSE 'No USING clause'
  END as using_check,
  CASE 
    WHEN with_check IS NOT NULL THEN 'Has WITH CHECK clause'
    ELSE 'No WITH CHECK clause'
  END as with_check_status
FROM pg_policies 
WHERE tablename = 'conversations';

-- 2. Check if RLS is enabled
SELECT 'RLS Status:' as info;
SELECT 
  tablename,
  CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as rls_status
FROM pg_tables 
WHERE tablename = 'conversations';

-- 3. Now let's fix it properly
-- Drop all policies
DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update conversations" ON conversations;
DROP POLICY IF EXISTS "Users can delete conversations" ON conversations;

-- Create the INSERT policy with explicit role
CREATE POLICY "Users can create conversations" 
ON conversations
FOR INSERT 
TO authenticated
WITH CHECK (
  created_by = auth.uid()
);

-- Create the SELECT policy
CREATE POLICY "Users can view their conversations" 
ON conversations
FOR SELECT 
TO authenticated
USING (
  public.is_conversation_member(id, auth.uid())
);

-- 4. Grant permissions explicitly
GRANT INSERT ON conversations TO authenticated;
GRANT SELECT ON conversations TO authenticated;
GRANT UPDATE ON conversations TO authenticated;

-- 5. Verify the new policies
SELECT 'New policies created:' as info;
SELECT 
  policyname, 
  cmd as command,
  roles
FROM pg_policies 
WHERE tablename = 'conversations';

-- 6. Test if INSERT works now
SELECT 'Testing INSERT (this should work):' as info;
DO $$
DECLARE
  test_id uuid;
BEGIN
  -- Try to insert as the authenticated user
  INSERT INTO conversations (name, type, created_by)
  VALUES ('Test', 'personal', '6fd7107e-5f24-4123-8299-d77834aea296')
  RETURNING id INTO test_id;
  
  RAISE NOTICE 'SUCCESS! Insert worked. Conversation ID: %', test_id;
  
  -- Clean up
  DELETE FROM conversations WHERE id = test_id;
  RAISE NOTICE 'Test conversation deleted.';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'FAILED! Error: %', SQLERRM;
END $$;

SELECT 'Done! Check the messages above.' as status;
