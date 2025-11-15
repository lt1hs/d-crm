# Supabase Quick Reference

Quick reference for common Supabase operations in your Aspire HR Dashboard.

## 🔐 Authentication

```typescript
import { authApi } from './utils/api';

// Sign up
await authApi.signUp({
  email: 'user@example.com',
  password: 'password123',
  fullName: 'John Doe',
  role: 'employee'
});

// Sign in
await authApi.signIn({
  email: 'user@example.com',
  password: 'password123'
});

// Sign out
await authApi.signOut();

// Get current user
const user = await authApi.getCurrentUser();
```

## 👥 Users

```typescript
import { usersApi } from './utils/api';

// Get all users
const users = await usersApi.getAllUsers();

// Get user profile
const profile = await usersApi.getCurrentUserProfile();

// Update profile
await usersApi.updateProfile(userId, {
  full_name: 'Jane Doe',
  position: 'Senior Developer',
  bio: 'Passionate about coding'
});

// Update status
await usersApi.updateStatus(userId, 'online');

// Search users
const results = await usersApi.searchUsers('john');
```

## 📁 Projects

```typescript
import { projectsApi } from './utils/api';

// Get my projects
const projects = await projectsApi.getMyProjects(userId);

// Create project
const project = await projectsApi.createProject({
  name: 'New Project',
  description: 'Project description',
  owner_id: userId,
  start_date: new Date().toISOString(),
  color: '#3B82F6',
  status: 'active'
});

// Add team member
await projectsApi.addMember(projectId, memberId, 'member');

// Get project stats
const stats = await projectsApi.getProjectStats(projectId);
```

## ✅ Tasks

```typescript
import { tasksApi } from './utils/api';

// Get my tasks
const tasks = await tasksApi.getMyTasks(userId);

// Get project tasks
const projectTasks = await tasksApi.getTasksByProject(projectId);

// Create task
const task = await tasksApi.createTask({
  title: 'Task title',
  description: 'Task description',
  project_id: projectId,
  creator_id: userId,
  assignee_id: assigneeId,
  priority: 'high',
  status: 'todo',
  due_date: new Date().toISOString(),
  tags: ['frontend', 'urgent']
});

// Update task
await tasksApi.updateTask(taskId, {
  status: 'in-progress',
  actual_hours: 5
});

// Add subtask
await tasksApi.addSubtask(taskId, 'Subtask title', assigneeId);

// Add comment
await tasksApi.addComment(taskId, userId, 'Great progress!', [mentionedUserId]);

// Get task stats
const stats = await tasksApi.getTaskStats(userId);
```

## 💬 Chat

```typescript
import { chatApi } from './utils/api';

// Get my conversations
const conversations = await chatApi.getMyConversations(userId);

// Create direct conversation
const conversationId = await chatApi.createDirectConversation(userId1, userId2);

// Create group conversation
const group = await chatApi.createGroupConversation(
  'Team Chat',
  creatorId,
  [userId1, userId2, userId3]
);

// Get messages
const messages = await chatApi.getMessages(conversationId);

// Send message
await chatApi.sendMessage(conversationId, userId, 'Hello!');

// Send file
await chatApi.sendMessage(
  conversationId,
  userId,
  'Check this file',
  'file',
  fileUrl,
  fileName,
  fileSize
);

// Add reaction
await chatApi.addReaction(messageId, userId, '👍');

// Mark as read
await chatApi.markAsRead(conversationId, userId);

// Search messages
const results = await chatApi.searchMessages(conversationId, 'search term');
```

## 🔔 Notifications

```typescript
import { notificationsApi } from './utils/api';

// Get notifications
const notifications = await notificationsApi.getNotifications(userId);

// Get unread count
const count = await notificationsApi.getUnreadCount(userId);

// Mark as read
await notificationsApi.markAsRead(notificationId);

// Mark all as read
await notificationsApi.markAllAsRead(userId);

// Create notification
await notificationsApi.createNotification({
  user_id: userId,
  title: 'New Update',
  message: 'You have a new update',
  type: 'info'
});

// Subscribe to real-time notifications
const subscription = notificationsApi.subscribeToNotifications(
  userId,
  (notification) => {
    console.log('New notification:', notification);
    // Update UI
  }
);

// Cleanup
subscription.unsubscribe();
```

## 📤 File Upload

```typescript
import { uploadFile, deleteFile } from './utils/api';

// Upload file
const { url, error } = await uploadFile(
  'task-attachments',
  `${userId}/${Date.now()}-${file.name}`,
  file
);

if (url) {
  // Save URL to database
  await tasksApi.addAttachment(taskId, userId, file.name, url, file.type, file.size);
}

// Delete file
await deleteFile('task-attachments', filePath);
```

