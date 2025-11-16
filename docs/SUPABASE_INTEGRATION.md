# Supabase Integration Guide

Complete guide for integrating Supabase into your React components.

## 📦 What's Included

Your Supabase setup includes:

✅ **Database Schema** - Complete PostgreSQL schema with 17+ tables  
✅ **Type Definitions** - Full TypeScript types for type-safe queries  
✅ **API Utilities** - Pre-built functions for all operations  
✅ **Authentication** - Email/password auth with user profiles  
✅ **Row Level Security** - Secure data access policies  
✅ **Real-time Support** - Live updates for chat and notifications  
✅ **File Storage** - Upload/download files with proper permissions  

## 🚀 Quick Integration

### Step 1: Set Up Environment

```bash
# Copy environment template
cp .env.example .env.local

# Add your Supabase credentials
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 2: Run Database Migration

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and run `supabase/migrations/001_initial_schema.sql`

### Step 3: Use in Components

```typescript
import { tasksApi, authApi, usersApi } from './utils/api';

// Now you can use the APIs in your components!
```

## 🎯 Integration Examples

### 1. Authentication Flow

Replace your mock authentication with real Supabase auth:

```typescript
// components/admin/LoginPage.tsx
import { useState } from 'react';
import { authApi } from '../../utils/api';

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authApi.signIn({ email, password });
      onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### 2. Auth Context Integration

Update your AuthContext to use Supabase:

```typescript
// context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { authApi, usersApi } from '../utils/api';
import { supabase } from '../config/supabase';

interface AuthContextType {
  currentUser: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    authApi.getSession().then(session => {
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setCurrentUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const profile = await usersApi.getUser(userId);
      setCurrentUser(profile);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { user } = await authApi.signIn({ email, password });
    if (user) {
      await loadUserProfile(user.id);
    }
  };

  const signOut = async () => {
    await authApi.signOut();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

### 3. Task Management Integration

Update WorkContext to use Supabase:

```typescript
// context/WorkContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { tasksApi, projectsApi } from '../utils/api';
import { useAuth } from './AuthContext';
import { supabase } from '../config/supabase';

