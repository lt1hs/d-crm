-- Fix RLS policy for creating direct chats
-- The current policy only allows users to add themselves
-- We need to allow adding other users when creating a conversation

-- Drop the restrictive policy
DROP POLICY IF EXISTS "Users can create conversation participants" ON conversation_participants;

-- Create a more permissive policy for conversation creators
CREATE POLICY "Users can create conversation participants" 
ON conversation_participants
FOR INSERT 
TO authenticated
WITH CHECK (
  -- User can add themselves
  user_id = auth.uid()
  OR
  -- User can add others to conversations they created
  conversation_id IN (
    SELECT id FROM conversations WHERE created_by = auth.uid()
  )
);

SELECT 'Policy updated! Direct chats should work now.' as status;
