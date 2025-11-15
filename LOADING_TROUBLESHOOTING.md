# Loading Screen Troubleshooting Guide

## Issue Fixed
The AuthContext file was corrupted during editing. It has been restored with proper error handling and a 5-second timeout.

## What Was Fixed

### 1. Restored Complete AuthContext
- Fixed corrupted code from failed edit
- Added 5-second timeout to auth initialization
- Proper error handling in all async operations
- Always calls `setLoading(false)` in every code path

### 2. Key Changes
```typescript
// Wrapped auth initialization with timeout
const initAuth = async () => {
  try {
    await Promise.race([
      checkSession(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Auth timeout')), 5000))
    ]);
  } catch (error) {
    console.error('Auth initialization error:', error);
    setLoading(false); // Always set loading to false
  }
};
```

## If Still Stuck on Loading

### Check Browser Console
Open browser DevTools (F12) and check the Console tab for errors:

1. **"Auth timeout" error** → Supabase connection issue
2. **"User profile not found"** → Missing user record in database
3. **Network errors** → Check Supabase URL and API key
4. **CORS errors** → Supabase project settings issue

### Quick Fixes

#### 1. Clear Browser Cache
```javascript
// In browser console:
localStorage.clear();
sessionStorage.clear();
location.reload();
```

#### 2. Check Supabase Connection
```javascript
// In browser console:
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Has API Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
```

#### 3. Test Direct Supabase Query
Open `test-supabase-direct.html` in browser to test connection.

#### 4. Check .env.local File
Ensure these variables are set:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

#### 5. Verify User Profile Exists
If you can login but get stuck, check if user profile exists in `public.users` table:
```sql
SELECT * FROM public.users WHERE id = 'your_user_id';
```

If no profile exists, create one using `supabase/create_user_profile.sql`.

### Force Skip Loading (Emergency)

If you need to bypass loading temporarily for debugging:

```typescript
// In context/AuthContext.tsx, temporarily change:
const [loading, setLoading] = useState(false); // Changed from true to false
```

This will show the login page immediately without waiting for auth check.

## Expected Behavior

### Normal Flow
1. App starts → Loading screen (max 5 seconds)
2. Check session → Either:
   - **No session** → Show login page (loading = false)
   - **Valid session** → Load user profile → Show dashboard (loading = false)
   - **Timeout** → Show login page (loading = false)

### Timeline
- **0-500ms**: Normal auth check
- **500ms-2s**: Slow connection
- **2s-5s**: Very slow or problematic connection
- **5s+**: Timeout triggered, shows login page

## Monitoring

Add this to see what's happening:
```typescript
// In browser console:
window.addEventListener('load', () => {
  console.log('Page loaded');
  setTimeout(() => {
    console.log('5 seconds passed, should not be loading anymore');
  }, 5000);
});
```

## Common Issues

### 1. Infinite Loading
- **Cause**: `setLoading(false)` never called
- **Fix**: Check all async functions have try-catch with `setLoading(false)` in finally block

### 2. Slow Initial Load
- **Cause**: Supabase cold start or slow network
- **Fix**: Timeout now handles this (5 seconds max)

### 3. Profile Not Found
- **Cause**: User exists in auth.users but not in public.users
- **Fix**: Run `supabase/create_user_profile.sql` to create profile

### 4. RLS Policy Blocking
- **Cause**: Row Level Security preventing user read
- **Fix**: Run `supabase/fix_rls_policies.sql`

## Success Indicators

You'll know it's working when:
- ✅ Loading screen appears for < 2 seconds
- ✅ Either login page or dashboard appears
- ✅ No console errors
- ✅ Can interact with the app

## Still Having Issues?

1. Check all files are saved
2. Restart development server
3. Clear browser cache completely
4. Check Supabase dashboard for API status
5. Verify database has required tables and data
