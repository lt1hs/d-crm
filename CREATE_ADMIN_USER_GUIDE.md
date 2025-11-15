# 👤 Create Admin User - Complete Guide

## Method 1: Via Supabase Dashboard (Easiest) ⭐

### Step 1: Create Auth User
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication** > **Users**
4. Click **"Add user"** or **"Invite user"**
5. Enter:
   - **Email**: `admin@example.com` (or your email)
   - **Password**: Create a strong password
   - **Auto Confirm User**: ✅ Check this box
6. Click **"Create user"** or **"Send invitation"**
7. **Copy the User ID** (UUID) - you'll need this!

### Step 2: Create User Profile
1. Go to **SQL Editor** in Supabase Dashboard
2. Click **"New query"**
3. Paste this SQL (replace `YOUR_AUTH_USER_ID` with the UUID from Step 1):

```sql
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
  email_notifications
) VALUES (
  'YOUR_AUTH_USER_ID', -- Replace with actual UUID
  'admin@example.com',
  'Admin User',
  'admin',
  'admin',
  'IT',
  'System Administrator',
  'online',
  true,
  true
);
```

4. Click **"Run"**
5. You should see: "Success. No rows returned"

### Step 3: Verify
```sql
SELECT id, email, full_name, username, role 
FROM public.users 
WHERE email = 'admin@example.com';
```

You should see your admin user!

---

## Method 2: Update Existing User to Admin (Fastest) 🚀

If you already have a user account:

### Step 1: Find Your User ID
```sql
-- Run this in Supabase SQL Editor
SELECT id, email, full_name, role 
FROM public.users 
ORDER BY created_at DESC 
LIMIT 10;
```

### Step 2: Update to Admin
```sql
-- Replace 'YOUR_USER_ID' with your actual user ID
UPDATE public.users 
SET role = 'admin'
WHERE id = 'YOUR_USER_ID';
```

### Step 3: Verify
```sql
SELECT id, email, full_name, role 
FROM public.users 
WHERE role = 'admin';
```

Done! Your user is now an admin! ✅

---

## Method 3: Via SQL Script (Complete)

Run this complete script in Supabase SQL Editor:

```sql
-- =====================================================
-- COMPLETE ADMIN USER CREATION
-- =====================================================

-- Option A: If you know your auth user ID
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
  email_notifications
) VALUES (
  'YOUR_AUTH_USER_ID',
  'admin@example.com',
  'Admin User',
  'admin',
  'admin',
  'IT',
  'System Administrator',
  'online',
  true,
  true
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  full_name = 'Admin User',
  username = 'admin';

-- Option B: Update first user to admin
UPDATE public.users 
SET role = 'admin'
WHERE id = (
  SELECT id FROM public.users 
  ORDER BY created_at ASC 
  LIMIT 1
);

-- Verify admin users
SELECT id, email, full_name, username, role, created_at
FROM public.users 
WHERE role = 'admin';
```

---

## Method 4: Via Application (If Login Works)

If you can already log in to your app:

### Step 1: Log in with any account

### Step 2: Open Browser Console (F12)

### Step 3: Get Your User ID
```javascript
const { currentUser } = useAuth();
console.log('User ID:', currentUser.id);
console.log('Current Role:', currentUser.role);
```

### Step 4: Update via Supabase SQL Editor
Use the user ID from console in this SQL:
```sql
UPDATE public.users 
SET role = 'admin'
WHERE id = 'USER_ID_FROM_CONSOLE';
```

### Step 5: Refresh the page
Your user should now have admin access!

---

## Verification Steps

After creating/updating the admin user:

### 1. Check Database
```sql
SELECT 
  id, 
  email, 
  full_name, 
  username, 
  role,
  created_at
FROM public.users 
WHERE role = 'admin';
```

### 2. Log in to Your App
- Go to your app: `http://localhost:5173`
- Log in with the admin credentials
- You should see the admin menu items in the sidebar

