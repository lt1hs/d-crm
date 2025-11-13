# Integration Examples

This document shows how to integrate the user management system into your existing components.

## Example 1: Basic Permission Check

```typescript
import React from 'react';
import { useAuth } from '../context/AuthContext';

const BooksManagement: React.FC = () => {
  const { hasPermission, logActivity } = useAuth();

  const handleCreateBook = (book: any) => {
    // Create book logic
    logActivity('create', 'books', book.id, `Created book: ${book.title}`);
  };

  return (
    <div>
      <h1>Books Management</h1>
      
      {/* Only show create button if user has permission */}
      {hasPermission('books', 'create') && (
        <button onClick={() => handleCreateBook({})}>
          Add New Book
        </button>
      )}
    </div>
  );
};
```

## Example 2: Using Permission Hook

```typescript
import React from 'react';
import { usePermission } from '../hooks/usePermission';
import { useActivityLogger } from '../hooks/useActivityLogger';

const NewsManagement: React.FC = () => {
  const { canCreate, canUpdate, canDelete } = usePermission('news');
  const { logCreate, logUpdate, logDelete } = useActivityLogger('news');

  const handleCreate = (news: any) => {
    // Create logic
    logCreate(news.id, `Created news: ${news.title}`);
  };

  const handleUpdate = (news: any) => {
    // Update logic
    logUpdate(news.id, `Updated news: ${news.title}`);
  };

  const handleDelete = (newsId: string) => {
    // Delete logic
    logDelete(newsId, 'News article deleted');
  };

  return (
    <div>
      <h1>News Management</h1>
      
      {canCreate && (
        <button onClick={() => handleCreate({})}>Add News</button>
      )}
      
      <div className="news-list">
        {/* News items */}
        <div className="news-item">
          {canUpdate && <button onClick={() => handleUpdate({})}>Edit</button>}
          {canDelete && <button onClick={() => handleDelete('1')}>Delete</button>}
        </div>
      </div>
    </div>
  );
};
```

## Example 3: Using ProtectedRoute Component

```typescript
import React from 'react';
import ProtectedRoute from '../components/admin/ProtectedRoute';
import UserManagement from '../components/admin/UserManagement';

const App: React.FC = () => {
  return (
    <div>
      {/* Protect entire page */}
      <ProtectedRoute resource="users" action="read">
        <UserManagement />
      </ProtectedRoute>
    </div>
  );
};
```

## Example 4: Using PermissionGate Component

```typescript
import React from 'react';
import PermissionGate from '../components/admin/PermissionGate';

const ArticleCard: React.FC<{ article: any }> = ({ article }) => {
  return (
    <div className="article-card">
      <h3>{article.title}</h3>
      <p>{article.content}</p>
      
      <div className="actions">
        {/* Only show edit button if user can update */}
        <PermissionGate resource="articles" action="update">
          <button>Edit</button>
        </PermissionGate>
        
        {/* Only show delete button if user can delete */}
        <PermissionGate resource="articles" action="delete">
          <button>Delete</button>
        </PermissionGate>
      </div>
    </div>
  );
};
```

## Example 5: Protecting Form Actions

```typescript
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const CourseForm: React.FC = () => {
  const { hasPermission, logActivity, currentUser } = useAuth();
  const [course, setCourse] = useState({ title: '', description: '' });

  // Check if user can access this form
  if (!hasPermission('courses', 'create') && !hasPermission('courses', 'update')) {
    return <div>You don't have permission to manage courses.</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create or update logic
    const isNew = !course.id;
    
    if (isNew && hasPermission('courses', 'create')) {
      // Create course
      logActivity('create', 'courses', course.id, `Created course: ${course.title}`);
    } else if (!isNew && hasPermission('courses', 'update')) {
      // Update course
      logActivity('update', 'courses', course.id, `Updated course: ${course.title}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={course.title}
        onChange={(e) => setCourse({ ...course, title: e.target.value })}
        placeholder="Course Title"
      />
      
      <textarea
        value={course.description}
        onChange={(e) => setCourse({ ...course, description: e.target.value })}
        placeholder="Course Description"
      />
      
      <button type="submit">
        {hasPermission('courses', 'create') ? 'Create' : 'Update'} Course
      </button>
    </form>
  );
};
```

## Example 6: Conditional Rendering Based on Role

```typescript
import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Show different content based on role */}
      {currentUser?.role === 'super_admin' && (
        <div className="admin-panel">
          <h2>Admin Panel</h2>
          <p>System statistics and user management</p>
        </div>
      )}
      
      {currentUser?.role === 'editor' && (
        <div className="editor-panel">
          <h2>Content Editor</h2>
          <p>Your recent edits and pending reviews</p>
        </div>
      )}
      
      {currentUser?.role === 'viewer' && (
        <div className="viewer-panel">
          <h2>Content Viewer</h2>
          <p>Browse available content</p>
        </div>
      )}
    </div>
  );
};
```

## Example 7: Logging Complex Actions

```typescript
import React from 'react';
import { useAuth } from '../context/AuthContext';

