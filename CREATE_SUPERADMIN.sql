-- Create Superadmin User
-- Run this in Supabase SQL Editor

-- Step 1: Create the auth user first in Supabase Dashboard
-- Go to Authentication > Users > Add User
-- Email: admin@aldaleel.com
-- Password: (set a strong password)
-- Then copy the user ID and replace it below

-- Step 2: Create the user profile with admin role
-- Replace 'YOUR_USER_ID_HERE' with the actual user ID from step 1
INSERT INTO public.users (
  id,
  email,
  full_name,
  username,
  role,
  department,
  position,
  status,
  avatar_url,
  timezone,
  language,
  theme,
  notifications_enabled,
  email_notifications
)
VALUES (
  'YOUR_USER_ID_HERE', -- Replace with actual user ID
  'admin@aldaleel.com',
  'Super Admin',
  'superadmin',
  'admin',
  'Administration',
  'System Administrator',
  'online',
  '/imgs/default-avatar.png',
  'UTC',
  'en',
  'system',
  true,
  true
)
ON CONFLICT (id) 
DO UPDATE SET
  role = 'admin',
  full_name = 'Super Admin',
  username = 'superadmin',
  department = 'Administration',
  position = 'System Administrator';

SELECT 'Superadmin user created/updated successfully!' as status;
SELECT id, email, full_name, role FROM public.users WHERE email = 'admin@aldaleel.com';
