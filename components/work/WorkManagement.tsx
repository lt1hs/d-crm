import React, { useState } from 'react';
import { WorkDashboard } from './WorkDashboard';
import { KanbanBoard } from './KanbanBoard';
import { TaskList } from './TaskList';
import { ProjectManagement } from './ProjectManagement';
import { TimeTracking } from './TimeTracking';
import { LayoutDashboard, Kanban, List, Folder, Clock } from 'lucide-react';

type View = 'dashboard' | 'kanban' | 'list' | 'projects' | 'time';

export const WorkManagement: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const tabs = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'kanban' as View, label: 'Kanban', icon: Kanban },
    { id: 'list' as View, label: 'Task List', icon: List },
    { id: 'projects' as View, label: 'Projects', icon: Folder },
    { id: 'time' as View, label: 'Time Tracking', icon: Clock }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  currentView === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-6">
        {currentView === 'dashboard' && <WorkDashboard />}
        {currentView === 'kanban' && <KanbanBoard />}
        {currentView === 'list' && <TaskList />}
        {currentView === 'projects' && <ProjectManagement />}
        {currentView === 'time' && <TimeTracking />}
      </div>
    </div>
  );
};
