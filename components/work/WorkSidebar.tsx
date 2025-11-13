import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  IconLayoutDashboard,
  IconChevronLeft,
  IconSun,
  IconMoon
} from '../Icons';

type WorkPage = 'dashboard' | 'kanban' | 'tasks' | 'projects' | 'time' | 'chat' | 'settings';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, isCollapsed, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`
        w-full
        relative flex items-center gap-3 px-3 py-2.5 rounded-lg
        transition-all duration-200 group
        ${active 
          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium shadow-sm' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
        }
        ${isCollapsed ? 'justify-center' : ''}
      `}
      title={isCollapsed ? label : undefined}
      aria-label={label}
      type="button"
    >
      {/* Active indicator */}
      <div 
        className={`
          absolute left-0 rounded-r-md
          top-2 bottom-2 w-1 bg-blue-600
          transition-all duration-200
          ${active ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 group-hover:opacity-100 group-hover:scale-y-100'}
        `}
      />
      
      {/* Icon */}
      <Icon 
        className={`
          w-5 h-5 flex-shrink-0 transition-all duration-200
          ${active 
            ? 'text-blue-600 dark:text-blue-400' 
            : 'text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-110'
          }
        `}
      />
      
      {/* Label */}
      {!isCollapsed && (
        <span className="text-sm truncate">
          {label}
        </span>
      )}
    </button>
  );
};

interface WorkSidebarProps {
  onNavigate: (page: WorkPage) => void;
  currentPage: WorkPage;
}

const WorkSidebar: React.FC<WorkSidebarProps> = ({ onNavigate, currentPage }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useAuth();

  // Import lucide-react icons
  const Kanban = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="3"></rect></svg>
  );
  
  const List = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
  );
  
  const Folder = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
  );
  
  const Clock = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
  );

  const MessageCircle = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
  );

  const navSections = [
    {
      title: 'Work Management',
      items: [
        { key: 'Dashboard', icon: IconLayoutDashboard, page: 'dashboard' as const },
        { key: 'Kanban Board', icon: Kanban, page: 'kanban' as const },
        { key: 'Task List', icon: List, page: 'tasks' as const },
        { key: 'Projects', icon: Folder, page: 'projects' as const },
        { key: 'Time Tracking', icon: Clock, page: 'time' as const },
      ]
    },
    {
      title: 'Communication',
      items: [
        { key: 'Chat & Messaging', icon: MessageCircle, page: 'chat' as const },
      ]
    }
  ];

  return (
    <aside className={`
      bg-white dark:bg-gray-800 
      flex flex-col 
      border-r dark:border-gray-700/50
      shadow-sm
      transition-all duration-300 ease-in-out 
      h-screen sticky top-0
      ${isCollapsed ? 'w-20' : 'w-64'}
    `}>
      {/* Header */}
      <div className={`
        border-b dark:border-gray-700/50 
        p-4 
        flex items-center 
        ${isCollapsed ? 'justify-center' : 'justify-between'}
        min-h-[72px]
      `}>
        {isCollapsed ? (
          <div className="flex-shrink-0">
            <img 
              src="/imgs/logo.png" 
              alt="Work Management Logo" 
              className="w-8 h-8 object-contain"
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 overflow-hidden transition-all duration-300 w-full">
            <div className="flex-shrink-0">
              <img 
                src="/imgs/logo.png" 
                alt="Work Management Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <span className="font-bold text-lg text-gray-800 dark:text-gray-100 whitespace-nowrap">Work Management</span>
          </div>
        )}
        
        {/* Collapse Toggle */}
        {!isCollapsed && (
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className="
              p-2 rounded-lg 
              hover:bg-gray-100 dark:hover:bg-gray-700 
              transition-all duration-200
              hover:scale-110
              active:scale-95
              flex-shrink-0
            "
            aria-label="Collapse sidebar"
            type="button"
          >
            <IconChevronLeft className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        )}
      </div>
      
      {/* Expand button when collapsed */}
      {isCollapsed && (
        <div className="p-2 flex justify-center border-b dark:border-gray-700/50">
          <button 
            onClick={() => setIsCollapsed(false)} 
            className="
              p-2 rounded-lg 
              hover:bg-gray-100 dark:hover:bg-gray-700 
              transition-all duration-200
              hover:scale-110
              active:scale-95
            "
            aria-label="Expand sidebar"
            type="button"
          >
            <IconChevronLeft className="w-4 h-4 text-gray-500 dark:text-gray-400 rotate-180" />
          </button>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-grow overflow-y-auto overflow-x-hidden p-3 space-y-6 scrollbar-hide">
        {/* Navigation Sections */}
        {navSections.map((section, index) => (
          <nav key={section.title} className="space-y-1">
            {/* Section Header */}
            {!isCollapsed && (
              <div className="flex items-center gap-2 px-3 py-2">
                <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex-1">
                  {section.title}
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-200 dark:from-gray-700 to-transparent"></div>
              </div>
            )}
            
            {/* Section Divider for collapsed state */}
            {isCollapsed && index > 0 && (
              <div className="px-3 py-2">
                <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
              </div>
            )}
            
            {/* Navigation Items */}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.key}>
                  <NavItem 
                    icon={item.icon} 
                    label={item.key} 
                    active={currentPage === item.page}
                    isCollapsed={isCollapsed}
                    onClick={() => onNavigate(item.page)}
                  />
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Footer - Theme Toggle */}
      <div className={`
        p-4 border-t dark:border-gray-700/50 
        bg-gray-50/50 dark:bg-gray-900/20
        ${isCollapsed ? 'flex justify-center' : ''}
      `}>
        <div className={`
          flex items-center p-1.5 
          bg-gray-100 dark:bg-gray-800 
          rounded-xl 
          ${isCollapsed ? 'flex-col gap-2' : 'gap-1'}
        `}>
          <button 
            onClick={() => theme === 'dark' && toggleTheme()}
            className={`
              flex items-center justify-center gap-2 
              px-3 py-2 rounded-lg 
              text-sm font-medium 
              transition-all duration-200
              hover:scale-105 active:scale-95
              ${theme === 'light' 
                ? 'bg-white dark:bg-gray-700 shadow-md text-gray-900 dark:text-gray-100' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }
              ${isCollapsed ? 'w-10 h-10' : 'flex-1'}
            `}
            aria-label="Light mode"
            title="Light mode"
            type="button"
          >
            <IconSun className={`w-4 h-4 ${theme === 'light' ? 'text-yellow-500' : ''} transition-colors`}/>
            {!isCollapsed && <span>Light</span>}
          </button>
          <button 
            onClick={() => theme === 'light' && toggleTheme()}
            className={`
              flex items-center justify-center gap-2 
              px-3 py-2 rounded-lg 
              text-sm font-medium 
              transition-all duration-200
              hover:scale-105 active:scale-95
              ${theme === 'dark' 
                ? 'bg-white dark:bg-gray-700 shadow-md text-gray-900 dark:text-gray-100' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }
              ${isCollapsed ? 'w-10 h-10' : 'flex-1'}
            `}
            aria-label="Dark mode"
            title="Dark mode"
            type="button"
          >
            <IconMoon className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-400' : ''} transition-colors`}/>
            {!isCollapsed && <span>Dark</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default WorkSidebar;
