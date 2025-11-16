-- =====================================================
-- FIX: Update Existing User to Admin
-- =====================================================
-- The username 'admin' already exists, so we'll update that user

-- Option 1: Update the user with username 'admin' to admin role
UPDATE public.users 
SET role = 'admin'
WHERE username = 'admin'
RETURNING id, email, full_name, username, role;

-- Option 2: If you want to update by email instead
-- UPDATE public.users 
-- SET role = 'admin'
-- WHERE email = 'your@email.com'
-- RETURNING id, email, full_name, username, role;

-- Option 3: Update the most recent user to admin
-- UPDATE public.users 
-- SET role = 'admin'
-- WHERE id = (SELECT id FROM public.users ORDER BY created_at DESC LIMIT 1)
-- RETURNING id, email, full_name, username, role;

-- Verify the admin user
SELECT 
  id, 
  email, 
  full_name, 
  username,
  role,
  created_at
FROM public.users 
WHERE role = 'admin';

-- If you want to see all users to choose which one to make admin:
-- SELECT id, email, full_name, username, role, created_at 
-- FROM public.users 
-- ORDER BY created_at DESC;
