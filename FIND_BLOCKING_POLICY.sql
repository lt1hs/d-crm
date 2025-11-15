-- Find what's blocking the INSERT

-- 1. Show ALL policies on conversations (including restrictive ones)
SELECT 
  'All policies on conversations:' as info,
  policyname,
  cmd,
  permissive,
  roles,
  qual as using_clause,
  with_check
FROM pg_policies 
WHERE tablename = 'conversations'
ORDER BY cmd, permissive;

-- 2. Check if there are any RESTRICTIVE policies
SELECT 
  'RESTRICTIVE policies (these block everything):' as info,
  policyname,
  cmd
FROM pg_policies 
WHERE tablename = 'conversations' 
AND permissive = 'RESTRICTIVE';

-- 3. Drop ALL policies and start fresh
DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update conversations" ON conversations;
DROP POLICY IF EXISTS "Users can delete conversations" ON conversations;

-- Drop any other policies that might exist
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'conversations'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON conversations';
    END LOOP;
END$$;

-- 4. Create ONE simple policy
CREATE POLICY "allow_authenticated_insert" 
ON conversations
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- 5. Create ONE simple SELECT policy
CREATE POLICY "allow_authenticated_select" 
ON conversations
FOR SELECT 
TO authenticated
USING (true);

-- 6. Verify
SELECT 'New policies:' as info;
SELECT policyname, cmd, permissive FROM pg_policies WHERE tablename = 'conversations';

SELECT 'Done! Try now.' as status;
