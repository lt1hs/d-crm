# Work Management System - Integration Example

## How to Add Work Management to Your Existing CRM

### Step 1: Update App.tsx

Add the WorkProvider and import the WorkManagement component:

```tsx
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { EnhancedChatProvider } from './context/EnhancedChatContext';
import { WorkProvider } from './context/WorkContext'; // ADD THIS
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
// ... your existing imports
import { WorkManagement } from './components/work/WorkManagement'; // ADD THIS

// Update the Page type to include 'work'
type Page = 'dashboard' | 'menu' | 'slider' | 'books' | 'news' | 'activities' | 
  'magazine' | 'articles' | 'courses' | 'publications' | 'infographics' | 'videos' | 
  'testimonials' | 'users' | 'logs' | 'settings' | 'calendar' | 'chat' | 'work'; // ADD 'work'

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);

  if (!currentUser && !isLoggedIn) {
    return <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      // ... your existing cases
      case 'work': // ADD THIS CASE
        return <WorkManagement />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen flex transition-colors">
      <Sidebar onNavigate={handleNavigate} currentPage={currentPage} />
      <main className="flex-1 transition-all duration-300">
        <div className="flex flex-col h-full">
          <Header onNavigate={handleNavigate} />
          <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {renderPage()}
          </div>
        </div>
      </main>
      <ChatPanel isExpanded={isChatExpanded} onToggle={() => setIsChatExpanded(!isChatExpanded)} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <EnhancedChatProvider>
          <WorkProvider> {/* ADD THIS WRAPPER */}
            <AppContent />
          </WorkProvider>
        </EnhancedChatProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
```

### Step 2: Update Sidebar.tsx

Add the Work Management menu item to your sidebar:

```tsx
import { CheckSquare } from 'lucide-react'; // ADD THIS IMPORT

// In your menu items array, add:
{
  icon: CheckSquare,
  label: 'Work Management',
  page: 'work' as const,
  permission: 'view_work' // Optional: add permission check
}

// Or if you have a different structure:
<button
  onClick={() => onNavigate('work')}
  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
    currentPage === 'work'
      ? 'bg-blue-600 text-white'
      : 'text-gray-700 hover:bg-gray-100'
  }`}
>
  <CheckSquare className="w-5 h-5" />
  <span>Work Management</span>
</button>
```

### Step 3: Update Types (Optional)

If you have a centralized types file, add work management types:

```tsx
// In your types.ts or similar file
export type AppPage = 
  | 'dashboard' 
  | 'menu' 
  | 'slider' 
  // ... other pages
  | 'work'; // ADD THIS
