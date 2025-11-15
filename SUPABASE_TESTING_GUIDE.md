# Supabase Integration Testing Guide

Step-by-step guide to test your Supabase integration.

## 🎯 Prerequisites

- [x] Supabase project created
- [x] Database migration run
- [x] Environment variables configured
- [x] Contexts updated with Supabase

## 📝 Testing Checklist

### 1. Test Database Connection

**Test:** Verify Supabase client can connect

```typescript
// In browser console or create a test component
import { supabase } from './config/supabase';

const testConnection = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('count');
  
  if (error) {
    console.error('❌ Connection failed:', error);
  } else {
    console.log('✅ Connected to Supabase!');
  }
};

testConnection();
```

**Expected Result:** No errors, connection successful

---

### 2. Test Authentication

#### A. Create Test User

**Option 1: Via Supabase Dashboard**
1. Go to Authentication → Users
2. Click "Add user"
3. Email: `test@aldaleel.com`
4. Password: `Test123456!`
5. Click "Create user"
6. Go to Table Editor → users table
7. Add user profile:
   - id: (same as auth user id)
   - email: `test@aspire.com`
   - full_name: `Test User`
   - role: `employee`

**Option 2: Via API**
```typescript
import { authApi } from './utils/api';

await authApi.signUp({
  email: 'test@aspire.com',
  password: 'Test123456!',
  fullName: 'Test User',
  role: 'employee'
});
```

#### B. Test Login

1. Open your app
2. Go to login page
3. Enter credentials:
   - Email: `test@aspire.com`
   - Password: `Test123456!`
4. Click Login

**Expected Result:**
- ✅ User logged in successfully
- ✅ Redirected to dashboard
- ✅ User profile loaded
- ✅ No console errors

#### C. Test Session Persistence

1. Log in
2. Refresh the page
3. Check if still logged in

**Expected Result:**
- ✅ User remains logged in after refresh
- ✅ Profile data persists

#### D. Test Logout

1. Click logout button
2. Check if redirected to login

**Expected Result:**
- ✅ User logged out
- ✅ Redirected to login page
- ✅ Session cleared

---

### 3. Test Project Management

#### A. Create Project

1. Log in
2. Navigate to Work → Projects
3. Click "New Project"
4. Fill in details:
   - Name: "Test Project"
   - Description: "Testing Supabase integration"
   - Color: #3B82F6
   - Status: Active
5. Click "Create"

**Expected Result:**
- ✅ Project created in Supabase
- ✅ Project appears in list
- ✅ No console errors

**Verify in Supabase:**
- Go to Table Editor → projects
- Check if new project exists

#### B. Update Project

1. Click on project
2. Edit name or description
3. Save changes

**Expected Result:**
- ✅ Project updated in database
- ✅ Changes reflected immediately
- ✅ updated_at timestamp changed

#### C. Delete Project

1. Click delete on project
2. Confirm deletion

**Expected Result:**
- ✅ Project removed from database
- ✅ Project removed from UI
- ✅ Related tasks also deleted (cascade)

---

### 4. Test Task Management

#### A. Create Task

1. Navigate to Work → Tasks
2. Click "New Task"
3. Fill in details:
   - Title: "Test Task"
   - Description: "Testing task creation"
   - Project: Select test project
   - Priority: High
   - Status: To Do
   - Due Date: Tomorrow
4. Click "Create"

**Expected Result:**
- ✅ Task created in Supabase
- ✅ Task appears in list
- ✅ Task appears in Kanban board

**Verify in Supabase:**
- Go to Table Editor → tasks
- Check if new task exists

#### B. Update Task Status

1. Drag task to different column in Kanban
2. Or update status in task detail

**Expected Result:**
- ✅ Status updated in database
- ✅ Task moves to correct column
- ✅ Real-time update (if enabled)

#### C. Add Subtask

1. Open task detail
2. Add subtask: "Test subtask"
3. Save

**Expected Result:**
- ✅ Subtask created in database
- ✅ Subtask appears in task detail
- ✅ Can toggle completion

**Verify in Supabase:**
- Go to Table Editor → subtasks
- Check if subtask exists

#### D. Add Comment

1. Open task detail
2. Add comment: "Test comment"
3. Submit

**Expected Result:**
- ✅ Comment saved to database
- ✅ Comment appears in task
- ✅ Timestamp correct

**Verify in Supabase:**
- Go to Table Editor → task_comments
- Check if comment exists

#### E. Delete Task

1. Open task detail
2. Click delete
3. Confirm

**Expected Result:**
- ✅ Task deleted from database
- ✅ Task removed from UI
- ✅ Subtasks and comments also deleted

---

### 5. Test Chat Functionality

#### A. Start Direct Chat

1. Navigate to Chat
2. Click "New Chat"
3. Select a user
4. Send message: "Hello!"

**Expected Result:**
- ✅ Conversation created
- ✅ Message sent to database
- ✅ Message appears in chat

**Verify in Supabase:**
- Go to Table Editor → conversations
- Go to Table Editor → messages
- Check if records exist

#### B. Send Message

1. Type message in chat
2. Press Enter or click Send

**Expected Result:**
- ✅ Message saved to database
- ✅ Message appears immediately
- ✅ Timestamp correct

#### C. Test Real-time Messages

1. Open chat in two browser windows (or use incognito)
2. Log in as different users
3. Send message from one window