### 3. Check Permissions
```javascript
// In browser console after logging in
const { currentUser, hasPermission } = useAuth();
console.log('User:', currentUser);
console.log('Is Admin:', currentUser.role === 'admin');
console.log('Has Users Permission:', hasPermission('users'));
console.log('Has Logs Permission:', hasPermission('logs'));
```

### 4. Access Test Page
- Look in the sidebar under "Admin" section
- You should see: **"🧪 Test Notifications"**
- Click it to access the test page

---

## Troubleshooting

### Issue: "User already exists" error

**Solution**: Use UPDATE instead of INSERT:
```sql
UPDATE public.users 
SET role = 'admin'
WHERE email = 'your@email.com';
```

### Issue: Can't see admin menu items

**Check 1**: Verify role in database
```sql
SELECT role FROM public.users WHERE email = 'your@email.com';
```

**Check 2**: Clear browser cache and refresh

**Check 3**: Log out and log back in

### Issue: Auth user exists but no profile

**Solution**: Create the profile manually:
```sql
-- First, get your auth user ID from Authentication > Users
-- Then create profile:
INSERT INTO public.users (
  id,
  email,
  full_name,
  role
) VALUES (
  'YOUR_AUTH_USER_ID',
  'your@email.com',
  'Your Name',
  'admin'
);
```

### Issue: RLS policy blocking

**Check**: Ensure RLS policies allow user creation
```sql
-- Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'users';

-- Temporarily disable RLS for testing (NOT for production!)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Re-enable after creating user
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

---

## Quick Reference

### Admin User Credentials (Default)
- **Email**: `admin@example.com`
- **Password**: (set during creation)
- **Role**: `admin`
- **Username**: `admin`

### User Roles
- `admin` - Full access to everything
- `manager` - Can manage teams and projects
- `employee` - Standard user access

### Admin Permissions
Admins have access to:
- ✅ User Management
- ✅ Activity Logs
- ✅ Notification Test Page
- ✅ All other features

---

## Next Steps

After creating your admin user:

1. ✅ **Log in** with admin credentials
2. ✅ **Verify** you see admin menu items
3. ✅ **Access** the notification test page
4. ✅ **Run** the notification tests
5. ✅ **Create** additional users if needed

---

## Creating Multiple Admin Users

To create additional admin users:

```sql
-- Create multiple admins at once
INSERT INTO public.users (id, email, full_name, username, role) VALUES
  ('uuid-1', 'admin1@example.com', 'Admin One', 'admin1', 'admin'),
  ('uuid-2', 'admin2@example.com', 'Admin Two', 'admin2', 'admin'),
  ('uuid-3', 'admin3@example.com', 'Admin Three', 'admin3', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

---

## Security Notes

⚠️ **Important Security Considerations**:

1. **Use Strong Passwords**: Always use strong, unique passwords for admin accounts
2. **Limit Admin Users**: Only create admin accounts for trusted users
3. **Enable MFA**: Consider enabling multi-factor authentication in Supabase
4. **Monitor Activity**: Check activity logs regularly for admin actions
5. **Production**: Never use default credentials like `admin@example.com` in production

---

## Summary

**Easiest Method**: 
1. Create user in Supabase Dashboard > Authentication
2. Copy the user ID
3. Run SQL to create profile with admin role
4. Log in and test!

**Fastest Method** (if you have an account):
1. Find your user ID in database
2. Run: `UPDATE public.users SET role = 'admin' WHERE id = 'YOUR_ID';`
3. Refresh page
4. Done!

---

## Need Help?

If you're still having issues:

1. Check Supabase logs: Dashboard > Logs
2. Check browser console for errors (F12)
3. Verify database connection in `.env.local`
4. Try the alternative methods above

---

**Ready to test notifications?** Once you have admin access, go to the sidebar and click **"🧪 Test Notifications"**! 🚀
