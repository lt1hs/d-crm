# User Settings Page Documentation

## Overview

The User Settings page provides a comprehensive interface for users to manage their profile, security, preferences, and notification settings.

## Features

### 1. Profile Settings

**Personal Information:**
- Upload profile picture (file upload or URL)
- Edit full name
- Update email address
- View username (read-only)
- Add bio/description
- Add phone number
- Set location

**Features:**
- Real-time avatar preview
- Image upload support (JPG, PNG, GIF)
- URL-based avatar option
- Form validation
- Success/error messages
- Auto-reload after save

### 2. Security Settings

**Password Management:**
- Change password
- Current password verification
- Password strength indicator
- Show/hide password toggle
- Password confirmation

**Password Strength Levels:**
- Weak (< 6 characters) - Red
- Fair (6-9 characters) - Yellow
- Good (10-13 characters) - Blue
- Strong (14+ characters) - Green

**Security Information:**
- Account status display
- Last login timestamp
- Two-factor authentication (coming soon)
- Active sessions management (coming soon)

### 3. Preferences Settings

**Appearance:**
- Theme selection (Light/Dark)
- Visual theme preview
- Language selection (English, Arabic, Persian)
- Flag indicators for languages

**General Preferences:**
- Auto Save toggle
- Compact View toggle
- Weekly Digest toggle

**Data & Privacy:**
- Download your data
- Delete account option

### 4. Notification Settings

**Notification Channels:**
- Email notifications
- Push notifications
- In-app notifications

**Notification Types:**
- User Activity
- Content Updates
- System Alerts
- Activity Logs
- Comments & Mentions

**Advanced Features:**
- Toggle individual notification types
- Enable/disable all at once
- Quiet hours configuration
- Time-based notification pausing

## Navigation

### Access Settings:
1. Click user profile in header (top right)
2. Select "Settings" from dropdown menu
3. Or navigate directly via URL

### Tab Navigation:
- Profile
- Security
- Preferences
- Notifications

## User Interface

### Layout:
```
┌─────────────────────────────────────────┐
│  Settings                               │
│  Manage your account settings           │
├─────────────────────────────────────────┤
│  [Profile] [Security] [Preferences]     │
│  [Notifications]                        │
├─────────────────────────────────────────┤
│                                         │
│  Tab Content Area                       │
│                                         │
│  [Forms, Toggles, Options]              │
│                                         │
└─────────────────────────────────────────┘
```

### Visual Elements:
- Tab-based navigation
- Icon indicators
- Toggle switches
- Color-coded badges
- Progress indicators
- Success/error messages

## Code Structure

### Main Component:
```typescript
components/admin/UserSettings.tsx
```

### Sub-components:
```typescript
components/admin/settings/
├── ProfileSettings.tsx
├── SecuritySettings.tsx
├── PreferencesSettings.tsx
└── NotificationSettings.tsx
```

## Integration

### With Authentication:
```typescript
import { useAuth } from '../../context/AuthContext';

const { currentUser, logActivity } = useAuth();
```

### With Theme:
```typescript
import { useTheme } from '../../context/ThemeContext';

const { theme, toggleTheme } = useTheme();
```

### With Translation:
```typescript
import { useTranslation } from '../../hooks/useTranslation';

const { language, setLanguage } = useTranslation();
```

## Activity Logging

All settings changes are automatically logged:

```typescript
logActivity('update', 'profile', userId, 'Updated profile information');
logActivity('update', 'security', userId, 'Changed password');
logActivity('update', 'preferences', undefined, 'Changed theme to dark');
logActivity('update', 'notifications', undefined, 'Toggled email for user_activity');
```

## Data Storage

### Profile Data:
- Stored in `localStorage` under `users` array
- Current user stored in `currentUser`
- Updates reflected immediately

### Preferences:
- Theme: Managed by ThemeContext
- Language: Managed by LanguageContext
- Other preferences: Component state (can be persisted)

### Notifications:
- Component state (can be persisted to backend)

## Usage Examples

### Update Profile:
1. Navigate to Settings → Profile
2. Edit fields
3. Click "Save Changes"
4. Page reloads with updated info

### Change Password:
1. Navigate to Settings → Security
2. Enter current password
3. Enter new password (see strength indicator)
4. Confirm new password
5. Click "Update Password"

### Change Theme:
1. Navigate to Settings → Preferences
2. Click Light or Dark theme card
3. Theme changes immediately

### Configure Notifications:
1. Navigate to Settings → Notifications
2. Toggle switches for each notification type
3. Click "Save Preferences"

## Responsive Design

- Mobile-friendly layout
- Responsive grid for theme/language selection
- Scrollable tables on small screens
- Touch-friendly toggle switches

## Accessibility

- Proper form labels
- ARIA labels for inputs
- Keyboard navigation support
- Screen reader friendly
- High contrast support

## Future Enhancements

### Profile:
- Social media links
- Custom fields
- Profile visibility settings
- Avatar cropping tool

### Security:
- Two-factor authentication
- Active sessions management
- Login history
- Security questions
- Trusted devices

### Preferences:
- Custom themes
- Font size adjustment
- Keyboard shortcuts
- Dashboard customization
- Export/import settings

### Notifications:
- Notification history
- Custom notification rules
- Digest frequency options
- Channel priorities
- Notification sounds

## Testing Checklist

- [ ] Profile picture upload works
- [ ] Profile information saves correctly
- [ ] Password change validates properly
- [ ] Password strength indicator works
- [ ] Theme toggle works
- [ ] Language change works
- [ ] Notification toggles work
- [ ] Activity logging works
- [ ] Responsive design works
- [ ] Dark mode styling correct
- [ ] Form validation works
- [ ] Error messages display
- [ ] Success messages display

## Troubleshooting

### Profile Not Updating:
- Check browser console for errors
- Verify localStorage is enabled
- Check form validation

### Password Change Fails:
- Verify current password is correct
- Check password meets requirements
- Ensure passwords match

### Theme Not Changing:
- Check ThemeContext is properly set up
- Verify localStorage permissions
- Clear browser cache

### Notifications Not Saving:
- Check component state
- Verify activity logging works
- Check browser console

## Security Considerations

### Production:
1. Implement backend API for profile updates
2. Add proper password hashing
3. Implement actual password verification
4. Add rate limiting for password changes
5. Add email verification for email changes
6. Implement session management
7. Add CSRF protection
8. Validate file uploads server-side
9. Sanitize user inputs
10. Add audit logging

## Related Files

- `components/admin/UserSettings.tsx` - Main settings component
- `components/admin/settings/ProfileSettings.tsx` - Profile tab
- `components/admin/settings/SecuritySettings.tsx` - Security tab
- `components/admin/settings/PreferencesSettings.tsx` - Preferences tab
- `components/admin/settings/NotificationSettings.tsx` - Notifications tab
- `context/AuthContext.tsx` - Authentication context
- `context/ThemeContext.tsx` - Theme management
- `context/LanguageContext.tsx` - Language management

## Version

- **Version**: 1.3.0
- **Date**: November 2025
- **Status**: Complete and Ready for Use
