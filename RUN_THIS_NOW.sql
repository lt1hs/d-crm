-- ============================================
-- COPY AND PASTE THIS ENTIRE SCRIPT INTO SUPABASE SQL EDITOR
-- ============================================

-- Step 1: Add 'personal' type to conversations
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

-- Step 2: Drop ALL existing policies on conversations
DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update conversations" ON conversations;
DROP POLICY IF EXISTS "Users can delete conversations" ON conversations;

-- Step 3: Drop ALL existing policies on conversation_participants
DROP POLICY IF EXISTS "Users can view conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can create conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can update conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can delete conversation participants" ON conversation_participants;

-- Step 4: Create helper function (bypasses RLS)
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

-- Step 5: Create NEW policies for conversations
CREATE POLICY "Users can view their conversations" ON conversations
  FOR SELECT USING (
    public.is_conversation_member(id, auth.uid())
  );

CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT WITH CHECK (
    created_by = auth.uid()
  );

-- Step 6: Create NEW policies for conversation_participants
CREATE POLICY "Users can view conversation participants" ON conversation_participants
  FOR SELECT USING (
    public.is_conversation_member(conversation_id, auth.uid())
  );

CREATE POLICY "Users can create conversation participants" ON conversation_participants
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
  );

-- Step 7: Create index
CREATE INDEX IF NOT EXISTS idx_conversations_personal 
ON conversations(created_by, type) 
WHERE type = 'personal';

-- Step 8: Verify
SELECT 'SUCCESS! Policies created.' as status;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'conversations';
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'conversation_participants';
