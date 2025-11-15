
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
        <header className="flex-shrink-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700/50 px-4 sm:px-6 lg:px-8 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 sticky top-0 z-40">
            <div className="flex items-center justify-between" style={{ height: '71px' }}>
                {/* Search Bar */}
                <div className="relative flex-1 max-w-2xl">
                    <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                        type="text"
                        placeholder={t('header.searchPlaceholder')}
                        className="w-full h-12 pl-12 pr-20 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                        <IconCommand className="w-3.5 h-3.5"/>
                        <span>K</span>
                    </div>
                </div>
                {/* Right Section */}
                <div className="flex items-center gap-2 ml-6">
                    {/* Language Selector */}
                    <div className="relative hidden sm:block">
                        <select
                            value={language}
                            onChange={handleLanguageChange}
                            aria-label="Select language"
                            className="appearance-none h-10 pl-4 pr-10 bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 cursor-pointer font-medium text-sm transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                        >
                            <option value="en">English</option>
                            <option value="ar">العربية</option>
                            <option value="fa">فارسی</option>
                        </select>
                        <IconLanguage className="w-4 h-4 text-gray-500 dark:text-gray-400 absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none" />
                    </div>

                    {/* Notification Center */}
                    <NotificationCenterNew />

                    {/* Help Button */}
                    <button 
                        className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group hidden md:block" 
                        aria-label="Help"
                    >
                        <IconHelpCircle className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors"/>
                    </button>

                    {/* Calendar Button */}
                    <button 
                        className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group hidden lg:block" 
                        aria-label="Calendar"
                    >
                        <IconCalendar className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors"/>
                    </button>

                    {/* User Profile with Dropdown */}
                    <div className="relative" ref={userMenuRef}>
                        <button 
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-3 pl-3 pr-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group ml-2"
                            type="button"
                        >
                            <div className="relative">
                                {currentUser?.avatar ? (
                                    <img 
                                        src={currentUser.avatar} 
                                        alt={currentUser.fullName} 
                                        className="w-10 h-10 rounded-xl ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-600 transition-all object-cover" 
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-xl ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-600 transition-all bg-blue-500 flex items-center justify-center text-white font-semibold">
                                        {currentUser?.fullName?.charAt(0) || 'U'}
                                    </div>
                                )}
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                            </div>
                            <div className="text-left hidden xl:block">
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                    {currentUser?.fullName || 'User'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {currentUser ? getRoleLabel(currentUser.role) : 'Guest'}
                                </p>
                            </div>
                            <IconChevronDown className={`w-4 h-4 text-gray-400 hidden xl:block transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isUserMenuOpen && currentUser && (
                            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                                {/* User Info */}
                                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                        {currentUser.fullName}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {currentUser.email}
                                    </p>
                                    <div className="mt-2">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                            {getRoleLabel(currentUser.role)}
                                        </span>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <div className="py-2">
                                    {hasPermission('users', 'read') && (
                                        <button
                                            onClick={() => {
                                                setIsUserMenuOpen(false);
                                                onNavigate?.('users');
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        type="button"
                                    >
                                        <IconSettings className="w-4 h-4" />
                                        <span>Settings</span>
                                    </button>
                                </div>

                                {/* Logout */}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
