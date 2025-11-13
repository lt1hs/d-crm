
import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { TranslationKey } from '../types';
import {
  IconLayoutDashboard, IconBook, IconNews, IconVideo, IconSliders, IconActivity,
  IconMagazine, IconArticle, IconGraduationCap, IconFileText, IconBarChart,
  IconQuote, IconHandshake, IconMenu, IconInfo, IconChevronLeft,
  IconSun, IconMoon, IconUsers, IconClipboardList, IconCalendar, IconMessageCircle,
  IconCheckSquare
} from './Icons';

interface NavItemProps {
    icon: React.ElementType;
    label: string;
    active?: boolean;
    isCollapsed?: boolean;
    onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, isCollapsed, onClick }) => {
    const { dir } = useTranslation();
    
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
                    absolute ${dir === 'rtl' ? 'right-0 rounded-l-md' : 'left-0 rounded-r-md'}
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


interface SidebarProps {
    onNavigate: (page: 'dashboard' | 'menu' | 'slider' | 'books' | 'news' | 'activities' | 'magazine' | 'articles' | 'courses' | 'publications' | 'infographics' | 'videos' | 'testimonials' | 'users' | 'logs' | 'chat' | 'calendar') => void;
    currentPage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentPage }) => {
    const { t, dir } = useTranslation();
    const { theme, toggleTheme } = useTheme();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { hasPermission } = useAuth();

    const navSections = [
        {
            title: 'Main',
            items: [
                { key: 'sidebar.dashboard', icon: IconLayoutDashboard, page: 'dashboard' as const },
                { key: 'Work Management', icon: IconCheckSquare, page: null, isExternal: true, href: '/work' },
                { key: 'sidebar.calendar', icon: IconCalendar, page: 'calendar' as const },
                { key: 'sidebar.chat', icon: IconMessageCircle, page: 'chat' as const },
                { key: 'sidebar.menu', icon: IconMenu, page: 'menu' as const },
                { key: 'sidebar.slider', icon: IconSliders, page: 'slider' as const },
            ]
        },
        {
            title: 'Content',
            items: [
                { key: 'sidebar.books', icon: IconBook, page: 'books' as const },
                { key: 'sidebar.news', icon: IconNews, page: 'news' as const },
                { key: 'sidebar.activities', icon: IconActivity, page: 'activities' as const },
                { key: 'sidebar.magazine', icon: IconMagazine, page: 'magazine' as const },
                { key: 'sidebar.articles', icon: IconArticle, page: 'articles' as const },
                { key: 'sidebar.courses', icon: IconGraduationCap, page: 'courses' as const },
                { key: 'sidebar.publications', icon: IconFileText, page: 'publications' as const },
            ]
        },
        {
            title: 'Media',
            items: [
                { key: 'sidebar.infographics', icon: IconBarChart, page: 'infographics' as const },
                { key: 'sidebar.videos', icon: IconVideo, page: 'videos' as const },
                { key: 'sidebar.testimonials', icon: IconQuote, page: 'testimonials' as const },
            ]
        },
        {
            title: 'Site',
            items: [
                { key: 'sidebar.partners', icon: IconHandshake, page: 'partners' as const },
                { key: 'sidebar.footer', icon: IconMenu, page: 'footer' as const },
                { key: 'sidebar.about', icon: IconInfo, page: 'about' as const },
            ]
        },
        {
            title: 'Admin',
            items: [
                { key: 'sidebar.users', icon: IconUsers, page: 'users' as const, permission: 'users' },
                { key: 'sidebar.logs', icon: IconClipboardList, page: 'logs' as const, permission: 'logs' },
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
                            alt="AL-DALEEL-CRM Logo" 
                            className="w-8 h-8 object-contain"
                        />
                    </div>
                ) : (
                    <div className="flex items-center gap-3 overflow-hidden transition-all duration-300 w-full">
                        <div className="flex-shrink-0">
                            <img 
                                src="/imgs/logo.png" 
                                alt="AL-DALEEL-CRM Logo" 
                                className="w-8 h-8 object-contain"
                            />
                        </div>
                        <span className="font-bold text-lg text-gray-800 dark:text-gray-100 whitespace-nowrap">AL-DALEEL-CRM</span>
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
                    >
                        {dir === 'ltr' 
                            ? <IconChevronLeft className="w-4 h-4 text-gray-500 dark:text-gray-400" /> 
                            : <IconChevronLeft className="w-4 h-4 text-gray-500 dark:text-gray-400 rotate-180" />
                        }
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
                    >
                        {dir === 'ltr' 
                            ? <IconChevronLeft className="w-4 h-4 text-gray-500 dark:text-gray-400 rotate-180" /> 
                            : <IconChevronLeft className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        }
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
                                    {t(section.title as TranslationKey)}
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
                            {section.items.map((item: any) => {
                                // Check permission if required
                                if (item.permission && !hasPermission(item.permission, 'read')) {
                                    return null;
                                }
                                
                                // Handle external links
                                if (item.isExternal && item.href) {
                                    return (
                                        <li key={item.key}>
                                            <a 
                                                href={item.href}
                                                className={`
                                                    w-full
                                                    relative flex items-center gap-3 px-3 py-2.5 rounded-lg
                                                    transition-all duration-200 group
                                                    text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200
                                                    ${isCollapsed ? 'justify-center' : ''}
                                                `}
                                                title={isCollapsed ? item.key : undefined}
                                                aria-label={item.key}
                                            >
                                                <item.icon className="w-5 h-5 flex-shrink-0 transition-all duration-200 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-110" />
                                                {!isCollapsed && (
                                                    <span className="text-sm truncate">
                                                        {item.key}
                                                    </span>
                                                )}
                                            </a>
                                        </li>
                                    );
                                }
                                
                                return (
                                    <li key={item.key}>
                                        <NavItem 
                                            icon={item.icon} 
                                            label={t(item.key as TranslationKey)} 
                                            active={currentPage === item.page}
                                            isCollapsed={isCollapsed}
                                            onClick={() => item.page && onNavigate(item.page as any)}
                                        />
                                    </li>
                                );
                            })}
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
                            {!isCollapsed && <span>{t('sidebar.light')}</span>}
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
                            {!isCollapsed && <span>{t('sidebar.dark')}</span>}
                        </button>
                    </div>
                </div>
        </aside>
    );
};

export default Sidebar;
