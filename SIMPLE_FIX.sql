-- ============================================
-- SIMPLE FIX - Run this if RUN_THIS_NOW.sql didn't work
-- ============================================

-- Step 1: Completely disable RLS temporarily to test
ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants DISABLE ROW LEVEL SECURITY;

-- Step 2: Add the 'personal' type
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

-- Step 3: Test message
SELECT 'RLS DISABLED - Personal chat should work now. Re-enable RLS after testing!' as status;

-- ============================================
-- AFTER TESTING, RUN THIS TO RE-ENABLE RLS:
-- ============================================
-- ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
