-- Automatic Superadmin Creation
-- This creates both the auth user and profile in one go

-- Create a function to create superadmin
CREATE OR REPLACE FUNCTION create_superadmin(
  admin_email TEXT,
  admin_password TEXT,
  admin_name TEXT DEFAULT 'Super Admin'
)
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Create auth user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    admin_email,
    crypt(admin_password, gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object('full_name', admin_name),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  )
  RETURNING id INTO new_user_id;

  -- Create user profile
  INSERT INTO public.users (
    id,
    email,
    full_name,
    username,
    role,
    department,
    position,
    status,
    timezone,
    language,
    theme,
    notifications_enabled,
    email_notifications
  )
  VALUES (
    new_user_id,
    admin_email,
    admin_name,
    'superadmin',
    'admin',
    'Administration',
    'System Administrator',
    'online',
    'UTC',
    'en',
    'system',
    true,
    true
  );

  RETURN QUERY SELECT 
    new_user_id,
    admin_email,
    'Superadmin created successfully!' as message;
END;
$$;

-- Now create the superadmin
-- Change the email and password as needed
SELECT * FROM create_superadmin(
  'admin@aldaleel.com',
  'Admin@123456',  -- Change this password!
  'Super Admin'
);

-- Verify
SELECT id, email, full_name, role, created_at 
FROM public.users 
WHERE email = 'admin@aldaleel.com';
