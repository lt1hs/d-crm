-- Enable Personal Chat Feature
-- Run this in Supabase SQL Editor to enable personal chat functionality

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

-- Step 2: Create index for faster personal chat lookups
CREATE INDEX IF NOT EXISTS idx_conversations_personal 
ON conversations(created_by, type) 
WHERE type = 'personal';

-- Step 3: Create a helper function to check conversation membership (bypasses RLS)
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

-- Step 4: Add RLS policies for creating conversations
DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can create conversation participants" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can view conversation participants" ON public.conversation_participants;

-- Allow users to create conversations
CREATE POLICY "Users can create conversations" ON public.conversations
  FOR INSERT WITH CHECK (
    created_by = auth.uid()
  );

-- Allow users to add themselves as participants
CREATE POLICY "Users can create conversation participants" ON public.conversation_participants
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
  );

-- Allow users to view participants in conversations they're members of
-- Uses the helper function to avoid recursion
CREATE POLICY "Users can view conversation participants" ON public.conversation_participants
  FOR SELECT USING (
    public.is_conversation_member(conversation_id, auth.uid())
  );

-- Step 5: Add comment
COMMENT ON COLUMN conversations.type IS 'Type of conversation: direct (1-on-1), group (multiple users), channel (public/private channels), personal (self-chat for notes)';

-- Step 6: Verify the changes
SELECT 
  'Conversations table updated' as status,
  COUNT(*) as total_conversations
FROM conversations;

SELECT 
  'RLS policies created' as status,
  COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename = 'conversations';
