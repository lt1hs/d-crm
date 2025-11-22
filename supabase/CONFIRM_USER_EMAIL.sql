-- Manually confirm user email
-- Run this in Supabase SQL Editor

-- Find the user first
SELECT id, email, email_confirmed_at 
FROM auth.users 
WHERE email = 'hssd@aldaleel.com';

-- Confirm their email (replace USER_ID with actual ID from above)
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'hssd@aldaleel.com';

-- Verify confirmation
SELECT id, email, email_confirmed_at 
FROM auth.users 
WHERE email = 'hssd@aldaleel.com';
