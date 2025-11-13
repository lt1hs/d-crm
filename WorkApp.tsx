import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { WorkProvider } from './context/WorkContext';
import WorkSidebar from './components/work/WorkSidebar';
import WorkHeader from './components/work/WorkHeader';
import { WorkDashboard } from './components/work/WorkDashboard';
import { KanbanBoard } from './components/work/KanbanBoard';
import { TaskList } from './components/work/TaskList';
import { ProjectManagement } from './components/work/ProjectManagement';
import { TimeTracking } from './components/work/TimeTracking';
import LoginPage from './components/admin/LoginPage';
import ChatPanel from './components/chat/ChatPanel';
import ChatManagement from './components/chat/ChatManagement';

type WorkPage = 'dashboard' | 'kanban' | 'tasks' | 'projects' | 'time' | 'chat' | 'settings';

const WorkAppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState<WorkPage>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);

  if (!currentUser && !isLoggedIn) {
    return <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  const handleNavigate = (page: WorkPage) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'kanban':
        return <KanbanBoard />;
      case 'tasks':
        return <TaskList />;
      case 'projects':
        return <ProjectManagement />;
      case 'time':
        return <TimeTracking />;
      case 'chat':
        return <ChatManagement />;
      case 'dashboard':
      default:
        return <WorkDashboard />;
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen flex transition-colors">
      <WorkSidebar onNavigate={handleNavigate} currentPage={currentPage} />
      <main className="flex-1 transition-all duration-300">
        <div className="flex flex-col h-screen">
          <WorkHeader onNavigate={handleNavigate} currentPage={currentPage} />
          <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {renderPage()}
          </div>
        </div>
      </main>
      <ChatPanel isExpanded={isChatExpanded} onToggle={() => setIsChatExpanded(!isChatExpanded)} />
    </div>
  );
};

const WorkApp: React.FC = () => {
  return (
    <WorkProvider>
      <WorkAppContent />
    </WorkProvider>
  );
};

export default WorkApp;