const PublicationManager: React.FC = () => {
  const { logActivity } = useAuth();

  const handlePublish = (publication: any) => {
    // Publish logic
    
    // Log with detailed information
    logActivity(
      'publish',
      'publications',
      publication.id,
      `Published: "${publication.title}" - Status changed from draft to published`
    );
  };

  const handleBulkDelete = (publicationIds: string[]) => {
    // Bulk delete logic
    
    // Log bulk action
    logActivity(
      'bulk_delete',
      'publications',
      undefined,
      `Deleted ${publicationIds.length} publications: ${publicationIds.join(', ')}`
    );
  };

  const handleExport = (format: string) => {
    // Export logic
    
    // Log export action
    logActivity(
      'export',
      'publications',
      undefined,
      `Exported publications to ${format} format`
    );
  };

  return (
    <div>
      {/* Component content */}
    </div>
  );
};
```

## Example 8: Protecting API Calls

```typescript
import React from 'react';
import { useAuth } from '../context/AuthContext';

const VideoUploader: React.FC = () => {
  const { hasPermission, logActivity } = useAuth();

  const uploadVideo = async (file: File) => {
    // Check permission before making API call
    if (!hasPermission('videos', 'create')) {
      alert('You do not have permission to upload videos');
      return;
    }

    try {
      // Upload logic
      const response = await fetch('/api/videos', {
        method: 'POST',
        body: file,
      });

      const video = await response.json();
      
      // Log successful upload
      logActivity('create', 'videos', video.id, `Uploaded video: ${file.name}`);
      
    } catch (error) {
      // Log failed attempt
      logActivity('create_failed', 'videos', undefined, `Failed to upload: ${file.name}`);
    }
  };

  return (
    <div>
      {hasPermission('videos', 'create') ? (
        <input type="file" onChange={(e) => uploadVideo(e.target.files[0])} />
      ) : (
        <p>You don't have permission to upload videos</p>
      )}
    </div>
  );
};
```

## Example 9: Custom Permission Logic

```typescript
import React from 'react';
import { useAuth } from '../context/AuthContext';

const TestimonialManager: React.FC = () => {
  const { currentUser, hasPermission, logActivity } = useAuth();

  // Custom logic: Users can only edit their own testimonials
  const canEditTestimonial = (testimonial: any) => {
    if (currentUser?.role === 'super_admin' || currentUser?.role === 'admin') {
      return true; // Admins can edit all
    }
    
    if (hasPermission('testimonials', 'update')) {
      return testimonial.authorId === currentUser?.id; // Editors can only edit their own
    }
    
    return false;
  };

  const handleEdit = (testimonial: any) => {
    if (!canEditTestimonial(testimonial)) {
      alert('You can only edit your own testimonials');
      return;
    }

    // Edit logic
    logActivity('update', 'testimonials', testimonial.id, 'Updated testimonial');
  };

  return (
    <div>
      {/* Component content */}
    </div>
  );
};
```

## Example 10: Integrating with Existing Management Component

```typescript
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePermission } from '../hooks/usePermission';
import { useActivityLogger } from '../hooks/useActivityLogger';

const InfographicsManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const { canCreate, canUpdate, canDelete } = usePermission('infographics');
  const { logCreate, logUpdate, logDelete } = useActivityLogger('infographics');
  
  const [infographics, setInfographics] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Check if user can access this page
  if (!usePermission('infographics').canRead) {
    return <div>Access Denied</div>;
  }

  const handleCreate = (infographic: any) => {
    // Create logic
    setInfographics([...infographics, infographic]);
    logCreate(infographic.id, `Created infographic: ${infographic.title}`);
    setIsFormOpen(false);
  };

  const handleUpdate = (infographic: any) => {
    // Update logic
    setInfographics(infographics.map(i => 
      i.id === infographic.id ? infographic : i
    ));
    logUpdate(infographic.id, `Updated infographic: ${infographic.title}`);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure?')) return;
    
    // Delete logic
    setInfographics(infographics.filter(i => i.id !== id));
    logDelete(id, 'Infographic deleted');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Infographics Management</h1>
        
        {canCreate && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Add Infographic
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {infographics.map((infographic) => (
          <div key={infographic.id} className="border rounded-lg p-4">
            <h3>{infographic.title}</h3>
            
            <div className="flex gap-2 mt-4">
              {canUpdate && (
                <button onClick={() => handleUpdate(infographic)}>
                  Edit
                </button>
              )}
              
              {canDelete && (
                <button onClick={() => handleDelete(infographic.id)}>
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && canCreate && (
        <div className="modal">
          {/* Form content */}
        </div>
      )}
    </div>
  );
};

export default InfographicsManagement;
```

## Best Practices

1. **Always check permissions before showing UI elements**
2. **Log all important user actions**
3. **Use descriptive log messages**
4. **Protect both UI and API calls**
5. **Handle permission errors gracefully**
6. **Use custom hooks for cleaner code**
7. **Test with different user roles**
8. **Keep permission logic consistent**

## Common Patterns

### Pattern 1: Check Permission + Log Action
```typescript
if (hasPermission('resource', 'action')) {
  // Perform action
  logActivity('action', 'resource', id, 'Description');
}
```

### Pattern 2: Conditional Rendering
```typescript
{hasPermission('resource', 'action') && (
  <button>Action</button>
)}
```

### Pattern 3: Early Return
```typescript
if (!hasPermission('resource', 'read')) {
  return <AccessDenied />;
}
```

### Pattern 4: Using Hooks
```typescript
const { canCreate, canUpdate, canDelete } = usePermission('resource');
const { logCreate, logUpdate, logDelete } = useActivityLogger('resource');
```
