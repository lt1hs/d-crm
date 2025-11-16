# 🚀 Work Management - Implementation Guide

## Quick Implementation (5 Minutes)

Follow these steps to get your separate Work Management dashboard running.

---

## Option 1: Separate Routes (Recommended) ⭐

### Step 1: Install React Router

```bash
npm install react-router-dom
```

### Step 2: Rename Current App

Rename `App.tsx` to `CRMApp.tsx`:

```bash
# In your terminal
mv App.tsx CRMApp.tsx
```

### Step 3: Create New Main App

Create new `App.tsx`:

```tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import CRMApp from './CRMApp';
import WorkApp from './WorkApp';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/crm/*" element={<CRMApp />} />
            <Route path="/work/*" element={<WorkApp />} />
            <Route path="/" element={<Navigate to="/crm" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
```

### Step 4: Update CRMApp.tsx

Remove the providers (they're now in App.tsx):

```tsx
// CRMApp.tsx
import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
// ... rest of your imports

const CRMApp: React.FC = () => {
  // Your existing AppContent code here
  // Remove AuthProvider and NotificationProvider wrappers
};

export default CRMApp;
```

### Step 5: Test It!

```bash
npm run dev
```

Navigate to:
- CRM: `http://localhost:5173/crm`
- Work: `http://localhost:5173/work`

---

## Option 2: Separate Ports (Development)

### Step 1: Update package.json

```json
{
  "scripts": {
    "dev": "vite",
    "dev:crm": "vite --port 5173",
    "dev:work": "vite --port 5174 --config vite.work.config.ts",
    "build": "tsc && vite build",
    "build:work": "tsc && vite build --config vite.work.config.ts"
  }
}
```

### Step 2: Create vite.work.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: './work-index.html'
      }
    }
  }
});
```

### Step 3: Run Both Apps

```bash
# Terminal 1
npm run dev:crm

# Terminal 2
npm run dev:work
```

Access:
- CRM: `http://localhost:5173`
- Work: `http://localhost:5174`

---

## Adding Navigation Between Apps

### In CRM Sidebar

Add link to Work Management:

```tsx
// In components/Sidebar.tsx
import { CheckSquare } from 'lucide-react';

// Add to your menu items
<a
  href="/work"
  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
>
  <CheckSquare className="w-5 h-5" />
  <span>Work Management</span>
</a>
```

### In Work Sidebar

Add link back to CRM:

```tsx
// In components/work/WorkSidebar.tsx
import { LayoutGrid } from 'lucide-react';

// Add to navigation
<a
  href="/crm"
  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
>
  <LayoutGrid className="w-5 h-5" />
  <span>Back to CRM</span>
</a>
```

---

## Initialize Sample Data

### Option A: Automatic on First Load

Add to `WorkApp.tsx`:

```tsx
import { initializeWorkData } from './utils/initializeWorkData';
import { useEffect } from 'react';

const WorkAppContent: React.FC = () => {
  useEffect(() => {
    // Initialize sample data if none exists
    const hasData = localStorage.getItem('work_projects');
    if (!hasData) {
      initializeWorkData();
    }
  }, []);

  // ... rest of component
};
```

### Option B: Manual Initialization

In browser console:

```javascript
import { initializeWorkData } from './utils/initializeWorkData';
initializeWorkData();
```

Or create a button in settings:

```tsx
import { initializeWorkData } from '../../utils/initializeWorkData';

<button
  onClick={() => {
    initializeWorkData();
    alert('Sample data created!');
  }}
  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
>
  Load Sample Data
</button>
```

---

## Verification Checklist

After implementation, verify:

- [ ] Can access CRM at `/crm`
- [ ] Can access Work at `/work`
- [ ] Login works in both apps
- [ ] Same user appears in both apps
- [ ] Can create projects in Work app
- [ ] Can create tasks in Work app
- [ ] Kanban board drag-and-drop works
- [ ] Time tracking works
- [ ] Data persists after refresh
- [ ] Can navigate between apps
- [ ] Logout works from both apps
- [ ] No console errors
- [ ] Responsive on mobile

---

## Common Issues & Solutions

### Issue: "Cannot find module 'react-router-dom'"

**Solution:**
```bash
npm install react-router-dom
```

### Issue: "Blank page when accessing /work"

**Solution:**
- Check WorkApp.tsx is imported correctly
- Verify all work components exist
- Check browser console for errors
- Ensure WorkProvider is wrapping the app

### Issue: "Authentication not working"

