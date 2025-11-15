-- =====================================================
-- MAKE ME ADMIN - Quick Script
-- =====================================================
-- Run this in Supabase SQL Editor to make yourself admin
-- This will update the MOST RECENT user to admin role

-- Option 1: Make the most recent user admin
UPDATE public.users 
SET role = 'admin'
WHERE id = (
  SELECT id FROM public.users 
  ORDER BY created_at DESC 
  LIMIT 1
)
RETURNING id, email, full_name, role;

-- Option 2: Make a specific email admin (replace the email)
-- UPDATE public.users 
-- SET role = 'admin'
-- WHERE email = 'your@email.com'
-- RETURNING id, email, full_name, role;

-- Option 3: Make ALL users admin (for testing only!)
-- UPDATE public.users 
-- SET role = 'admin'
-- RETURNING id, email, full_name, role;

-- Verify admin users
SELECT 
  id, 
  email, 
  full_name, 
  username,
  role,
  created_at
FROM public.users 
WHERE role = 'admin'
ORDER BY created_at DESC;