## 🔄 Real-time Subscriptions

```typescript
import { supabase } from './config/supabase';

// Subscribe to new messages
const messageSubscription = supabase
  .channel('messages')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${conversationId}`
    },
    (payload) => {
      console.log('New message:', payload.new);
    }
  )
  .subscribe();

// Subscribe to task updates
const taskSubscription = supabase
  .channel('tasks')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'tasks',
      filter: `assignee_id=eq.${userId}`
    },
    (payload) => {
      console.log('Task updated:', payload.new);
    }
  )
  .subscribe();

// Subscribe to all events on a table
const allEventsSubscription = supabase
  .channel('all-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'notifications'
    },
    (payload) => {
      console.log('Change:', payload);
    }
  )
  .subscribe();

// Cleanup
messageSubscription.unsubscribe();
taskSubscription.unsubscribe();
```

## 🔍 Advanced Queries

```typescript
import { supabase } from './config/supabase';

// Complex filtering
const { data } = await supabase
  .from('tasks')
  .select('*')
  .eq('status', 'in-progress')
  .gte('priority', 'high')
  .lte('due_date', new Date().toISOString())
  .order('due_date', { ascending: true })
  .limit(10);

// Join tables
const { data } = await supabase
  .from('tasks')
  .select(`
    *,
    project:projects(name, color),
    assignee:users(full_name, avatar_url)
  `)
  .eq('status', 'todo');

// Count records
const { count } = await supabase
  .from('tasks')
  .select('*', { count: 'exact', head: true })
  .eq('assignee_id', userId);

// Full-text search
const { data } = await supabase
  .from('tasks')
  .select('*')
  .textSearch('title', 'design & homepage');

// Range queries
const { data } = await supabase
  .from('tasks')
  .select('*')
  .range(0, 9); // First 10 records

// OR conditions
const { data } = await supabase
  .from('tasks')
  .select('*')
  .or('status.eq.todo,status.eq.in-progress');

// IN clause
const { data } = await supabase
  .from('tasks')
  .select('*')
  .in('status', ['todo', 'in-progress', 'review']);
```

## 🛡️ Error Handling

```typescript
import { handleSupabaseError } from './config/supabase';

try {
  const task = await tasksApi.createTask(taskData);
  console.log('Task created:', task);
} catch (error) {
  const { error: errorMessage, details } = handleSupabaseError(error);
  console.error('Failed to create task:', errorMessage);
  
  // Show user-friendly error
  alert(errorMessage);
}
```

## 📊 Aggregations

```typescript
// Get task counts by status
const { data } = await supabase
  .from('tasks')
  .select('status')
  .eq('project_id', projectId);

const statusCounts = data.reduce((acc, task) => {
  acc[task.status] = (acc[task.status] || 0) + 1;
  return acc;
}, {});

// Get total hours logged
const { data: timeEntries } = await supabase
  .from('time_entries')
  .select('hours')
  .eq('user_id', userId);

const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
```

## 🔒 Row Level Security

All tables have RLS enabled. Users can only access data they have permission to see:

- **Users**: Can view all users, update own profile
- **Projects**: Can view projects they're members of
- **Tasks**: Can view tasks in their projects
- **Messages**: Can view messages in their conversations
- **Notifications**: Can only see own notifications

## 🎯 Best Practices

1. **Always handle errors**
   ```typescript
   try {
     await api.method();
   } catch (error) {
     console.error(error);
   }
   ```

2. **Use transactions for related operations**
   ```typescript
   const { data, error } = await supabase.rpc('create_project_with_tasks', {
     project_data: projectData,
     tasks_data: tasksData
   });
   ```

3. **Optimize queries**
   - Select only needed columns
   - Use indexes (already created in migration)
   - Implement pagination for large datasets

4. **Clean up subscriptions**
   ```typescript
   useEffect(() => {
     const subscription = supabase.channel('changes').subscribe();
     return () => subscription.unsubscribe();
   }, []);
   ```

5. **Cache frequently accessed data**
   ```typescript
   const [users, setUsers] = useState([]);
   
   useEffect(() => {
     const loadUsers = async () => {
       const data = await usersApi.getAllUsers();
       setUsers(data);
     };
     loadUsers();
   }, []);
   ```

## 📱 React Integration Example

```typescript
import { useEffect, useState } from 'react';
import { tasksApi } from './utils/api';

function TaskList({ userId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    loadTasks();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  );
}
```

---

**Need more help?** Check the full [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) guide.
