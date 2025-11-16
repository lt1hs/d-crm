# Supabase Database Setup Guide

This guide will help you set up Supabase as the backend database for your Aspire HR Dashboard platform.

## 📋 Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed
- Basic understanding of PostgreSQL

## 🚀 Quick Start

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in your project details:
   - **Name**: Aspire HR Dashboard
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
4. Click "Create new project" and wait for setup to complete

### 2. Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Supabase credentials to `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Run Database Migrations

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL editor
5. Click "Run" to execute the migration

This will create all necessary tables, indexes, and security policies.

### 5. Set Up Storage Buckets

1. Go to **Storage** in your Supabase dashboard
2. Create the following buckets:
   - `avatars` (Public)
   - `task-attachments` (Private)
   - `chat-files` (Private)
   - `publications` (Public)

For each bucket:
- Click "New bucket"
- Enter the bucket name
- Set public/private as indicated
- Click "Create bucket"

### 6. Configure Storage Policies

For each private bucket, add these policies in **Storage** → **Policies**:

**task-attachments bucket:**
```sql
-- Allow authenticated users to upload
CREATE POLICY "Users can upload task attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'task-attachments');

-- Allow users to view attachments in their projects
CREATE POLICY "Users can view task attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'task-attachments');
```

**chat-files bucket:**
```sql
-- Allow authenticated users to upload
CREATE POLICY "Users can upload chat files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'chat-files');

-- Allow users to view chat files
CREATE POLICY "Users can view chat files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'chat-files');
```

### 7. Enable Realtime (Optional but Recommended)

For real-time chat and notifications:

1. Go to **Database** → **Replication**
2. Enable replication for these tables:
   - `messages`
   - `notifications`
   - `tasks`
   - `conversation_participants`

## 📊 Database Schema Overview

### Core Tables

- **users** - User profiles and settings
- **projects** - Project management
- **project_members** - Project team members
- **tasks** - Task management with full details
- **subtasks** - Task breakdown
- **task_comments** - Task discussions
- **task_attachments** - File attachments
- **time_entries** - Time tracking
- **conversations** - Chat conversations
- **messages** - Chat messages
- **notifications** - User notifications
- **events** - Calendar events
- **publications** - Content management

### Key Features

✅ **Row Level Security (RLS)** - All tables have security policies
✅ **Automatic Timestamps** - `created_at` and `updated_at` auto-managed
✅ **Foreign Key Constraints** - Data integrity enforced
✅ **Indexes** - Optimized for common queries
✅ **Functions** - Helper functions for complex operations

## 🔐 Authentication Setup

### Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates (optional):
   - Go to **Authentication** → **Email Templates**
   - Customize confirmation and password reset emails

### Configure Auth Settings

1. Go to **Authentication** → **Settings**
2. Recommended settings:
   - **Site URL**: Your app URL (e.g., `http://localhost:5173` for dev)
   - **Redirect URLs**: Add your app URLs
   - **JWT expiry**: 3600 (1 hour)
   - **Refresh token rotation**: Enabled

## 🧪 Testing Your Setup

### 1. Test Database Connection

Create a test file `test-supabase.ts`:

```typescript
import { supabase } from './config/supabase';

async function testConnection() {
  const { data, error } = await supabase
    .from('users')
    .select('count');
  
  if (error) {
    console.error('Connection failed:', error);
  } else {
    console.log('✅ Connected to Supabase!');
  }
}

testConnection();
```

### 2. Create Test User

```typescript
import { authApi } from './utils/api/auth';

async function createTestUser() {
  try {
    await authApi.signUp({
      email: 'test@example.com',
      password: 'testpassword123',
      fullName: 'Test User',
      role: 'employee'
    });
    console.log('✅ Test user created!');
  } catch (error) {
    console.error('Failed to create user:', error);
  }
}
```

## 📚 API Usage Examples

### Working with Tasks

