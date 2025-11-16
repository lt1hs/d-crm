# Fix: Infinite Recursion in RLS Policies

## Problem
Error: `infinite recursion detected in policy for relation "conversation_participants"`

This happens when an RLS policy on `conversation_participants` tries to query `conversation_participants` itself, creating a circular reference.

## Root Cause
The SELECT policy for `conversation_participants` was:
```sql
CREATE POLICY "Users can view conversation participants" 
ON conversation_participants
FOR SELECT USING (
  conversation_id IN (
    SELECT conversation_id FROM conversation_participants  -- ❌ Recursion!
    WHERE user_id = auth.uid()
  )
);
```

This creates infinite recursion because checking if a user can SELECT from `conversation_participants` requires SELECT from `conversation_participants`.

## Solution: Use SECURITY DEFINER Function

We create a helper function that bypasses RLS to check membership, then use it in the policy.

### Run This SQL in Supabase

Copy and paste this entire script into your Supabase SQL Editor:

```sql
-- ============================================
-- FIX INFINITE RECURSION IN RLS POLICIES
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

-- Step 2: Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_conversations_personal 
ON conversations(created_by, type) 
WHERE type = 'personal';

-- Step 3: Create helper function (SECURITY DEFINER bypasses RLS)
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

-- Step 4: Drop existing policies
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view conversation participants" ON conversation_participants;

-- Step 5: Create new policies

-- Allow users to create conversations
CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT WITH CHECK (
    created_by = auth.uid()
  );

-- Allow users to add themselves as participants
CREATE POLICY "Users can create conversation participants" ON conversation_participants
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
  );

-- Allow users to view participants (uses helper function - NO RECURSION!)
CREATE POLICY "Users can view conversation participants" ON conversation_participants
  FOR SELECT USING (
    public.is_conversation_member(conversation_id, auth.uid())
  );

-- Step 6: Add comment
COMMENT ON COLUMN conversations.type IS 'Type of conversation: direct (1-on-1), group (multiple users), channel (public/private channels), personal (self-chat for notes)';

-- Step 7: Verify
SELECT 'Setup complete!' as status;
SELECT COUNT(*) as policy_count FROM pg_policies WHERE tablename IN ('conversations', 'conversation_participants');
```

## How It Works

### The Helper Function
```sql
CREATE FUNCTION is_conversation_member(conv_id uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER  -- ⭐ This is the key! Bypasses RLS
```

- `SECURITY DEFINER` makes the function run with the privileges of the function owner (usually postgres/admin)
- This means it can query `conversation_participants` WITHOUT triggering RLS policies
- No recursion because RLS is bypassed inside the function

### The Fixed Policy
```sql
CREATE POLICY "Users can view conversation participants" 
ON conversation_participants
FOR SELECT USING (
  public.is_conversation_member(conversation_id, auth.uid())  -- ✅ No recursion!
);
```

- Calls the helper function instead of querying the table directly
- Function returns true/false without triggering RLS
- Clean and efficient!

## Testing

After running the SQL:

1. **Refresh your app** (hard refresh: Ctrl+Shift+R)

2. **Click "📝 Personal Notes"**

3. **Check console** - you should see:
   ```
   Opening personal chat for user: [your-id]
   Creating new personal chat...
   Personal chat conversation created: [conversation-id]
   Personal chat created successfully: [conversation-id]
   ```

4. **Verify in database**:
   ```sql
   SELECT * FROM conversations WHERE type = 'personal';
   SELECT * FROM conversation_participants WHERE conversation_id = '[your-personal-chat-id]';
   ```

## Troubleshooting

### Still Getting Recursion Error?
1. Make sure you ran ALL the SQL above
2. Check the function exists:
   ```sql
   SELECT * FROM pg_proc WHERE proname = 'is_conversation_member';
   ```
3. Verify policies are using the function:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'conversation_participants';
   ```

### Function Not Found?
```sql
-- Recreate the function
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
```

### Need to Start Fresh?
```sql
-- Remove everything and start over
DROP FUNCTION IF EXISTS public.is_conversation_member(uuid, uuid);
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view conversation participants" ON conversation_participants;

-- Then run the full fix script above
```

## Why This Approach?

### ❌ Bad (Causes Recursion)
```sql
-- Policy queries the same table it's protecting
FOR SELECT USING (
  conversation_id IN (
    SELECT conversation_id FROM conversation_participants  -- Recursion!
    WHERE user_id = auth.uid()
  )
)
```

### ✅ Good (No Recursion)
```sql
-- Policy calls a function that bypasses RLS
FOR SELECT USING (
  public.is_conversation_member(conversation_id, auth.uid())  -- No recursion!
)
```

## Security Notes

- The `SECURITY DEFINER` function is safe because:
  - It only checks membership (read-only)
  - It doesn't expose sensitive data
  - It's used within a policy that still enforces access control
  - Users can only see participants in conversations they're members of

## Success Criteria

✅ No more "infinite recursion" errors  
✅ Can click "Personal Notes" without errors  
✅ Personal chat is created automatically  
✅ Can send messages in personal chat  
✅ Can view conversation list without errors  

---

**After applying this fix, your personal chat feature will work perfectly!** 🎉
