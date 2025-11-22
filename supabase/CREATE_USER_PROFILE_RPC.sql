-- Create RPC function to bypass RLS for user profile creation
-- Run this in Supabase SQL Editor

CREATE OR REPLACE FUNCTION create_user_profile(
  user_id UUID,
  user_email TEXT,
  user_full_name TEXT,
  user_role TEXT DEFAULT 'employee'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER -- This allows bypassing RLS
AS $$
DECLARE
  result JSON;
BEGIN
  INSERT INTO public.users (
    id,
    email,
    full_name,
    role,
    status
  ) VALUES (
    user_id,
    user_email,
    user_full_name,
    user_role,
    'offline'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;
  
  SELECT json_build_object(
    'id', id,
    'email', email,
    'full_name', full_name,
    'role', role,
    'status', status
  ) INTO result
  FROM public.users
  WHERE id = user_id;
  
  RETURN result;
END;
$$;