interface WorkContextType {
  tasks: any[];
  projects: any[];
  loading: boolean;
  createTask: (task: any) => Promise<void>;
  updateTask: (taskId: string, updates: any) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

const WorkContext = createContext<WorkContextType | undefined>(undefined);

export function WorkProvider({ children }) {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadData();
      subscribeToChanges();
    }
  }, [currentUser]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, projectsData] = await Promise.all([
        tasksApi.getMyTasks(currentUser.id),
        projectsApi.getMyProjects(currentUser.id)
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToChanges = () => {
    // Subscribe to task updates
    const subscription = supabase
      .channel('task-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `assignee_id=eq.${currentUser.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTasks(prev => [...prev, payload.new]);
          } else if (payload.eventType === 'UPDATE') {
            setTasks(prev => prev.map(t => 
              t.id === payload.new.id ? payload.new : t
            ));
          } else if (payload.eventType === 'DELETE') {
            setTasks(prev => prev.filter(t => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => subscription.unsubscribe();
  };

  const createTask = async (taskData: any) => {
    const task = await tasksApi.createTask({
      ...taskData,
      creator_id: currentUser.id
    });
    setTasks(prev => [...prev, task]);
  };

  const updateTask = async (taskId: string, updates: any) => {
    const updated = await tasksApi.updateTask(taskId, updates);
    setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
  };

  const deleteTask = async (taskId: string) => {
    await tasksApi.deleteTask(taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  return (
    <WorkContext.Provider value={{
      tasks,
      projects,
      loading,
      createTask,
      updateTask,
      deleteTask
    }}>
      {children}
    </WorkContext.Provider>
  );
}

export const useWork = () => {
  const context = useContext(WorkContext);
  if (!context) throw new Error('useWork must be used within WorkProvider');
  return context;
};
```

### 4. Chat Integration

Update EnhancedChatContext to use Supabase:

```typescript
// context/EnhancedChatContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { chatApi, uploadFile } from '../utils/api';
import { useAuth } from './AuthContext';
import { supabase } from '../config/supabase';

export function EnhancedChatProvider({ children }) {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);

  useEffect(() => {
    if (currentUser) {
      loadConversations();
      subscribeToMessages();
    }
  }, [currentUser]);

  const loadConversations = async () => {
    const data = await chatApi.getMyConversations(currentUser.id);
    setConversations(data);
  };

  const subscribeToMessages = () => {
    const subscription = supabase
      .channel('new-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        async (payload) => {
          // Update conversation with new message
          if (activeConversation?.id === payload.new.conversation_id) {
            setActiveConversation(prev => ({
              ...prev,
              messages: [...prev.messages, payload.new]
            }));
          }
          // Reload conversations to update last message
          await loadConversations();
        }
      )
      .subscribe();

    return () => subscription.unsubscribe();
  };

  const sendMessage = async (conversationId: string, content: string) => {
    await chatApi.sendMessage(conversationId, currentUser.id, content);
  };

  const uploadChatFile = async (conversationId: string, file: File) => {
    const path = `${currentUser.id}/${Date.now()}-${file.name}`;
    const { url } = await uploadFile('chat-files', path, file);
    
    if (url) {
      await chatApi.sendMessage(
        conversationId,
        currentUser.id,
        file.name,
        'file',
        url,
        file.name,
        file.size
      );
    }
  };

  return (
    <EnhancedChatContext.Provider value={{
      conversations,
      activeConversation,
      setActiveConversation,
      sendMessage,
      uploadFile: uploadChatFile
    }}>
      {children}
    </EnhancedChatContext.Provider>
  );
}
```

### 5. Real-time Notifications

```typescript
// components/NotificationBell.tsx
import { useEffect, useState } from 'react';
import { notificationsApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';

function NotificationBell() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (currentUser) {
      loadNotifications();
      
      // Subscribe to new notifications
      const subscription = notificationsApi.subscribeToNotifications(
        currentUser.id,
        (notification) => {
          setNotifications(prev => [notification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Show browser notification
          if (Notification.permission === 'granted') {
            new Notification(notification.title, {
              body: notification.message,
              icon: '/icon.png'
            });
          }
        }
      );

      return () => subscription.unsubscribe();
    }
  }, [currentUser]);

  const loadNotifications = async () => {
    const data = await notificationsApi.getNotifications(currentUser.id);
    setNotifications(data);
    
    const count = await notificationsApi.getUnreadCount(currentUser.id);
    setUnreadCount(count);
  };

  const markAllAsRead = async () => {
    await notificationsApi.markAllAsRead(currentUser.id);
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="notification-bell">
      <button onClick={() => setShowDropdown(!showDropdown)}>
        🔔
        {unreadCount > 0 && (
          <span className="badge">{unreadCount}</span>
        )}
      </button>
      
      {showDropdown && (
        <div className="dropdown">
          <div className="header">
            <h3>Notifications</h3>
            <button onClick={markAllAsRead}>Mark all read</button>
          </div>
          <div className="list">
            {notifications.map(notification => (
              <div key={notification.id} className={notification.read ? 'read' : 'unread'}>
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

## 🔄 Migration from Mock Data

### Before (Mock Data)
```typescript
const [tasks, setTasks] = useState(mockTasks);
```

### After (Supabase)
```typescript
const [tasks, setTasks] = useState([]);

useEffect(() => {
  const loadTasks = async () => {
    const data = await tasksApi.getMyTasks(userId);
    setTasks(data);
  };
  loadTasks();
}, [userId]);
```

## 🎨 UI Components with Supabase

### Loading States

```typescript
function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await tasksApi.getMyTasks(userId);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (tasks.length === 0) return <EmptyState />;

  return (
    <div>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
```

### Optimistic Updates

```typescript
const updateTaskStatus = async (taskId, newStatus) => {
  // Optimistic update
  setTasks(prev => prev.map(t => 
    t.id === taskId ? { ...t, status: newStatus } : t
  ));

  try {
    // Actual update
    await tasksApi.updateTask(taskId, { status: newStatus });
  } catch (error) {
    // Revert on error
    loadTasks();
    showError('Failed to update task');
  }
};
```

## 🔐 Protected Routes

```typescript
// components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!currentUser) return <Navigate to="/login" />;

  return children;
}

// Usage in App.tsx
<Route path="/work" element={
  <ProtectedRoute>
    <WorkApp />
  </ProtectedRoute>
} />
```

## 📊 Performance Tips

### 1. Pagination

```typescript
const [page, setPage] = useState(0);
const PAGE_SIZE = 20;

const loadTasks = async () => {
  const { data } = await supabase
    .from('tasks')
    .select('*')
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
  
  setTasks(data);
};
```

### 2. Caching

```typescript
// Use React Query or SWR for automatic caching
import { useQuery } from '@tanstack/react-query';

function TaskList() {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', userId],
    queryFn: () => tasksApi.getMyTasks(userId),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}
```

### 3. Selective Loading

```typescript
// Only load what you need
const { data } = await supabase
  .from('tasks')
  .select('id, title, status, due_date') // Not *
  .eq('assignee_id', userId);
```

## 🐛 Error Handling

```typescript
import { handleSupabaseError } from './config/supabase';

try {
  await tasksApi.createTask(taskData);
} catch (error) {
  const { error: message } = handleSupabaseError(error);
  
  // Show user-friendly error
  toast.error(message);
  
  // Log for debugging
  console.error('Task creation failed:', error);
}
```

## 📱 Offline Support

```typescript
// Check connection status
const [isOnline, setIsOnline] = useState(navigator.onLine);

useEffect(() => {
  const handleOnline = () => setIsOnline(true);
  const handleOffline = () => setIsOnline(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}, []);

// Queue operations when offline
if (!isOnline) {
  queueOperation({ type: 'createTask', data: taskData });
} else {
  await tasksApi.createTask(taskData);
}
```

## 🎉 Next Steps

1. ✅ Set up Supabase project
2. ✅ Run migrations
3. ⬜ Update AuthContext
4. ⬜ Update WorkContext
5. ⬜ Update EnhancedChatContext
6. ⬜ Add real-time subscriptions
7. ⬜ Test all features
8. ⬜ Deploy to production

## 📚 Additional Resources

- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Detailed setup guide
- [SUPABASE_QUICK_REFERENCE.md](./SUPABASE_QUICK_REFERENCE.md) - API quick reference
- [supabase/README.md](./supabase/README.md) - Database schema documentation

---

**Happy coding! 🚀**
