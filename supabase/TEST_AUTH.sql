-- Test if authentication is working properly
-- Run this in Supabase SQL Editor

-- 1. Check what user you are (in SQL Editor, this will be NULL)
SELECT 
  'Your user ID in SQL Editor:' as info,
  auth.uid() as user_id,
  auth.role() as role;

-- 2. Check if the policy WITH CHECK clause is correct
SELECT 
  'Policy details:' as info,
  policyname,
  with_check
FROM pg_policies 
WHERE tablename = 'conversations' 
AND cmd = 'INSERT';

-- 3. Try to insert directly (bypassing RLS) to test
SET session_presets.role = 'authenticated';
SET request.jwt.claim.sub = '6fd7107e-5f24-4123-8299-d77834aea296';

-- This simulates being authenticated as your user
INSERT INTO conversations (name, type, created_by)
VALUES ('Direct Test', 'personal', '6fd7107e-5f24-4123-8299-d77834aea296')
RETURNING id, name, type, created_by;

-- Clean up
DELETE FROM conversations WHERE name = 'Direct Test';

SELECT 'If you see a conversation ID above, the policy works!' as result;
