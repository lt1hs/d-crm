import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';
import WorkProfileSettings from './settings/WorkProfileSettings';
import WorkSecuritySettings from './settings/WorkSecuritySettings';
import WorkPreferencesSettings from './settings/WorkPreferencesSettings';
import WorkNotificationSettings from './settings/WorkNotificationSettings';
import { IconUsers, IconShield, IconSettings, IconBell } from '../Icons';

type SettingsTab = 'profile' | 'security' | 'preferences' | 'notifications';

const WorkUserSettings: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const tabs = [
    { id: 'profile' as SettingsTab, label: 'Profile', icon: IconUsers },
    { id: 'security' as SettingsTab, label: 'Security', icon: IconShield },
    { id: 'preferences' as SettingsTab, label: 'Preferences', icon: IconSettings },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: IconBell },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <WorkProfileSettings />;
      case 'security':
        return <WorkSecuritySettings />;
      case 'preferences':
        return <WorkPreferencesSettings />;
      case 'notifications':
        return <WorkNotificationSettings />;
      default:
        return <WorkProfileSettings />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300'
                    }
                  `}
                  type="button"
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default WorkUserSettings;
