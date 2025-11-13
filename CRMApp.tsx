
import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
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

type Page = 'dashboard' | 'menu' | 'slider' | 'books' | 'news' | 'activities' | 'magazine' | 'articles' | 'courses' | 'publications' | 'infographics' | 'videos' | 'testimonials' | 'users' | 'logs' | 'settings' | 'calendar' | 'chat';

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

const CRMApp: React.FC = () => {
  return <AppContent />;
};

export default CRMApp;
