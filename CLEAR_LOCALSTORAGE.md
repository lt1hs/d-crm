# Clear LocalStorage - Quick Fix

## Problem
Your localStorage has corrupted data (the string "undefined" instead of null or valid JSON).

## Solution

Open your browser console (F12) and run:

```javascript
// Clear all localStorage
localStorage.clear();

// Reload the page
location.reload();
```

Or just this one line:
```javascript
localStorage.clear(); location.reload();
```

## What This Does
- Removes all stored data including the corrupted "undefined" value
- Reloads the page with a clean slate
- The app will show the login page

## After Clearing
The app should now work normally. You'll need to log in again with mock credentials.

## Default Mock Users
If you need to create a test user, run this in console after clearing:
```javascript
const mockUser = {
  id: '1',
  username: 'admin',
  email: 'admin@example.com',
  fullName: 'Admin User',
  avatar: '/imgs/default-avatar.png',
  role: 'super_admin',
  status: 'active',
  permissions: [],
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString()
};

localStorage.setItem('users', JSON.stringify([mockUser]));
localStorage.setItem('currentUser', JSON.stringify(mockUser));
location.reload();
```

This will log you in as an admin user automatically.
