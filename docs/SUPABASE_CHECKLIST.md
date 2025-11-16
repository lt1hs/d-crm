# Supabase Setup Checklist

Use this checklist to ensure your Supabase setup is complete.

## 📋 Pre-Setup

- [*] Node.js and npm installed
- [*] Project dependencies installed (`npm install`)
- [*] Supabase account created at [supabase.com](https://supabase.com)

## 🚀 Supabase Project Setup

### Create Project
- [*] Logged into Supabase dashboard
- [*] Created new project
- [*] Chose project name: "Aspire HR Dashboard"
- [*] Selected region closest to users
- [*] Set strong database password (saved securely)
- [*] Waited for project to finish provisioning

### Get Credentials
- [*] Navigated to Settings → API
- [*] Copied Project URL
- [*] Copied anon/public key
- [*] Saved credentials securely

## 🔧 Local Configuration

### Environment Variables
- [*] Copied `.env.example` to `.env.local`
- [*] Added `VITE_SUPABASE_URL` to `.env.local`
- [*] Added `VITE_SUPABASE_ANON_KEY` to `.env.local`
- [*] Verified no spaces or quotes around values
- [*] Restarted development server

### Verify Installation
- [x] Confirmed `@supabase/supabase-js` is installed
- [x] Checked `package.json` includes Supabase dependency
- [x] No TypeScript errors in `config/supabase.ts`

## 🗄️ Database Setup

### Run Migration
- [*] Opened Supabase dashboard
- [*] Navigated to SQL Editor
- [*] Created new query
- [*] Copied entire contents of `supabase/migrations/001_initial_schema.sql`
- [*] Pasted into SQL Editor
- [*] Clicked "Run" button
- [*] Verified "Success" message
- [*] Checked all 17 tables created in Table Editor

### Verify Tables
- [ ] users table exists
- [ ] projects table exists
- [ ] tasks table exists
- [ ] conversations table exists
- [ ] messages table exists
- [ ] notifications table exists
- [ ] All other tables created

### Check Indexes
- [ ] Navigated to Database → Indexes
- [ ] Verified indexes created for:
  - [ ] users (email, role, status)
  - [ ] tasks (project_id, assignee_id, status)
  - [ ] messages (conversation_id, created_at)
  - [ ] notifications (user_id, read)

### Verify RLS
- [ ] Navigated to Authentication → Policies
- [ ] Confirmed RLS enabled on all tables
- [ ] Verified policies exist for:
  - [ ] users (view all, update own)
  - [ ] projects (view own projects)
  - [ ] tasks (view project tasks)
  - [ ] messages (view own conversations)

## 📦 Storage Setup

### Create Buckets
- [ ] Navigated to Storage
- [ ] Created `avatars` bucket (Public)
- [ ] Created `task-attachments` bucket (Private)
- [ ] Created `chat-files` bucket (Private)
- [ ] Created `publications` bucket (Public)

### Configure Policies
For each private bucket:
- [ ] Added upload policy for authenticated users
- [ ] Added view policy for authenticated users
- [ ] Tested file upload

## 🔐 Authentication Setup

### Enable Email Auth
- [ ] Navigated to Authentication → Providers
- [ ] Enabled Email provider
- [ ] Confirmed email confirmation is enabled (or disabled for testing)

### Configure Settings
- [ ] Set Site URL (e.g., `http://localhost:5173`)
- [ ] Added Redirect URLs
- [ ] Set JWT expiry (default: 3600)
- [ ] Enabled refresh token rotation

### Email Templates (Optional)
- [ ] Customized confirmation email
- [ ] Customized password reset email
- [ ] Customized magic link email

## 🧪 Testing

### Test Database Connection
- [ ] Created test file or used existing component
- [ ] Imported `supabase` client
- [ ] Ran simple query (e.g., `select count from users`)
- [ ] Verified connection successful

### Test Authentication
- [ ] Created test user via Supabase dashboard or API
- [ ] Tested sign up
- [ ] Tested sign in
- [ ] Tested sign out
- [ ] Verified user profile created in users table

### Test CRUD Operations
- [ ] Created test project
- [ ] Created test task
- [ ] Updated task status
- [ ] Deleted test data
- [ ] Verified all operations successful

### Test Real-time
- [ ] Set up real-time subscription
- [ ] Made change in Supabase dashboard
- [ ] Verified change received in app
- [ ] Cleaned up subscription

## 🔄 Optional Setup

### Seed Data
- [ ] Opened SQL Editor
- [ ] Copied `supabase/seed.sql`
- [ ] Updated user UUIDs with real auth user IDs
- [ ] Ran seed script
- [ ] Verified sample data created

### Enable Realtime
- [ ] Navigated to Database → Replication
- [ ] Enabled replication for:
  - [ ] messages
  - [ ] notifications
  - [ ] tasks
  - [ ] conversation_participants

### Backups
- [ ] Reviewed backup settings
- [ ] Enabled automatic backups (if on paid plan)
- [ ] Noted backup schedule

### Monitoring
- [ ] Explored Database → Logs
- [ ] Set up alerts (if needed)
- [ ] Bookmarked dashboard URL

## 📱 Integration

### Update AuthContext
- [x] Replaced mock auth with Supabase auth
- [ ] Tested login flow
- [ ] Tested logout flow
- [ ] Verified session persistence

### Update WorkContext
- [x] Replaced mock tasks with Supabase queries
- [ ] Tested task creation
- [ ] Tested task updates
- [ ] Tested task deletion

### Update ChatContext
- [x] Replaced mock messages with Supabase
- [ ] Tested sending messages
- [ ] Tested real-time message updates
- [ ] Tested file uploads

### Add Notifications
- [ ] Integrated notification API
- [ ] Set up real-time subscription
- [ ] Tested notification creation
- [ ] Tested mark as read

## 🎨 UI Updates

### Loading States
- [ ] Added loading spinners
- [ ] Added skeleton screens
- [ ] Handled empty states

### Error Handling
- [ ] Added error boundaries
- [ ] Displayed user-friendly errors
- [ ] Logged errors for debugging

### Optimistic Updates
- [ ] Implemented for task updates
- [ ] Implemented for message sending
- [ ] Added rollback on error

## 🚀 Production Preparation

### Security
- [ ] Reviewed RLS policies
- [ ] Tested with different user roles
- [ ] Verified no data leaks
- [ ] Enabled 2FA on Supabase account

### Performance
- [ ] Implemented pagination
- [ ] Added caching where appropriate
- [ ] Optimized queries (select only needed columns)
- [ ] Tested with realistic data volume

### Environment
- [ ] Created production Supabase project
- [ ] Updated production environment variables
- [ ] Tested production deployment
- [ ] Set up monitoring

### Documentation
- [ ] Documented API usage
- [ ] Created deployment guide
- [ ] Documented environment variables
- [ ] Added troubleshooting guide

## ✅ Final Verification

- [ ] All features working with Supabase
- [ ] No console errors
- [ ] Real-time updates working
- [ ] File uploads working
- [ ] Authentication flow complete
- [ ] All tests passing
- [ ] Performance acceptable
- [ ] Security verified

## 📚 Documentation Read

- [ ] Read SUPABASE_SETUP.md
- [ ] Read SUPABASE_QUICK_REFERENCE.md
- [ ] Read SUPABASE_INTEGRATION.md
- [ ] Read supabase/README.md
- [ ] Bookmarked for future reference

## 🎉 Completion

- [ ] All checklist items completed
- [ ] Application fully functional with Supabase
- [ ] Team members trained (if applicable)
- [ ] Ready for production deployment

---

**Congratulations! Your Supabase setup is complete! 🚀**

**Next Steps:**
1. Start building features
2. Monitor usage in Supabase dashboard
3. Optimize based on real-world usage
4. Scale as needed

**Need Help?**
- Review documentation files
- Check Supabase docs
- Join Supabase Discord
- Review code examples

**Setup Date**: _______________  
**Completed By**: _______________  
**Production URL**: _______________
