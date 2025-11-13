# Header User Menu Documentation

## Overview
The Header component now includes an integrated user dropdown menu that displays the current user's information and provides quick access to user management features.

## Features

### User Profile Display
- Shows user avatar (or initials if no avatar)
- Displays full name and role
- Green status indicator (online)
- Responsive design (hides details on smaller screens)

### Dropdown Menu
The dropdown menu appears when clicking on the user profile button and includes:

#### User Information Section
- Full name
- Email address
- Role badge (color-coded by role type)

#### Quick Actions
- **User Management** (Super Admin & Admin only)
  - Navigate to user management page
  - Only visible if user has permission to view users

- **Activity Logs** (Super Admin & Admin only)
  - Navigate to activity logs page
  - Only visible if user has permission to view logs

- **Settings**
  - Access user settings (placeholder for future implementation)

- **Logout**
  - Sign out of the application
  - Styled in red to indicate destructive action

## User Experience

### Visual Feedback
- Hover effects on all interactive elements
- Smooth transitions and animations
- Chevron icon rotates when menu is open
- Ring color changes on hover (gray → blue)

### Accessibility
- Proper button types
- Click outside to close
- Keyboard navigation support
- ARIA labels for screen readers

### Responsive Design
- Full display on XL screens (shows name, role, chevron)
- Compact display on smaller screens (avatar only)
- Dropdown menu adapts to screen size

## Integration with Authentication

The Header component is fully integrated with the authentication system:

```typescript
import { useAuth } from '../context/AuthContext';

const { currentUser, logout, hasPermission } = useAuth();
```

### Permission-Based Visibility
Menu items are conditionally rendered based on user permissions:

```typescript
{hasPermission('users', 'read') && (
  <button>User Management</button>
)}
```

### User Data Display
- Avatar: `currentUser.avatar` or generated initials
- Name: `currentUser.fullName`
- Email: `currentUser.email`
- Role: `getRoleLabel(currentUser.role)`

## Navigation

The Header accepts an `onNavigate` prop to handle page navigation:

```typescript
interface HeaderProps {
  onNavigate?: (page: Page) => void;
}
```

When a menu item is clicked:
1. Close the dropdown menu
2. Call `onNavigate` with the target page
3. App.tsx updates the current page state

## Styling

### Color Scheme
- **Super Admin Badge**: Purple background
- **Admin Badge**: Blue background
- **Editor Badge**: Yellow background
- **Viewer Badge**: Gray background
- **Logout Button**: Red text with red hover background

### Dark Mode Support
All elements support dark mode with appropriate color adjustments:
- Background colors
- Text colors
- Border colors
- Hover states

## Code Example

### Using the Header Component

```typescript
import Header from './components/Header';

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <div>
      <Header onNavigate={setCurrentPage} />
      {/* Rest of app */}
    </div>
  );
};
```

### Customizing Menu Items

To add new menu items, edit the dropdown section in `Header.tsx`:

```typescript
<button
  onClick={() => {
    setIsUserMenuOpen(false);
    onNavigate?.('new-page');
  }}
  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
  type="button"
>
  <IconName className="w-4 h-4" />
  <span>Menu Item Name</span>
</button>
```

## User Roles and Menu Visibility

### Super Admin
- ✅ User Management
- ✅ Activity Logs
- ✅ Settings
- ✅ Logout

### Admin
- ✅ User Management (view only)
- ✅ Activity Logs
- ✅ Settings
- ✅ Logout

### Editor
- ❌ User Management
- ❌ Activity Logs
- ✅ Settings
- ✅ Logout

### Viewer
- ❌ User Management
- ❌ Activity Logs
- ✅ Settings
- ✅ Logout

## Technical Details

### State Management
```typescript
const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
const userMenuRef = useRef<HTMLDivElement>(null);
```

### Click Outside Handler
```typescript
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
      setIsUserMenuOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);
```

### Logout Handler
```typescript
const handleLogout = () => {
  logout();
  setIsUserMenuOpen(false);
};
```

## Future Enhancements

Potential improvements for the user menu:

1. **User Profile Page**
   - Edit profile information
   - Change password
   - Update avatar

2. **Notifications**
   - Show unread notification count
   - Quick notification preview

3. **Quick Settings**
   - Theme toggle
   - Language selector
   - Notification preferences

4. **Recent Activity**
   - Show user's recent actions
   - Quick access to recent items

5. **Keyboard Shortcuts**
   - Open menu with keyboard
   - Navigate items with arrow keys
   - Close with Escape key

6. **User Preferences**
   - Save UI preferences
   - Custom dashboard layout
   - Favorite pages

## Troubleshooting

### Menu Not Opening
- Check if `currentUser` is defined
- Verify authentication context is properly set up
- Check browser console for errors

### Menu Items Not Showing
- Verify user has correct permissions
- Check `hasPermission` function is working
- Ensure role permissions are configured correctly

### Navigation Not Working
- Verify `onNavigate` prop is passed to Header
- Check App.tsx navigation handler
- Ensure page names match exactly

## Related Files

- `components/Header.tsx` - Main header component
- `context/AuthContext.tsx` - Authentication context
- `utils/permissionHelpers.ts` - Permission utilities
- `App.tsx` - Main app with navigation
- `components/Sidebar.tsx` - Sidebar with user profile

## Testing Checklist

- [ ] User profile displays correctly
- [ ] Dropdown opens on click
- [ ] Dropdown closes when clicking outside
- [ ] Menu items show based on permissions
- [ ] Navigation works correctly
- [ ] Logout functionality works
- [ ] Responsive design works on all screen sizes
- [ ] Dark mode styling is correct
- [ ] Hover effects work properly
- [ ] Avatar displays correctly (with and without image)
