
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../context/AuthContext';
import { IconSearch, IconHelpCircle, IconCalendar, IconCommand, IconLanguage, IconChevronDown, IconUsers, IconSettings, IconLogOut, IconClipboardList } from './Icons';
import { getRoleLabel } from '../utils/permissionHelpers';
import NotificationCenterNew from './notifications/NotificationCenterNew';

interface HeaderProps {
    onNavigate?: (page: 'dashboard' | 'menu' | 'slider' | 'books' | 'news' | 'activities' | 'magazine' | 'articles' | 'courses' | 'publications' | 'infographics' | 'videos' | 'testimonials' | 'users' | 'logs' | 'settings') => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
    const { t, language, setLanguage } = useTranslation();
    const { currentUser, logout, hasPermission } = useAuth();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value as 'en' | 'ar' | 'fa');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
    };

    return (
        <header className="flex-shrink-0 bg-white/95 dark:bg-gray-900/95 border-b border-gray-200/60 dark:border-gray-700/60 px-6 backdrop-blur-md sticky top-0 z-50 shadow-sm">
            <div className="flex items-center justify-between h-14">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-lg">
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder={t('header.searchPlaceholder')}
                        className="w-full h-9 pl-10 pr-16 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50/80 dark:bg-gray-800/80 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 rounded border">
                        <IconCommand className="w-3 h-3"/>
                        <span>K</span>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-1 ml-4">
                    {/* Language Selector */}
                    <div className="relative hidden sm:block">
                        <select
                            value={language}
                            onChange={handleLanguageChange}
                            aria-label="Select language"
                            className="appearance-none h-8 pl-3 pr-8 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                        >
                            <option value="en">EN</option>
                            <option value="ar">AR</option>
                            <option value="fa">FA</option>
                        </select>
                        <IconLanguage className="w-3 h-3 text-gray-400 absolute top-1/2 -translate-y-1/2 right-2 pointer-events-none" />
                    </div>

                    {/* Notification Center */}
                    <NotificationCenterNew />

                    {/* Help Button */}
                    <button 
                        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group hidden md:block" 
                        aria-label="Help"
                    >
                        <IconHelpCircle className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors"/>
                    </button>

                    {/* Calendar Button */}
                    <button 
                        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group hidden lg:block" 
                        aria-label="Calendar"
                    >
                        <IconCalendar className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors"/>
                    </button>

                    {/* User Profile with Dropdown */}
                    <div className="relative ml-2" ref={userMenuRef}>
                        <button 
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                            type="button"
                        >
                            <div className="relative">
                                {currentUser?.avatar ? (
                                    <img 
                                        src={currentUser.avatar} 
                                        alt={currentUser.fullName} 
                                        className="w-7 h-7 rounded-full ring-1 ring-gray-200 dark:ring-gray-700 object-cover" 
                                    />
                                ) : (
                                    <div className="w-7 h-7 rounded-full ring-1 ring-gray-200 dark:ring-gray-700 bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                                        {currentUser?.fullName?.charAt(0) || 'U'}
                                    </div>
                                )}
                                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border border-white dark:border-gray-900 rounded-full"></div>
                            </div>
                            <div className="text-left hidden xl:block">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-none">
                                    {currentUser?.fullName || 'User'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {currentUser ? getRoleLabel(currentUser.role) : 'Guest'}
                                </p>
                            </div>
                            <IconChevronDown className={`w-3 h-3 text-gray-400 hidden xl:block transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isUserMenuOpen && currentUser && (
                            <div className="absolute right-0 mt-1 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                                {/* User Info */}
                                <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {currentUser.fullName}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {currentUser.email}
                                    </p>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 mt-1">
                                        {getRoleLabel(currentUser.role)}
                                    </span>
                                </div>

                                {/* Menu Items */}
                                <div className="py-1">
                                    {hasPermission('users', 'read') && (
                                        <button
                                            onClick={() => {
                                                setIsUserMenuOpen(false);
                                                onNavigate?.('users');
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                            type="button"
                                        >
                                            <IconUsers className="w-4 h-4" />
                                            <span>User Management</span>
                                        </button>
                                    )}

                                    {hasPermission('logs', 'read') && (
                                        <button
                                            onClick={() => {
                                                setIsUserMenuOpen(false);
                                                onNavigate?.('logs');
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                            type="button"
                                        >
                                            <IconClipboardList className="w-4 h-4" />
                                            <span>Activity Logs</span>
                                        </button>
                                    )}

                                    <button
                                        onClick={() => {
                                            setIsUserMenuOpen(false);
                                            onNavigate?.('settings');
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        type="button"
                                    >
                                        <IconSettings className="w-4 h-4" />
                                        <span>Settings</span>
                                    </button>
                                </div>

                                {/* Logout */}
                                <div className="border-t border-gray-100 dark:border-gray-800 pt-1">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        type="button"
                                    >
                                        <IconLogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
