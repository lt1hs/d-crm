# Migration Guide - Adding User Management to Existing Components

This guide helps you add user management and permission checking to your existing components.

## Step-by-Step Migration

### Step 1: Import Required Hooks

Add these imports to your component:

```typescript
import { useAuth } from '../context/AuthContext';
// OR use the convenience hooks:
import { usePermission } from '../hooks/usePermission';
import { useActivityLogger } from '../hooks/useActivityLogger';
```

### Step 2: Add Permission Checks

#### Before (No Permission Check):
```typescript
const BooksManagement: React.FC = () => {
  const [books, setBooks] = useState([]);

  const handleCreate = (book) => {
    setBooks([...books, book]);
  };

  return (
    <div>
      <button onClick={() => handleCreate({})}>Add Book</button>
    </div>
  );
};
```

#### After (With Permission Check):
```typescript
const BooksManagement: React.FC = () => {
  const [books, setBooks] = useState([]);
  const { canCreate } = usePermission('books');
  const { logCreate } = useActivityLogger('books');

  const handleCreate = (book) => {
    setBooks([...books, book]);
    logCreate(book.id, `Created book: ${book.title}`);
  };

  return (
    <div>
      {canCreate && (
        <button onClick={() => handleCreate({})}>Add Book</button>
      )}
    </div>
  );
};
```

### Step 3: Add Activity Logging

#### Before (No Logging):
```typescript
const handleUpdate = (book) => {
  // Update logic
  updateBook(book);
};

const handleDelete = (bookId) => {
  // Delete logic
  deleteBook(bookId);
};
```

#### After (With Logging):
```typescript
const { logUpdate, logDelete } = useActivityLogger('books');

const handleUpdate = (book) => {
  // Update logic
  updateBook(book);
  logUpdate(book.id, `Updated book: ${book.title}`);
};

const handleDelete = (bookId) => {
  // Delete logic
  deleteBook(bookId);
  logDelete(bookId, 'Book deleted');
};
```

### Step 4: Protect Page Access

#### Before (No Protection):
```typescript
const UserManagement: React.FC = () => {
  return (
    <div>
      <h1>User Management</h1>
      {/* Content */}
    </div>
  );
};
```

#### After (With Protection):
```typescript
const UserManagement: React.FC = () => {
  const { hasPermission } = useAuth();

  if (!hasPermission('users', 'read')) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Access Denied</p>
      </div>
    );
  }

  return (
    <div>
      <h1>User Management</h1>
      {/* Content */}
    </div>
  );
};
```

## Migration Checklist for Each Component

### For Management Components (List/CRUD)

- [ ] Import `usePermission` and `useActivityLogger` hooks
- [ ] Add permission check for page access
- [ ] Conditionally show "Create" button based on `canCreate`
- [ ] Conditionally show "Edit" button based on `canUpdate`
- [ ] Conditionally show "Delete" button based on `canDelete`
- [ ] Log create actions with `logCreate`
- [ ] Log update actions with `logUpdate`
- [ ] Log delete actions with `logDelete`
- [ ] Test with different user roles

### For Form Components

- [ ] Import `useAuth` hook
- [ ] Check permission before allowing form submission
- [ ] Log form submission with appropriate action
- [ ] Show appropriate error message if no permission
- [ ] Test with different user roles

### For Card/List Components

- [ ] Import `PermissionGate` component
- [ ] Wrap action buttons with `PermissionGate`
- [ ] Test visibility with different user roles

## Quick Migration Examples

### Example 1: News Management

```typescript
// Before
const NewsManagement: React.FC = () => {
  const [news, setNews] = useState([]);

  return (
    <div>
      <button onClick={handleCreate}>Add News</button>
      {news.map(item => (
        <div key={item.id}>
          <button onClick={() => handleEdit(item)}>Edit</button>
          <button onClick={() => handleDelete(item.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

// After
const NewsManagement: React.FC = () => {
  const [news, setNews] = useState([]);
  const { canCreate, canUpdate, canDelete } = usePermission('news');
  const { logCreate, logUpdate, logDelete } = useActivityLogger('news');

  const handleCreate = (item) => {
    // Create logic
    logCreate(item.id, `Created news: ${item.title}`);
  };

  const handleEdit = (item) => {
    // Edit logic
    logUpdate(item.id, `Updated news: ${item.title}`);
  };

  const handleDelete = (id) => {
    // Delete logic
    logDelete(id, 'News deleted');
  };

  return (
    <div>
      {canCreate && <button onClick={handleCreate}>Add News</button>}
      {news.map(item => (
        <div key={item.id}>
          {canUpdate && <button onClick={() => handleEdit(item)}>Edit</button>}
          {canDelete && <button onClick={() => handleDelete(item.id)}>Delete</button>}
        </div>
      ))}
    </div>
  );
};
```

