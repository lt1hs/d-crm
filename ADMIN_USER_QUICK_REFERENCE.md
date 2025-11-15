# 👤 Admin User - Quick Reference Card

## 🚀 Fastest Way (30 seconds)

### If you already have a user account:

1. **Go to Supabase Dashboard** → SQL Editor
2. **Run this**:
   ```sql
   UPDATE public.users 
   SET role = 'admin'
   WHERE id = (SELECT id FROM public.users ORDER BY created_at DESC LIMIT 1);
   ```
3. **Refresh your app**
4. **Done!** ✅

---

## 📋 Step-by-Step (2 minutes)

### Method 1: Supabase Dashboard

1. **Authentication** → **Users** → **Add user**
2. Enter email and password
3. ✅ Check "Auto Confirm User"
4. **Copy the User ID** (UUID)
5. **SQL Editor** → Run:
   ```sql
   INSERT INTO public.users (id, email, full_name, role)
   VALUES ('PASTE_USER_ID_HERE', 'admin@example.com', 'Admin', 'admin');
   ```

### Method 2: Update Existing User

1. **SQL Editor** → Run:
   ```sql
   SELECT id, email, role FROM public.users;
   ```
2. Copy your user ID
3. Run:
   ```sql
   UPDATE public.users SET role = 'admin' WHERE id = 'YOUR_ID';
   ```

---

## ✅ Verification

### Check in Database:
```sql
SELECT email, role FROM public.users WHERE role = 'admin';
```

### Check in App:
1. Log in
2. Look for "Admin" section in sidebar
3. Should see: "🧪 Test Notifications"

### Check in Console:
```javascript
// Press F12, then paste:
const { currentUser } = useAuth();
console.log('Role:', currentUser.role);
```

---

## 🎯 Quick Commands

### Make most recent user admin:
```sql
UPDATE public.users SET role = 'admin'
WHERE id = (SELECT id FROM public.users ORDER BY created_at DESC LIMIT 1);
```

### Make specific email admin:
```sql
UPDATE public.users SET role = 'admin' WHERE email = 'your@email.com';
```

### List all admins:
```sql
SELECT email, full_name, role FROM public.users WHERE role = 'admin';
```

### Remove admin role:
```sql
UPDATE public.users SET role = 'employee' WHERE email = 'user@email.com';
```

---

## 🔑 Default Credentials (if created)

- **Email**: `admin@example.com`
- **Password**: (set during creation)
- **Role**: `admin`

---

## 🎨 Admin Features

Once you're admin, you get access to:

- ✅ **User Management** - Manage all users
- ✅ **Activity Logs** - View system logs
- ✅ **🧪 Test Notifications** - Test notification system
- ✅ **All Features** - Full access to everything

---

## 🐛 Troubleshooting

### Can't see admin menu?
```sql
-- Check your role
SELECT role FROM public.users WHERE email = 'your@email.com';

-- Update if needed
UPDATE public.users SET role = 'admin' WHERE email = 'your@email.com';
```

### User doesn't exist in public.users?
```sql
-- Create profile (get ID from Authentication > Users)
INSERT INTO public.users (id, email, full_name, role)
VALUES ('AUTH_USER_ID', 'your@email.com', 'Your Name', 'admin');
```

### Still not working?
1. Clear browser cache
2. Log out and log back in
3. Check browser console (F12) for errors

---

## 📞 Files to Check

- **Full Guide**: `CREATE_ADMIN_USER_GUIDE.md`
- **SQL Script**: `CREATE_ADMIN_USER.sql`
- **Quick Script**: `MAKE_ME_ADMIN.sql`

---

## 🎉 Ready to Test!

Once you're admin:

1. Open your app
2. Look in sidebar → Admin section
3. Click **"🧪 Test Notifications"**
4. Click **"Run All Tests"**
5. Watch the magic happen! ✨

---

**Need help?** Check `CREATE_ADMIN_USER_GUIDE.md` for detailed instructions.
