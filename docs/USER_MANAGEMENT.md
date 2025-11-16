# User Management System

## Overview
This system provides comprehensive user management with role-based access control (RBAC) and activity logging.

## Features

### 1. User Roles
The system supports four user roles with different permission levels:

#### Super Admin
- Full system access including user management
- Can create, read, update, and delete all resources
- Can manage other users
- Can view activity logs

#### Admin
- Manage all content
- View users (but cannot create/edit/delete)
- Can view activity logs
- Cannot access user management

#### Editor
- Create and edit content
- Cannot delete content
- Cannot access user management or logs

#### Viewer
- Read-only access to all content
- Cannot create, edit, or delete
- Cannot access user management or logs

### 2. User Management Features
- Create new users with specific roles
- Edit user information and roles
- Change user status (Active, Inactive, Suspended)
- Delete users (except your own account)
- Search and filter users
- View user statistics

### 3. Activity Logging
All user actions are automatically logged including:
- User login/logout
- Content creation, updates, and deletion
- User management actions
- Timestamp and user information

Activity logs can be:
- Filtered by action, resource, username, and date range
- Paginated for easy navigation
- Exported for audit purposes

### 4. Authentication
- Login page with username/password
- Session management using localStorage
- Automatic logout functionality
- User profile display in sidebar

## Default Credentials

**Username:** admin  
**Password:** admin (Note: In production, implement proper password authentication)

## Usage

### Creating a New User
1. Navigate to "Users" in the sidebar
2. Click "Add User" button
3. Fill in user details:
   - Username (required)
   - Email (required)
   - Full Name (required)
   - Role (required)
   - Status (required)
   - Avatar URL (optional)
4. Click "Create User"

### Managing Users
- **Edit:** Click "Edit" button next to user
- **Delete:** Click "Delete" button (confirmation required)
- **Change Status:** Use dropdown in status column

### Viewing Activity Logs
1. Navigate to "Activity Logs" in the sidebar
2. Use filters to narrow down logs:
   - Action type
   - Resource
   - Username
   - Date range
3. Navigate through pages using pagination controls

## Permission System

### Resource Permissions
Each role has specific permissions for resources:
- `create`: Can create new items
- `read`: Can view items
- `update`: Can edit existing items
- `delete`: Can remove items

### Checking Permissions in Code
```typescript
import { useAuth } from './context/AuthContext';

const { hasPermission } = useAuth();

// Check if user can create books
if (hasPermission('books', 'create')) {
  // Show create button
}
```

### Logging Activities
```typescript
import { useAuth } from './context/AuthContext';

const { logActivity } = useAuth();

// Log an activity
logActivity('create', 'books', bookId, 'Created new book: Title');
```

## Data Storage

The system uses localStorage for data persistence:
- `users`: Array of user accounts
- `currentUser`: Currently logged-in user
- `activityLogs`: Array of activity logs (max 1000 entries)

## Security Considerations

For production deployment:
1. Replace localStorage with secure backend API
2. Implement proper password hashing (bcrypt, argon2)
3. Add JWT or session-based authentication
4. Implement CSRF protection
5. Add rate limiting for login attempts
6. Use HTTPS for all communications
7. Implement password reset functionality
8. Add two-factor authentication (2FA)
9. Regular security audits

## File Structure

```
types/
  └── user.ts                    # User type definitions

data/
  └── rolePermissions.ts         # Role permission configurations

context/
  └── AuthContext.tsx            # Authentication context

utils/
  └── permissionHelpers.ts       # Permission utility functions

components/admin/
  ├── UserManagement.tsx         # Main user management component
  ├── UserList.tsx               # User list table
  ├── UserForm.tsx               # User create/edit form
  ├── UserStats.tsx              # User statistics dashboard
  ├── ActivityLogs.tsx           # Activity log viewer
  └── LoginPage.tsx              # Login page
```

## Integration with Existing Components

To protect a component with permissions:

```typescript
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { hasPermission, logActivity } = useAuth();

  if (!hasPermission('resource_name', 'read')) {
    return <div>Access Denied</div>;
  }

  const handleCreate = () => {
    // Create logic
    logActivity('create', 'resource_name', itemId, 'Created item');
  };

  return (
    <div>
      {hasPermission('resource_name', 'create') && (
        <button onClick={handleCreate}>Create</button>
      )}
    </div>
  );
};
```

## Future Enhancements

- Email notifications for user actions
- Advanced audit trail with IP tracking
- User groups and teams
- Custom permission sets
- API key management
- Session timeout configuration
- Password complexity requirements
- Account lockout after failed attempts
- User activity dashboard
- Export logs to CSV/PDF