```typescript
import { tasksApi } from './utils/api/tasks';

// Create a task
const task = await tasksApi.createTask({
  title: 'Complete setup',
  description: 'Set up Supabase database',
  project_id: 'project-uuid',
  creator_id: 'user-uuid',
  assignee_id: 'user-uuid',
  priority: 'high',
  status: 'todo',
  due_date: new Date().toISOString()
});

// Get my tasks
const myTasks = await tasksApi.getMyTasks('user-uuid');

// Update task status
await tasksApi.updateTask(task.id, { status: 'completed' });
```

### Working with Chat

```typescript
import { chatApi } from './utils/api/chat';

// Create direct conversation
const conversationId = await chatApi.createDirectConversation(
  'user1-uuid',
  'user2-uuid'
);

// Send message
await chatApi.sendMessage(
  conversationId,
  'user1-uuid',
  'Hello! How are you?'
);

// Get messages
const messages = await chatApi.getMessages(conversationId);
```

### Working with Projects

```typescript
import { projectsApi } from './utils/api/projects';

// Create project
const project = await projectsApi.createProject({
  name: 'New Project',
  description: 'Project description',
  owner_id: 'user-uuid',
  start_date: new Date().toISOString(),
  status: 'active'
});

// Add team member
await projectsApi.addMember(project.id, 'member-uuid', 'member');
```

## 🔄 Real-time Subscriptions

### Listen to New Messages

```typescript
import { supabase } from './config/supabase';

const subscription = supabase
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
      // Update UI with new message
    }
  )
  .subscribe();

// Cleanup
subscription.unsubscribe();
```

### Listen to Task Updates

```typescript
const subscription = supabase
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
```

## 🛡️ Security Best Practices

1. **Never expose your service_role key** - Only use anon key in frontend
2. **Use RLS policies** - All tables have RLS enabled
3. **Validate user input** - Always sanitize data before inserting
4. **Use prepared statements** - Supabase client handles this automatically
5. **Limit API access** - Configure CORS in Supabase dashboard
6. **Monitor usage** - Check Supabase dashboard for unusual activity

## 📈 Performance Optimization

### Indexes

All necessary indexes are created in the migration. Key indexes:
- User lookups by email
- Task queries by project, assignee, status
- Message queries by conversation
- Notification queries by user

### Query Optimization

```typescript
// ✅ Good - Select only needed columns
const { data } = await supabase
  .from('tasks')
  .select('id, title, status')
  .eq('project_id', projectId);

// ❌ Bad - Select all columns when not needed
const { data } = await supabase
  .from('tasks')
  .select('*')
  .eq('project_id', projectId);
```

### Pagination

```typescript
const PAGE_SIZE = 20;

const { data, error } = await supabase
  .from('tasks')
  .select('*')
  .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
```

## 🐛 Troubleshooting

### Common Issues

**Issue: "Invalid API key"**
- Check that your `.env.local` file has correct credentials
- Verify you're using the anon key, not service_role key
- Restart your dev server after changing env variables

**Issue: "Row Level Security policy violation"**
- Check that user is authenticated
- Verify RLS policies are correctly set up
- Check that user has permission to access the resource

**Issue: "Foreign key constraint violation"**
- Ensure referenced records exist before creating relationships
- Check that UUIDs are valid and exist in referenced tables

**Issue: "Connection timeout"**
- Check your internet connection
- Verify Supabase project is not paused
- Check Supabase status page

### Debug Mode

Enable debug logging:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key, {
  auth: {
    debug: true
  }
});
```

## 📞 Support

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **GitHub Issues**: Report bugs in your repository

## 🎉 Next Steps

1. ✅ Set up Supabase project
2. ✅ Run migrations
3. ✅ Configure environment variables
4. ✅ Set up storage buckets
5. ⬜ Integrate with your React components
6. ⬜ Add real-time subscriptions
7. ⬜ Deploy to production

## 📝 Migration Management

For future schema changes:

1. Create new migration file: `supabase/migrations/002_your_change.sql`
2. Write your SQL changes
3. Test locally first
4. Apply to production via SQL Editor

Example migration:

```sql
-- Add new column to tasks table
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS custom_field TEXT;

-- Create index
CREATE INDEX IF NOT EXISTS idx_tasks_custom_field 
ON public.tasks(custom_field);
```

---

**Ready to build something amazing! 🚀**