```

### Step 4: Add Permissions (Optional)

If you use role-based permissions, add work management permissions:

```tsx
// In data/rolePermissions.ts or similar
export const rolePermissions = {
  admin: [
    // ... existing permissions
    'view_work',
    'create_tasks',
    'edit_tasks',
    'delete_tasks',
    'create_projects',
    'edit_projects',
    'delete_projects',
    'view_time_tracking',
    'log_time'
  ],
  editor: [
    // ... existing permissions
    'view_work',
    'create_tasks',
    'edit_tasks',
    'view_time_tracking',
    'log_time'
  ],
  viewer: [
    // ... existing permissions
    'view_work',
    'view_time_tracking'
  ]
};
```

### Step 5: Add to Dashboard (Optional)

You can add work management widgets to your main dashboard:

```tsx
// In components/Dashboard.tsx
import { useWork } from '../context/WorkContext';
import { CheckSquare, Clock, AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { stats } = useWork();
  
  return (
    <div>
      {/* Your existing dashboard content */}
      
      {/* Add Work Management Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckSquare className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">My Tasks</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalTasks}</p>
          <p className="text-sm text-gray-500 mt-1">
            {stats.completedTasks} completed
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Hours Logged</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stats.totalHoursLogged.toFixed(1)}
          </p>
          <p className="text-sm text-gray-500 mt-1">This month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-gray-900">Overdue</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.overdueTasks}</p>
          <p className="text-sm text-gray-500 mt-1">Need attention</p>
        </div>
      </div>
    </div>
  );
};
```

### Step 6: Add Quick Access (Optional)

Add a quick access button in your Header:

```tsx
// In components/Header.tsx
import { CheckSquare } from 'lucide-react';

<button
  onClick={() => onNavigate('work')}
  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
  title="Work Management"
>
  <CheckSquare className="w-5 h-5" />
</button>
```

## Complete Integration Code

Here's the complete updated App.tsx:

```tsx
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { EnhancedChatProvider } from './context/EnhancedChatContext';
import { WorkProvider } from './context/WorkContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MenuManagement from './components/menu/MenuManagement';
import SliderManagement from './components/slider/SliderManagement';
import BooksManagement from './components/books/BooksManagement';
import NewsManagement from './components/news/NewsManagement';
import ActivitiesManagement from './components/activities/ActivitiesManagement';
import MagazineManagement from './components/magazine/MagazineManagement';
import { ArticlesManagement } from './components/articles/ArticlesManagement';
import CoursesManagement from './components/courses/CoursesManagement';
import PublicationsManagement from './components/publications/PublicationsManagement';
import InfographicsManagement from './components/infographics/InfographicsManagement';
import VideosManagement from './components/videos/VideosManagement';
import TestimonialsManagement from './components/testimonials/TestimonialsManagement';
import UserManagement from './components/admin/UserManagement';
import ActivityLogs from './components/admin/ActivityLogs';
import LoginPage from './components/admin/LoginPage';
import UserSettings from './components/admin/UserSettings';
import CalendarManagement from './components/CalendarManagement';
import ChatPanel from './components/chat/ChatPanel';
import ChatManagement from './components/chat/ChatManagement';
import { WorkManagement } from './components/work/WorkManagement';

type Page = 'dashboard' | 'menu' | 'slider' | 'books' | 'news' | 'activities' | 
  'magazine' | 'articles' | 'courses' | 'publications' | 'infographics' | 'videos' | 
  'testimonials' | 'users' | 'logs' | 'settings' | 'calendar' | 'chat' | 'work';

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);

  if (!currentUser && !isLoggedIn) {
    return <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'menu':
        return <MenuManagement />;
      case 'slider':
        return <SliderManagement />;
      case 'books':
        return <BooksManagement />;
      case 'news':
        return <NewsManagement />;
      case 'activities':
        return <ActivitiesManagement />;
      case 'magazine':
        return <MagazineManagement />;
      case 'articles':
        return <ArticlesManagement />;
      case 'courses':
        return <CoursesManagement />;
      case 'publications':
        return <PublicationsManagement />;
      case 'infographics':
        return <InfographicsManagement />;
      case 'videos':
        return <VideosManagement />;
      case 'testimonials':
        return <TestimonialsManagement />;
      case 'users':
        return <UserManagement />;
      case 'logs':
        return <ActivityLogs />;
      case 'settings':
        return <UserSettings />;
      case 'calendar':
        return <CalendarManagement />;
      case 'chat':
        return <ChatManagement />;
      case 'work':
        return <WorkManagement />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen flex transition-colors">
      <Sidebar onNavigate={handleNavigate} currentPage={currentPage} />
      <main className="flex-1 transition-all duration-300">
        <div className="flex flex-col h-full">
          <Header onNavigate={handleNavigate} />
          <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {renderPage()}
          </div>
        </div>
      </main>
      <ChatPanel isExpanded={isChatExpanded} onToggle={() => setIsChatExpanded(!isChatExpanded)} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <EnhancedChatProvider>
          <WorkProvider>
            <AppContent />
          </WorkProvider>
        </EnhancedChatProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
```

## Testing the Integration

1. **Start your app**: `npm run dev`
2. **Login** with your existing credentials
3. **Navigate** to Work Management from the sidebar
4. **Create a project** to get started
5. **Add tasks** and start managing work!

## Verification Checklist

- [ ] WorkProvider is wrapped around AppContent
- [ ] WorkManagement component is imported
- [ ] 'work' is added to Page type
- [ ] Work case is added to renderPage switch
- [ ] Sidebar has Work Management menu item
- [ ] No TypeScript errors
- [ ] App compiles successfully
- [ ] Can navigate to Work Management
- [ ] Can create projects and tasks
- [ ] Data persists in localStorage

## Troubleshooting

### "Cannot find module './context/WorkContext'"
- Ensure WorkContext.tsx is in the context folder
- Check the import path is correct

### "Type 'work' is not assignable to type Page"
- Make sure you added 'work' to the Page type definition

### Work Management page is blank
- Check browser console for errors
- Verify all work components are in components/work folder
- Ensure WorkProvider is wrapping the app

### Tasks not saving
- Check localStorage is enabled in browser
- Open DevTools > Application > Local Storage
- Look for work_tasks, work_projects, work_time_entries

## Next Steps

1. ✅ Complete the integration
2. ✅ Test all features
3. ✅ Create sample data
4. ✅ Train your team
5. ✅ Customize as needed

Enjoy your new work management system! 🎉
