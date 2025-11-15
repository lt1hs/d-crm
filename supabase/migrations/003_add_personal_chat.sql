-- Add 'personal' type to conversations
-- This allows users to have a personal chat with themselves for notes and files

-- First, check if the constraint exists and drop it
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'conversations_type_check'
  ) THEN
    ALTER TABLE conversations DROP CONSTRAINT conversations_type_check;
  END IF;
END $$;

-- Add the new constraint with 'personal' type
ALTER TABLE conversations 
ADD CONSTRAINT conversations_type_check 
CHECK (type IN ('direct', 'group', 'channel', 'personal'));

-- Create an index for faster personal chat lookups
CREATE INDEX IF NOT EXISTS idx_conversations_personal 
ON conversations(created_by, type) 
WHERE type = 'personal';

-- Add a comment explaining the personal chat feature
COMMENT ON COLUMN conversations.type IS 'Type of conversation: direct (1-on-1), group (multiple users), channel (public/private channels), personal (self-chat for notes)';

-- Add RLS policies for creating conversations
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can create conversation participants" ON public.conversation_participants;

-- Allow users to create conversations
CREATE POLICY "Users can create conversations" ON public.conversations
  FOR INSERT WITH CHECK (
    created_by = auth.uid()
  );

-- Allow users to add themselves as participants
CREATE POLICY "Users can create conversation participants" ON public.conversation_participants
  FOR INSERT WITH CHECK (
    -- User can add themselves to any conversation they created
    conversation_id IN (
      SELECT id FROM public.conversations WHERE created_by = auth.uid()
    )
    OR
    -- Or add themselves to existing conversations (for invites)
    user_id = auth.uid()
  );

-- Allow users to view conversation participants for their conversations
DROP POLICY IF EXISTS "Users can view conversation participants" ON public.conversation_participants;
CREATE POLICY "Users can view conversation participants" ON public.conversation_participants
  FOR SELECT USING (
    conversation_id IN (
      SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid()
    )
  );
