-- Enable Realtime for Chat Tables
-- Run this in Supabase SQL Editor

-- Enable realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Enable realtime for conversations table (for status updates)
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;

-- Enable realtime for users table (for online status)
ALTER PUBLICATION supabase_realtime ADD TABLE users;

-- Verify
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

SELECT 'Realtime enabled for chat tables!' as status;
