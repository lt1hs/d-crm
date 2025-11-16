# 🚀 Work Management - Quick Reference Card

## 📋 Quick Commands

```bash
# Install dependencies
npm install react-router-dom

# Run CRM
npm run dev:crm

# Run Work (separate port)
npm run dev:work

# Run both (with routing)
npm run dev

# Build for production
npm run build
```

---

## 🔗 Quick Links

| App | URL | Purpose |
|-----|-----|---------|
| **CRM** | `/crm` | Content management |
| **Work** | `/work` | Task management |

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `App.tsx` | Main router |
| `CRMApp.tsx` | CRM application |
| `WorkApp.tsx` | Work application |
| `WorkSidebar.tsx` | Work navigation |
| `WorkHeader.tsx` | Work header |
| `WorkContext.tsx` | Work state |

---

## 🎯 Quick Setup

### 1. Rename App
```bash
mv App.tsx CRMApp.tsx
```

### 2. Create Router
Create `App.tsx`:
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CRMApp from './CRMApp';
import WorkApp from './WorkApp';

<BrowserRouter>
  <Routes>
    <Route path="/crm/*" element={<CRMApp />} />
    <Route path="/work/*" element={<WorkApp />} />
  </Routes>
</BrowserRouter>
```

### 3. Run
```bash
npm run dev
```

---

## 💾 Data Keys

### CRM Data
- `news_items`
- `calendar_events`
- `chat_messages`

### Work Data
- `work_tasks`
- `work_projects`
- `work_time_entries`

### Shared Data
- `users`
- `auth_token`

---

## 🎨 Components

### Work App Components
```
WorkApp
├── WorkSidebar
├── WorkHeader
├── WorkDashboard
├── KanbanBoard
├── TaskList
├── ProjectManagement
└── TimeTracking
```

---

## 🔄 Navigation

### From CRM to Work
```tsx
<a href="/work">Work Management</a>
```

### From Work to CRM
```tsx
<a href="/crm">Back to CRM</a>
```

---

## 📊 Quick Stats

### Work Dashboard Shows
- Total tasks
- In progress tasks
- Overdue tasks
- Completion rate
- Active projects
- Hours logged

---

## 🎯 Common Tasks

### Create Project
1. Go to Projects tab
2. Click "New Project"
3. Fill form
4. Click "Create"

### Create Task
1. Click "Quick Add" or "New Task"
2. Fill form
3. Select project
4. Assign user
5. Click "Create"

### Use Kanban
1. Go to Kanban tab
2. Drag tasks between columns
3. Click task for details

### Log Time
1. Open task
2. Enter hours
3. Add description
4. Click "Log"

---

## 🔧 Customization

### Change Colors
```tsx
// WorkSidebar.tsx
className="bg-gradient-to-br from-blue-600 to-purple-600"
```

### Add Page
```tsx
// WorkApp.tsx
case 'newpage':
  return <NewPage />;
```

### Update Branding
```tsx
// WorkSidebar.tsx
<h1>Your Brand</h1>
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Blank page | Check imports |
| No auth | Wrap with AuthProvider |
| No data | Initialize sample data |
| 404 error | Check routes |
| Styles missing | Import index.css |

---

## 📚 Documentation

| File | When to Read |
|------|--------------|
| `WORK_FINAL_SUMMARY.md` | **Start here** |
| `WORK_IMPLEMENTATION_GUIDE.md` | Setup steps |
| `WORK_ARCHITECTURE.md` | Understand structure |
| `WORK_SEPARATE_DASHBOARD.md` | Detailed guide |

---

## ✅ Checklist

Setup:
- [ ] Install react-router-dom
- [ ] Rename App.tsx
- [ ] Create router
- [ ] Test both apps

Features:
- [ ] Can login
- [ ] Can create project
- [ ] Can create task
- [ ] Kanban works
- [ ] Time tracking works

---

## 🎯 Key Features

### Dashboard
- Statistics overview
- Recent tasks
- Priority distribution

### Kanban
- Drag-and-drop
- 5 status columns
- Visual workflow

### Tasks
- Advanced filtering
- Multiple sort options
- Detailed view

### Projects
- Team management
- Progress tracking
- Custom colors

### Time
- Log hours
- View analytics
- Time by project

---

## 💡 Pro Tips

1. Use routing for simplest setup
2. Initialize sample data first
3. Test on mobile
4. Customize branding
5. Add navigation links
6. Check documentation

---

## 🚀 Quick Start

```bash
# 1. Install
npm install react-router-dom

# 2. Setup routing (see WORK_IMPLEMENTATION_GUIDE.md)

# 3. Run
npm run dev

# 4. Access
http://localhost:5173/work

# 5. Done! 🎉
```

---

## 📞 Need Help?

1. Read `WORK_IMPLEMENTATION_GUIDE.md`
2. Check `WORK_ARCHITECTURE.md`
3. Review browser console
4. Test with sample data

---

## 🎉 Summary

**Two Apps:**
- CRM at `/crm`
- Work at `/work`

**Shared:**
- Users
- Authentication
- Design

**Separate:**
- Navigation
- Features
- Data

**Result:**
Professional work management system! 🚀

---

**Keep this card handy for quick reference!**
