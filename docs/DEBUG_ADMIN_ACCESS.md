# 🐛 Debug Admin Access

## Quick Fix Applied ✅

I've updated the `AuthContext.tsx` to properly recognize `admin` role.

The issue was that `hasPermission()` only checked for `super_admin`, but your user has `admin` role.

---

## Verify the Fix

### Step 1: Refresh Your App
1. **Hard refresh** your browser: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. Or clear cache and refresh

### Step 2: Check in Browser Console
Open browser console (F12) and run:

```javascript
// Check current user
const { currentUser, hasPermission } = useAuth();
console.log('Current User:', currentUser);
console.log('Role:', currentUser?.role);
console.log('Has Users Permission:', hasPermission('users', 'read'));
console.log('Has Logs Permission:', hasPermission('logs', 'read'));
```

**Expected Output:**
```
Current User: {id: "...", role: "admin", ...}
Role: admin
Has Users Permission: true
Has Logs Permission: true
```

### Step 3: Check Sidebar
Look in your sidebar - you should now see:

```
Admin Section:
├─ 👥 Users
├─ 📋 Activity Logs
└─ 🔔 🧪 Test Notifications
```

---

## If Still Not Working

### Debug Step 1: Verify Database Role
Run in Supabase SQL Editor:

```sql
SELECT id, email, full_name, username, role 
FROM public.users 
WHERE username = 'admin';
```

**Expected:** `role` should be `'admin'`

### Debug Step 2: Check User Loading
In browser console:

```javascript
// Force reload user profile
const { currentUser } = useAuth();
console.log('User loaded:', currentUser);
console.log('Role type:', typeof currentUser?.role);
console.log('Role value:', currentUser?.role);
console.log('Is admin?:', currentUser?.role === 'admin');
```

### Debug Step 3: Log Out and Back In
Sometimes the user data is cached:

1. Click logout
2. Clear browser cache
3. Log back in
4. Check sidebar again

### Debug Step 4: Check Local Storage
```javascript
// Clear any cached user data
localStorage.clear();
// Then refresh page
location.reload();
```

---

## Manual Override (If Needed)

If you need to force admin access for testing, you can temporarily modify the Sidebar:

### Option 1: Remove Permission Check (Temporary)

In `components/Sidebar.tsx`, find this line:
```typescript
if (item.permission && !hasPermission(item.permission, 'read')) {
  return null;
}
```

Comment it out temporarily:
```typescript
// if (item.permission && !hasPermission(item.permission, 'read')) {
//   return null;
// }
```

This will show all menu items regardless of permissions (for testing only!).

### Option 2: Force Admin in Console

```javascript
// In browser console
const { updateUserProfile } = useAuth();
updateUserProfile({ role: 'admin' });
location.reload();
```

---

## Verification Checklist

After the fix, verify these work:

- [ ] ✅ Can see "Admin" section in sidebar
- [ ] ✅ Can see "👥 Users" menu item
- [ ] ✅ Can see "📋 Activity Logs" menu item  
- [ ] ✅ Can see "🔔 🧪 Test Notifications" menu item
- [ ] ✅ Can click and access each admin page
- [ ] ✅ Console shows `hasPermission('users', 'read') === true`

---

## What Changed

### Before:
```typescript
const hasPermission = (resource, action) => {
  if (currentUser.role === 'super_admin') return true; // Only super_admin
  // Check permissions array...
};
```

### After:
```typescript
const hasPermission = (resource, action) => {
  // Both admin and super_admin have full access
  if (currentUser.role === 'super_admin' || currentUser.role === 'admin') return true;
  
  // Manager has most permissions
  if (currentUser.role === 'manager') {
    if (resource === 'users' || resource === 'logs') return false;
    return true;
  }
  // Check permissions array...
};
```

---

## Role Hierarchy

Now the system recognizes these roles:

1. **super_admin** - Full access to everything
2. **admin** - Full access to everything (same as super_admin)
3. **manager** - Access to most features except user management
4. **employee** - Standard user access

---

## Next Steps

Once you can see the admin menu:

1. ✅ Click "🧪 Test Notifications"
2. ✅ Click "Run All Tests"
3. ✅ Verify notifications work
4. ✅ Test the notification system!

---

## Still Having Issues?

Run this complete diagnostic:

```javascript
// Complete diagnostic script
console.log('=== ADMIN ACCESS DIAGNOSTIC ===');

const { currentUser, hasPermission } = useAuth();

console.log('1. User Info:');
console.log('   - ID:', currentUser?.id);
console.log('   - Email:', currentUser?.email);
console.log('   - Role:', currentUser?.role);
console.log('   - Role Type:', typeof currentUser?.role);

console.log('\n2. Permission Checks:');
console.log('   - users:', hasPermission('users', 'read'));
console.log('   - logs:', hasPermission('logs', 'read'));
console.log('   - dashboard:', hasPermission('dashboard', 'read'));

console.log('\n3. Role Checks:');
console.log('   - Is admin?:', currentUser?.role === 'admin');
console.log('   - Is super_admin?:', currentUser?.role === 'super_admin');
console.log('   - Is manager?:', currentUser?.role === 'manager');

console.log('\n4. Database Check:');
console.log('   Run this SQL:');
console.log('   SELECT role FROM public.users WHERE id = \'' + currentUser?.id + '\';');

console.log('\n=== END DIAGNOSTIC ===');
```

Copy the output and check if anything looks wrong!

---

**The fix is applied!** Just refresh your browser and you should see the admin menu items. 🎉
