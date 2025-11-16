# Username Feature for @Mentions

## Overview
Added unique username field to user profiles for use in chat @mentions.

## Database Changes

### Migration File
Created `supabase/migrations/002_add_username.sql`:
- Adds `username` column to `users` table
- Creates unique index for fast lookups
- Auto-generates usernames from email for existing users
- Adds constraint to ensure lowercase alphanumeric format

### Run Migration
```bash
# In Supabase dashboard SQL editor, run:
supabase/migrations/002_add_username.sql
```

Or use Supabase CLI:
```bash
supabase db push
```

## Features

### Username Format
- **Pattern**: `@username`
- **Allowed characters**: lowercase letters (a-z), numbers (0-9), underscore (_)
- **Max length**: 30 characters
- **Unique**: Each username must be unique across all users
- **Auto-generated**: Defaults to email prefix (before @) for existing users

### Profile Settings
Users can now edit their username in:
- **Work Dashboard**: Settings → Profile → Username
- **CRM Dashboard**: Settings → Profile → Username

The input field:
- Shows `@` prefix automatically
- Converts input to lowercase
- Filters out invalid characters
- Shows helpful hint text

### Usage in Chat
The username will be used for:
- @mentions in messages
- User identification in conversations
- Quick user search/autocomplete

## Implementation Details

### Files Modified

1. **Database Schema**
   - `supabase/migrations/002_add_username.sql` - Migration
   - `types/database.ts` - TypeScript types

2. **Profile Settings**
   - `components/work/settings/WorkProfileSettings.tsx`
   - `components/admin/settings/ProfileSettings.tsx`

3. **Features**
   - Editable username field with @ prefix
   - Real-time validation
   - Lowercase enforcement
   - Character filtering

### Type Definition
```typescript
username: string | null  // Added to users table Row type
```

### API Update
The `usersApi.updateProfile()` now accepts username:
```typescript
await usersApi.updateProfile(userId, {
  username: 'johndoe',
  // ... other fields
});
```

## User Experience

### Setting Username
1. Go to Settings → Profile
2. Find "Username (for @mentions in chat)" field
3. Enter desired username (without @)
4. System automatically:
   - Converts to lowercase
   - Removes invalid characters
   - Shows @ prefix
5. Click "Save Changes"

### Username Display
- In chat: `@johndoe`
- In profile: `@johndoe`
- In mentions: `@johndoe`

## Validation Rules

✅ **Valid usernames**:
- `johndoe`
- `john_doe`
- `john123`
- `user_2024`

❌ **Invalid usernames**:
- `John.Doe` (uppercase, dot)
- `john-doe` (hyphen)
- `john doe` (space)
- `john@doe` (special char)

## Next Steps

### For Chat Integration
1. **Mention Detection**: Parse messages for @username patterns
2. **Autocomplete**: Show username suggestions as user types @
3. **User Lookup**: Search users by username
4. **Notifications**: Notify users when mentioned

### Example Chat Implementation
```typescript
// Detect mentions in message
const mentions = message.match(/@([a-z0-9_]+)/g);

// Look up users
const mentionedUsers = await Promise.all(
  mentions.map(m => usersApi.getUserByUsername(m.slice(1)))
);

// Send notifications
mentionedUsers.forEach(user => {
  notificationsApi.create({
    userId: user.id,
    type: 'mention',
    message: `${currentUser.username} mentioned you`
  });
});
```

## Testing

1. **Update your username**:
   - Go to Settings → Profile
   - Set username to something like `testuser`
   - Save changes

2. **Verify in database**:
   ```sql
   SELECT id, email, username FROM users;
   ```

3. **Test validation**:
   - Try uppercase (should convert to lowercase)
   - Try special characters (should be filtered out)
   - Try spaces (should be removed)

## Status
✅ Database migration created
✅ Types updated
✅ Profile settings updated (both Work and Admin)
✅ Validation implemented
✅ UI with @ prefix added
✅ Ready for chat integration
