-- Fix RLS policy to allow user creation
-- Run this in Supabase SQL Editor

-- Allow authenticated users to insert into users table
CREATE POLICY "Allow authenticated users to create profiles" ON public.users
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow users to read all profiles (for user management)
CREATE POLICY "Allow authenticated users to read profiles" ON public.users
FOR SELECT 
TO authenticated 
USING (true);

-- Allow users to update their own profile or admins to update any
CREATE POLICY "Allow profile updates" ON public.users
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id OR EXISTS (
  SELECT 1 FROM public.users 
  WHERE id = auth.uid() AND role = 'admin'
));

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'users';
