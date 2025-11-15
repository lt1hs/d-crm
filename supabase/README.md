# Supabase Database Structure

This directory contains the database schema and migrations for the Aspire HR Dashboard.

## 📁 Directory Structure

```
supabase/
├── migrations/
│   └── 001_initial_schema.sql    # Initial database schema
├── seed.sql                       # Sample data for testing
└── README.md                      # This file
```

## 🗄️ Database Schema

### Core Tables

#### Users & Authentication
- **users** - User profiles extending Supabase auth
  - Stores: profile info, role, department, preferences
  - Relations: creator/assignee of tasks, project owner/member

#### Project Management
- **projects** - Project information
- **project_members** - Project team members (junction table)
- **tasks** - Task management with full details
- **task_dependencies** - Task relationships
- **subtasks** - Task breakdown
- **task_comments** - Task discussions with mentions
- **task_attachments** - File attachments
- **time_entries** - Time tracking per task

#### Communication
- **conversations** - Chat conversations (direct, group, channel)
- **conversation_participants** - Conversation members
- **messages** - Chat messages with file support
- **message_reactions** - Message reactions (emoji)

#### Notifications & Events
- **notifications** - User notifications
- **events** - Calendar events
- **event_participants** - Event attendees

#### Content Management
- **publications** - News, articles, courses, etc.

#### Audit
- **activity_logs** - System activity tracking

## 🔐 Security

### Row Level Security (RLS)

All tables have RLS enabled with policies that ensure:
- Users can only access data they have permission to see
- Project members can view project tasks
- Conversation participants can view messages
- Users can only see their own notifications

### Authentication

- Email/password authentication via Supabase Auth
- JWT tokens for API access
- Automatic session management

## 🚀 Getting Started

### 1. Set Up Supabase Project

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Copy project URL and anon key

### 2. Configure Environment

Add to `.env.local`:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Run Migrations

In Supabase SQL Editor:
1. Copy contents of `migrations/001_initial_schema.sql`
2. Paste and run

### 4. (Optional) Load Seed Data

In Supabase SQL Editor:
1. Copy contents of `seed.sql`
2. Update user UUIDs with actual auth user IDs
3. Paste and run

## 📊 Database Diagram

```
users
  ├── projects (owner)
  ├── project_members
  ├── tasks (creator, assignee)
  ├── task_comments
  ├── time_entries
  ├── conversations (creator)
  ├── conversation_participants
  ├── messages (sender)
  ├── notifications
  ├── events (creator)
  └── publications (author)

projects
  ├── project_members
  └── tasks

tasks
  ├── subtasks
  ├── task_comments
  ├── task_attachments
  ├── task_dependencies
  └── time_entries

conversations
  ├── conversation_participants
  └── messages
      └── message_reactions

events
  └── event_participants
```

## 🔄 Migrations

### Creating New Migrations

When you need to modify the schema:

1. Create new file: `migrations/00X_description.sql`
2. Write your SQL changes
3. Test locally first
4. Apply to production via SQL Editor

Example:
```sql
-- migrations/002_add_task_labels.sql
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS labels TEXT[] DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_tasks_labels 
ON public.tasks USING GIN(labels);
```

## 📈 Indexes

All necessary indexes are created in the initial migration:
- User lookups (email, role, status)
- Task queries (project, assignee, status, priority, due date)
- Message queries (conversation, sender, timestamp)
- Notification queries (user, read status, timestamp)
- Event queries (creator, start time, type)

## 🔧 Functions

### Custom Functions

- `get_unread_message_count(user_uuid)` - Get unread message count for user
- `mark_conversation_read(conv_id, user_uuid)` - Mark conversation as read
- `update_updated_at_column()` - Trigger function for timestamps

## 📝 Data Types

### Enums (via CHECK constraints)

- **User Role**: admin, manager, employee
- **User Status**: online, offline, away, busy
- **Project Status**: active, on-hold, completed, archived
- **Task Priority**: low, medium, high, urgent
- **Task Status**: todo, in-progress, review, blocked, completed, cancelled
- **Conversation Type**: direct, group, channel
- **Message Type**: text, file, system
- **Notification Type**: info, success, warning, error, task, mention, system
- **Event Type**: meeting, deadline, holiday, birthday, time-off, other
- **Publication Type**: news, article, magazine, infographic, video, course
- **Publication Status**: draft, pending, published, archived

## 🎯 Best Practices

1. **Always use transactions** for related operations
2. **Use prepared statements** (Supabase client handles this)
3. **Implement pagination** for large datasets
4. **Clean up subscriptions** in React components
5. **Handle errors gracefully** with try-catch
6. **Use indexes** for frequently queried columns
7. **Monitor query performance** in Supabase dashboard

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime Guide](https://supabase.com/docs/guides/realtime)

## 🐛 Troubleshooting

### Common Issues

**RLS Policy Violation**
- Check user is authenticated
- Verify user has permission to access resource
- Review RLS policies in Supabase dashboard

**Foreign Key Constraint**
- Ensure referenced records exist
- Check UUIDs are valid
- Verify cascade delete settings

**Performance Issues**
- Check query execution plan
- Add indexes for slow queries
- Implement pagination
- Use select() to limit columns

## 📞 Support

For issues or questions:
1. Check [SUPABASE_SETUP.md](../SUPABASE_SETUP.md)
2. Review [SUPABASE_QUICK_REFERENCE.md](../SUPABASE_QUICK_REFERENCE.md)
3. Consult Supabase documentation
4. Ask in Supabase Discord community

---

**Database Version**: 1.0.0  
**Last Updated**: 2024
