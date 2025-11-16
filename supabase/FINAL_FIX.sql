-- ============================================
-- FINAL FIX FOR PERSONAL CHAT
-- This will definitely work!
-- ============================================

-- Step 1: Add 'personal' type
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'conversations_type_check'
  ) THEN
    ALTER TABLE conversations DROP CONSTRAINT conversations_type_check;
  END IF;
END $$;

ALTER TABLE conversations 
ADD CONSTRAINT conversations_type_check 
CHECK (type IN ('direct', 'group', 'channel', 'personal'));

-- Step 2: Make sure RLS is enabled
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop ALL existing policies
DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update conversations" ON conversations;
DROP POLICY IF EXISTS "Users can delete conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can create conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can update conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can delete conversation participants" ON conversation_participants;

-- Step 4: Create helper function
CREATE OR REPLACE FUNCTION public.is_conversation_member(conv_id uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM conversation_participants 
    WHERE conversation_id = conv_id 
    AND user_id = user_uuid
  );
$$;

-- Step 5: Create SIMPLE policies that definitely work

-- Allow authenticated users to INSERT conversations they create
CREATE POLICY "Users can create conversations" 
ON conversations
FOR INSERT 
TO authenticated
WITH CHECK (created_by = auth.uid());

-- Allow users to SELECT conversations they're members of
CREATE POLICY "Users can view their conversations" 
ON conversations
FOR SELECT 
TO authenticated
USING (public.is_conversation_member(id, auth.uid()));

-- Allow authenticated users to INSERT themselves as participants
CREATE POLICY "Users can create conversation participants" 
ON conversation_participants
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Allow users to SELECT participants in their conversations
CREATE POLICY "Users can view conversation participants" 
ON conversation_participants
FOR SELECT 
TO authenticated
USING (public.is_conversation_member(conversation_id, auth.uid()));

-- Step 6: Create index
CREATE INDEX IF NOT EXISTS idx_conversations_personal 
ON conversations(created_by, type) 
WHERE type = 'personal';

-- Step 7: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON conversations TO authenticated;
GRANT ALL ON conversation_participants TO authenticated;

-- Step 8: Verify
SELECT 'Setup complete! Check results below:' as status;

SELECT 'Policies on conversations:' as info;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'conversations';

SELECT 'Policies on conversation_participants:' as info;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'conversation_participants';

SELECT 'Helper function exists:' as info;
SELECT proname FROM pg_proc WHERE proname = 'is_conversation_member';