**Expected Result:**
- ✅ Message appears in both windows
- ✅ Real-time update works
- ✅ No delay

#### D. Upload File

1. Click attachment icon
2. Select file
3. Upload

**Expected Result:**
- ✅ File uploaded to storage
- ✅ Message with file created
- ✅ File downloadable

**Verify in Supabase:**
- Go to Storage → chat-files
- Check if file exists

#### E. Add Reaction

1. Hover over message
2. Click reaction button
3. Select emoji

**Expected Result:**
- ✅ Reaction saved to database
- ✅ Reaction appears on message
- ✅ Can remove reaction

---

### 6. Test Real-time Subscriptions

#### A. Task Updates

1. Open task list in two windows
2. Update task in one window
3. Check if update appears in other window

**Expected Result:**
- ✅ Changes appear in real-time
- ✅ No page refresh needed

#### B. New Messages

1. Open chat in two windows
2. Send message in one
3. Check if appears in other

**Expected Result:**
- ✅ Message appears instantly
- ✅ Typing indicator works (if implemented)

---

### 7. Test Error Handling

#### A. Network Error

1. Disconnect internet
2. Try to create task
3. Reconnect

**Expected Result:**
- ✅ Error message shown
- ✅ No app crash
- ✅ Can retry after reconnect

#### B. Invalid Data

1. Try to create task with empty title
2. Try to create project with invalid data

**Expected Result:**
- ✅ Validation errors shown
- ✅ User-friendly error messages
- ✅ Form not submitted

#### C. Permission Error

1. Try to delete another user's project (if RLS working)

**Expected Result:**
- ✅ Permission denied error
- ✅ Action blocked
- ✅ Error message shown

---

### 8. Test Performance

#### A. Load Time

1. Clear cache
2. Log in
3. Measure time to load dashboard

**Expected Result:**
- ✅ Dashboard loads in < 3 seconds
- ✅ No unnecessary queries
- ✅ Loading states shown

#### B. Large Dataset

1. Create 50+ tasks
2. Navigate to task list
3. Check performance

**Expected Result:**
- ✅ List loads smoothly
- ✅ Pagination works (if implemented)
- ✅ No lag when scrolling

---

### 9. Test Data Integrity

#### A. Cascade Deletes

1. Create project with tasks
2. Delete project
3. Check if tasks also deleted

**Expected Result:**
- ✅ Tasks deleted automatically
- ✅ No orphaned records
- ✅ Database constraints working

**Verify in Supabase:**
- Check tasks table
- Confirm no tasks with deleted project_id

#### B. Foreign Keys

1. Try to create task with invalid project_id (via API)

**Expected Result:**
- ✅ Error thrown
- ✅ Task not created
- ✅ Foreign key constraint enforced

---

### 10. Test Security (RLS)

#### A. User Data Access

1. Log in as User A
2. Try to access User B's tasks (via API)

**Expected Result:**
- ✅ Access denied
- ✅ Only own tasks visible
- ✅ RLS policies working

#### B. Project Access

1. Create private project
2. Log in as different user
3. Try to access project

**Expected Result:**
- ✅ Project not visible
- ✅ Cannot access project data
- ✅ RLS policies enforced

---

## 🐛 Common Issues & Solutions

### Issue: "Invalid API key"
**Solution:**
- Check `.env.local` has correct credentials
- Restart dev server: `npm run dev`
- Verify no extra spaces in env variables

### Issue: "RLS policy violation"
**Solution:**
- Check user is authenticated
- Verify RLS policies in Supabase dashboard
- Check user has permission for action

### Issue: "Cannot find module"
**Solution:**
- Run `npm install`
- Check import paths are correct
- Restart TypeScript server

### Issue: "Real-time not working"
**Solution:**
- Check replication enabled in Supabase
- Verify subscription code is correct
- Check browser console for errors

### Issue: "File upload fails"
**Solution:**
- Check storage bucket exists
- Verify storage policies configured
- Check file size limits

---

## ✅ Final Verification

After completing all tests:

- [ ] All authentication flows work
- [ ] Projects CRUD operations work
- [ ] Tasks CRUD operations work
- [ ] Chat messaging works
- [ ] Real-time updates work
- [ ] File uploads work
- [ ] Error handling works
- [ ] Performance is acceptable
- [ ] Security (RLS) is enforced
- [ ] No console errors

---

## 📊 Test Results Template

```
Date: _______________
Tester: _______________

Authentication:
- Login: ✅ / ❌
- Logout: ✅ / ❌
- Session: ✅ / ❌

Projects:
- Create: ✅ / ❌
- Update: ✅ / ❌
- Delete: ✅ / ❌

Tasks:
- Create: ✅ / ❌
- Update: ✅ / ❌
- Delete: ✅ / ❌
- Subtasks: ✅ / ❌
- Comments: ✅ / ❌

Chat:
- Send Message: ✅ / ❌
- Real-time: ✅ / ❌
- File Upload: ✅ / ❌

Performance:
- Load Time: _____ seconds
- Large Dataset: ✅ / ❌

Security:
- RLS Working: ✅ / ❌
- Permissions: ✅ / ❌

Overall Status: ✅ PASS / ❌ FAIL

Notes:
_______________________________
_______________________________
```

---

**Ready to test? Start with Authentication and work your way down! 🚀**