### Example 2: Article Form

```typescript
// Before
const ArticleForm: React.FC = () => {
  const handleSubmit = (article) => {
    saveArticle(article);
  };

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
};

// After
const ArticleForm: React.FC = () => {
  const { hasPermission } = useAuth();
  const { logCreate, logUpdate } = useActivityLogger('articles');

  if (!hasPermission('articles', 'create') && !hasPermission('articles', 'update')) {
    return <div>You don't have permission to manage articles.</div>;
  }

  const handleSubmit = (article) => {
    saveArticle(article);
    
    if (article.id) {
      logUpdate(article.id, `Updated article: ${article.title}`);
    } else {
      logCreate(article.id, `Created article: ${article.title}`);
    }
  };

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
};
```

### Example 3: Video Card

```typescript
// Before
const VideoCard: React.FC<{ video: Video }> = ({ video }) => {
  return (
    <div className="video-card">
      <h3>{video.title}</h3>
      <button onClick={handleEdit}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

// After
import PermissionGate from '../components/admin/PermissionGate';

const VideoCard: React.FC<{ video: Video }> = ({ video }) => {
  return (
    <div className="video-card">
      <h3>{video.title}</h3>
      
      <PermissionGate resource="videos" action="update">
        <button onClick={handleEdit}>Edit</button>
      </PermissionGate>
      
      <PermissionGate resource="videos" action="delete">
        <button onClick={handleDelete}>Delete</button>
      </PermissionGate>
    </div>
  );
};
```

## Resource Names Reference

Use these resource names for permission checks:

- `menu` - Menu management
- `slider` - Slider management
- `books` - Books management
- `news` - News management
- `activities` - Activities management
- `magazine` - Magazine management
- `articles` - Articles management
- `courses` - Courses management
- `publications` - Publications management
- `infographics` - Infographics management
- `videos` - Videos management
- `testimonials` - Testimonials management
- `users` - User management
- `logs` - Activity logs

## Action Types Reference

- `create` - Creating new items
- `read` - Viewing/reading items
- `update` - Editing existing items
- `delete` - Removing items

## Testing Your Migration

After migrating a component, test with these user accounts:

1. **Super Admin** (admin/admin)
   - Should see all buttons and actions
   - Should be able to perform all operations

2. **Editor** (editor/editor)
   - Should see create and edit buttons
   - Should NOT see delete buttons
   - Should NOT see user management

3. **Viewer** (viewer/viewer)
   - Should NOT see any action buttons
   - Should only be able to view content

## Common Issues and Solutions

### Issue 1: Buttons Still Showing for Viewers
**Solution**: Make sure you're checking permissions before rendering buttons:
```typescript
{canCreate && <button>Create</button>}
```

### Issue 2: Activity Not Being Logged
**Solution**: Make sure you're calling the log function after the action:
```typescript
const handleCreate = (item) => {
  createItem(item);
  logCreate(item.id, 'Description'); // Don't forget this!
};
```

### Issue 3: Permission Check Not Working
**Solution**: Verify you're using the correct resource name:
```typescript
// Wrong
const { canCreate } = usePermission('book'); // Missing 's'

// Correct
const { canCreate } = usePermission('books');
```

### Issue 4: Page Accessible Without Permission
**Solution**: Add permission check at the top of the component:
```typescript
const MyComponent = () => {
  const { hasPermission } = useAuth();
  
  if (!hasPermission('resource', 'read')) {
    return <div>Access Denied</div>;
  }
  
  // Rest of component
};
```

## Gradual Migration Strategy

You don't have to migrate everything at once. Here's a recommended order:

1. **Phase 1**: Add permission checks to critical components
   - User management
   - Content deletion actions
   - System settings

2. **Phase 2**: Add activity logging to important actions
   - Create operations
   - Update operations
   - Delete operations

3. **Phase 3**: Add permission checks to all components
   - All management pages
   - All forms
   - All action buttons

4. **Phase 4**: Refine and test
   - Test with all user roles
   - Verify logs are accurate
   - Adjust permissions as needed

## Need Help?

- Check `INTEGRATION_EXAMPLES.md` for more examples
- Review `USER_MANAGEMENT.md` for technical details
- Look at `components/admin/UserManagement.tsx` for a complete example
