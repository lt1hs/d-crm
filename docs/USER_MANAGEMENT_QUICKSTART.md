# User Management System - Quick Start Guide

## Getting Started

### 1. First Login

When you first access the application, you'll see a login page. Use these default credentials:

**Super Admin Account:**
- Username: `admin`
- Password: `admin`

**Editor Account (for testing):**
- Username: `editor`
- Password: `editor`

**Viewer Account (for testing):**
- Username: `viewer`
- Password: `viewer`

### 2. Accessing User Management

After logging in:
1. Look at the sidebar on the left
2. Scroll down to the "Administration" section
3. Click on "Users" to manage users
4. Click on "Activity Logs" to view system activity

### 3. Creating Your First User

1. Navigate to **Users** page
2. Click the **"Add User"** button (top right)
3. Fill in the form:
   - **Username**: Unique identifier (e.g., "john.doe")
   - **Email**: User's email address
   - **Full Name**: Display name (e.g., "John Doe")
   - **Role**: Select from dropdown:
     - Super Admin: Full access
     - Admin: Content management + view users
     - Editor: Create and edit content
     - Viewer: Read-only access
   - **Status**: Active (users can login) / Inactive / Suspended
   - **Avatar URL**: Optional profile picture URL
4. Click **"Create User"**

### 4. Understanding User Roles

#### 🔴 Super Admin
- ✅ Manage users (create, edit, delete)
- ✅ Full content management
- ✅ View activity logs
- ✅ Access all features

#### 🔵 Admin
- ❌ Cannot manage users (can only view)
- ✅ Full content management
- ✅ View activity logs
- ✅ Access most features

#### 🟡 Editor
- ❌ No user management access
- ✅ Create and edit content
- ❌ Cannot delete content
- ❌ Cannot view logs

#### ⚪ Viewer
- ❌ No user management access
- ✅ View all content
- ❌ Cannot create, edit, or delete
- ❌ Cannot view logs

### 5. Managing Existing Users

#### Edit a User
1. Go to **Users** page
2. Find the user in the list
3. Click **"Edit"** button
4. Update information
5. Click **"Update User"**

#### Change User Status
1. Go to **Users** page
2. Find the user in the list
3. Use the **Status dropdown** in the table
4. Select: Active / Inactive / Suspended

#### Delete a User
1. Go to **Users** page
2. Find the user in the list
3. Click **"Delete"** button
4. Confirm deletion
5. ⚠️ Note: You cannot delete your own account

### 6. Viewing Activity Logs

1. Navigate to **Activity Logs** page
2. Use filters to find specific activities:
   - **Action**: Filter by action type (create, update, delete, login, etc.)
   - **Resource**: Filter by resource (users, books, news, etc.)
   - **Username**: Search by username
   - **Date Range**: Filter by date
3. View detailed activity information:
   - Timestamp
   - User who performed the action
   - Action type
   - Resource affected
   - Additional details

### 7. User Profile & Logout

Your profile is displayed at the bottom of the sidebar:
- Shows your name and role
- Click **"Logout"** button to sign out

### 8. Testing Different Roles

To test different permission levels:
1. Logout from current account
2. Login with different credentials:
   - `admin` / `admin` - Super Admin
   - `editor` / `editor` - Editor
   - `viewer` / `viewer` - Viewer
3. Notice how the sidebar and available actions change based on role

### 9. Common Tasks

#### Reset a User's Password (Future Feature)
Currently, passwords are not implemented. In production:
1. Go to Users page
2. Click "Reset Password" next to user
3. Send reset link to user's email

#### Suspend a User
1. Go to Users page
2. Find the user
3. Change status to "Suspended"
4. User will not be able to login

#### Reactivate a User
1. Go to Users page
2. Find the suspended/inactive user
3. Change status to "Active"
4. User can now login

### 10. Best Practices

✅ **DO:**
- Create users with appropriate roles
- Regularly review activity logs
- Keep user information up to date
- Use descriptive full names
- Suspend users instead of deleting when possible

❌ **DON'T:**
- Share admin credentials
- Give Super Admin role to everyone
- Delete users with important activity history
- Leave inactive users as "Active"

### 11. Troubleshooting

**Problem: Can't see Users or Logs menu**
- Solution: You need Super Admin or Admin role to access these features

**Problem: Can't create/edit users**
- Solution: Only Super Admin can manage users

**Problem: Forgot password**
- Solution: Contact system administrator (password reset not yet implemented)

**Problem: Activity logs not showing**
- Solution: Check if you have permission to view logs (Admin or Super Admin only)

### 12. Security Notes

⚠️ **Important for Production:**
- Change default admin password immediately
- Implement proper password authentication
- Use HTTPS for all communications
- Enable two-factor authentication
- Regular security audits
- Backup user data regularly

## Need Help?

For detailed documentation, see [USER_MANAGEMENT.md](./USER_MANAGEMENT.md)

For technical implementation details, check the source code in:
- `context/AuthContext.tsx` - Authentication logic
- `components/admin/` - User management components
- `types/user.ts` - Type definitions
- `data/rolePermissions.ts` - Permission configurations
