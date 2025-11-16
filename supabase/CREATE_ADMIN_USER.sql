-- =====================================================
-- CREATE ADMIN USER
-- =====================================================
-- This script creates an admin user for testing the notification system
-- Run this in Supabase SQL Editor

-- Step 1: Create the user in auth.users (Supabase Auth)
-- Note: You'll need to do this via Supabase Dashboard > Authentication > Users
-- Or use the Supabase Auth API

-- Step 2: Insert user profile in public.users table
-- Replace 'YOUR_AUTH_USER_ID' with the actual UUID from auth.users

INSERT INTO public.users (
  id,
  email,
  full_name,
  username,
  role,
  department,
  position,
  status,
  notifications_enabled,
  email_notifications,
  theme
) VALUES (
  'YOUR_AUTH_USER_ID', -- Replace with actual auth.users UUID
  'admin@example.com',
  'Admin User',
  'admin',
  'admin', -- This gives admin role
  'IT',
  'System Administrator',
  'online',
  true,
  true,
  'system'
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  full_name = 'Admin User',
  username = 'admin';

-- Step 3: Verify the user was created
SELECT id, email, full_name, username, role 
FROM public.users 
WHERE email = 'admin@example.com';

-- =====================================================
-- ALTERNATIVE: Update existing user to admin
-- =====================================================
-- If you already have a user and want to make them admin:

-- Find your user ID first:
SELECT id, email, full_name, role 
FROM public.users 
ORDER BY created_at DESC 
LIMIT 5;

-- Then update to admin (replace 'YOUR_USER_ID'):
UPDATE public.users 
SET role = 'admin'
WHERE id = 'YOUR_USER_ID';

-- Verify:
SELECT id, email, full_name, role 
FROM public.users 
WHERE role = 'admin';