**Solution:**
- Ensure AuthProvider is in the main App.tsx
- Check localStorage for auth token
- Verify useAuth() is called inside AuthProvider

### Issue: "Styles not loading"

**Solution:**
- Ensure index.css is imported
- Check Tailwind configuration
- Verify all class names are correct

### Issue: "Data not persisting"

**Solution:**
- Check localStorage is enabled
- Verify different keys for work data
- Check browser storage quota
- Clear cache and try again

---

## Production Deployment

### Build Both Apps

```bash
# Build CRM
npm run build

# Build Work (if separate)
npm run build:work
```

### Deploy Options

#### Option 1: Single Domain with Routes
Deploy once, access via:
- `yourdomain.com/crm`
- `yourdomain.com/work`

#### Option 2: Separate Subdomains
Deploy separately:
- `crm.yourdomain.com`
- `work.yourdomain.com`

#### Option 3: Separate Domains
Deploy on different domains:
- `yourcrm.com`
- `yourwork.com`

---

## Performance Optimization

### Code Splitting

```tsx
import { lazy, Suspense } from 'react';

const WorkDashboard = lazy(() => import('./components/work/WorkDashboard'));
const KanbanBoard = lazy(() => import('./components/work/KanbanBoard'));

<Suspense fallback={<div>Loading...</div>}>
  <WorkDashboard />
</Suspense>
```

### Lazy Load Routes

```tsx
const CRMApp = lazy(() => import('./CRMApp'));
const WorkApp = lazy(() => import('./WorkApp'));

<Suspense fallback={<LoadingScreen />}>
  <Routes>
    <Route path="/crm/*" element={<CRMApp />} />
    <Route path="/work/*" element={<WorkApp />} />
  </Routes>
</Suspense>
```

---

## Customization Examples

### Change Work App Colors

```tsx
// In WorkSidebar.tsx
<div className="w-10 h-10 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg">
  <CheckSquare className="w-6 h-6 text-white" />
</div>
```

### Add Custom Page

```tsx
// 1. Create component
const ReportsView: React.FC = () => {
  return <div>Reports</div>;
};

// 2. Add to WorkApp.tsx
type WorkPage = 'dashboard' | 'kanban' | 'tasks' | 'projects' | 'time' | 'reports';

case 'reports':
  return <ReportsView />;

// 3. Add to WorkSidebar.tsx
{ id: 'reports', icon: BarChart, label: 'Reports' }
```

### Customize Header Stats

```tsx
// In WorkHeader.tsx
<div className="flex items-center gap-2">
  <span className="text-gray-500">Your Stat:</span>
  <span className="font-semibold text-gray-900">
    {yourValue}
  </span>
</div>
```

---

## Testing Guide

### Manual Testing

1. **Login Flow**
   - [ ] Can login from CRM
   - [ ] Can login from Work
   - [ ] Same user in both apps

2. **Navigation**
   - [ ] Can switch between apps
   - [ ] URLs update correctly
   - [ ] Back button works

3. **Work Features**
   - [ ] Create project
   - [ ] Create task
   - [ ] Edit task
   - [ ] Delete task
   - [ ] Drag task on Kanban
   - [ ] Log time
   - [ ] Add comment
   - [ ] Add subtask

4. **Data Persistence**
   - [ ] Refresh page - data remains
   - [ ] Close browser - data remains
   - [ ] Switch apps - data remains

### Automated Testing

```typescript
// Example test
describe('Work App', () => {
  it('should load work dashboard', () => {
    cy.visit('/work');
    cy.contains('Work Dashboard');
  });

  it('should create a task', () => {
    cy.visit('/work');
    cy.contains('New Task').click();
    cy.get('input[name="title"]').type('Test Task');
    cy.contains('Create Task').click();
    cy.contains('Test Task');
  });
});
```

---

## Next Steps

1. ✅ Choose implementation option
2. ✅ Follow setup steps
3. ✅ Test both apps
4. ✅ Initialize sample data
5. ✅ Customize branding
6. ✅ Add navigation links
7. ✅ Train your team
8. ✅ Deploy to production

---

## Support

If you encounter issues:

1. Check this guide
2. Review `WORK_SEPARATE_DASHBOARD.md`
3. Check browser console
4. Verify all files are created
5. Test with sample data

---

## Summary

You now have:
- ✅ Separate CRM dashboard
- ✅ Separate Work dashboard
- ✅ Shared authentication
- ✅ Independent navigation
- ✅ Same design system
- ✅ Production-ready code

**Your work management system is ready to use!** 🎉
