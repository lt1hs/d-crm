-- Create user profile in public.users table
-- Run this in Supabase SQL Editor if your user exists in auth.users but not in public.users

-- First, check if the user exists in auth.users
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'test@aldaleel.com';

-- Copy the ID from above and use it below
-- Replace 'YOUR-USER-ID-HERE' with the actual ID

INSERT INTO public.users (
  id,
  email,
  full_name,
  role,
  avatar_url,
  status,
  created_at
) VALUES (
  '6fd7107e-5f24-4123-8299-d77834aea296', -- Replace with your user ID
  'test@aldaleel.com',
  'Test User',
  'admin',
  NULL,
  'online',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  updated_at = NOW();

-- Verify the user was created
SELECT * FROM public.users WHERE email = 'test@aldaleel.com';
