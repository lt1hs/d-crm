-- Add username column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Create index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);

-- Update existing users to have usernames based on email
UPDATE public.users 
SET username = LOWER(SPLIT_PART(email, '@', 1))
WHERE username IS NULL;

-- Add constraint to ensure username is lowercase and alphanumeric
ALTER TABLE public.users ADD CONSTRAINT username_format 
  CHECK (username ~ '^[a-z0-9_]+$');

-- Add comment
COMMENT ON COLUMN public.users.username IS 'Unique username for @mentions in chat (lowercase, alphanumeric and underscore only)';
