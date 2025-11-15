# Create Superadmin User

## Option 1: Automatic (Recommended)

Run `CREATE_SUPERADMIN_AUTO.sql` in Supabase SQL Editor. This will:
1. Create the auth user
2. Create the user profile with admin role
3. Set up all necessary fields

**Before running:**
- Edit the SQL file and change the password from `Admin@123456` to something secure
- Optionally change the email from `admin@aldaleel.com`

Then:
1. Open Supabase Dashboard → SQL Editor
2. Copy and paste the entire `CREATE_SUPERADMIN_AUTO.sql` file
3. Click Run
4. You should see: "Superadmin created successfully!"

## Option 2: Manual (If automatic fails)

### Step 1: Create Auth User in Supabase Dashboard
1. Go to Supabase Dashboard
2. Click **Authentication** → **Users**
3. Click **Add User** button
4. Enter:
   - Email: `admin@aldaleel.com`
   - Password: (choose a strong password)
   - Auto Confirm User: ✅ Yes
5. Click **Create User**
6. **Copy the User ID** (you'll need it in step 2)

### Step 2: Create User Profile
1. Open Supabase Dashboard → SQL Editor
2. Open `CREATE_SUPERADMIN.sql`
3. Replace `'YOUR_USER_ID_HERE'` with the actual user ID from step 1
4. Click Run

## Login

After creating the superadmin:
1. Go to your app login page
2. Email: `admin@aldaleel.com`
3. Password: (the password you set)
4. You should be logged in as admin with full access

## Verify Admin Access

After logging in, check:
- ✅ You can access all sections
- ✅ You can manage users
- ✅ You can create/edit/delete content
- ✅ You have admin permissions

## Change Password Later

To change the admin password:
1. Go to Supabase Dashboard → Authentication → Users
2. Find the admin user
3. Click the three dots → Reset Password
4. Or use the app's "Forgot Password" feature

## Security Notes

- ⚠️ Change the default password immediately after first login
- ⚠️ Use a strong password (12+ characters, mixed case, numbers, symbols)
- ⚠️ Don't share admin credentials
- ⚠️ Consider enabling 2FA in Supabase for extra security

## Troubleshooting

### Can't login?
- Check the email is correct
- Check the password is correct
- Verify the user exists in Supabase Dashboard → Authentication → Users
- Check the user profile exists: `SELECT * FROM users WHERE email = 'admin@aldaleel.com'`

### No admin permissions?
- Check the role: `SELECT role FROM users WHERE email = 'admin@aldaleel.com'`
- Should be `'admin'`, not `'employee'` or `'manager'`
- If wrong, update: `UPDATE users SET role = 'admin' WHERE email = 'admin@aldaleel.com'`

### User exists but can't see profile?
- The user might exist in auth but not in the users table
- Run the CREATE_SUPERADMIN.sql script with the correct user ID

---

**You're all set!** Your superadmin account is ready to use. 🎉
