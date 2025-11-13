import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useTranslation } from '../../../hooks/useTranslation';
import { useAuth } from '../../../context/AuthContext';
import { IconSun, IconMoon, IconLanguage, IconCheck } from '../../Icons';

const PreferencesSettings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useTranslation();
  const { logActivity } = useAuth();
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    autoSave: true,
    compactView: false,
  });

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    if (theme !== newTheme) {
      toggleTheme();
      logActivity('update', 'preferences', undefined, `Changed theme to ${newTheme}`);
    }
  };

  const handleLanguageChange = (newLanguage: 'en' | 'ar' | 'fa') => {
    setLanguage(newLanguage);
    logActivity('update', 'preferences', undefined, `Changed language to ${newLanguage}`);
  };

  const handlePreferenceToggle = (key: keyof typeof preferences) => {
    setPreferences({ ...preferences, [key]: !preferences[key] });
    logActivity('update', 'preferences', undefined, `Toggled ${key}`);
  };

  return (
    <div className="space-y-8">
      {/* Appearance */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Appearance</h3>
        
        {/* Theme Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">Theme</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleThemeChange('light')}
              className={`
                relative p-4 border-2 rounded-lg transition-all
                ${theme === 'light'
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }
              `}
              type="button"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-white border-2 border-gray-200 flex items-center justify-center">
                  <IconSun className="w-6 h-6 text-yellow-500" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Light</div>
                  <div className="text-xs text-gray-500">Bright and clear</div>
                </div>
              </div>
              {theme === 'light' && (
                <div className="absolute top-3 right-3">
                  <IconCheck className="w-5 h-5 text-blue-600" />
                </div>
              )}
            </button>

            <button
              onClick={() => handleThemeChange('dark')}
              className={`
                relative p-4 border-2 rounded-lg transition-all
                ${theme === 'dark'
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }
              `}
              type="button"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gray-800 border-2 border-gray-700 flex items-center justify-center">
                  <IconMoon className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Dark</div>
                  <div className="text-xs text-gray-500">Easy on the eyes</div>
                </div>
              </div>
              {theme === 'dark' && (
                <div className="absolute top-3 right-3">
                  <IconCheck className="w-5 h-5 text-blue-600" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Language Selection */}
        <div>
          <label className="block text-sm font-medium mb-3">Language</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { code: 'en' as const, name: 'English', flag: '🇺🇸' },
              { code: 'ar' as const, name: 'العربية', flag: '🇸🇦' },
              { code: 'fa' as const, name: 'فارسی', flag: '🇮🇷' },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`
                  relative p-4 border-2 rounded-lg transition-all
                  ${language === lang.code
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }
                `}
                type="button"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{lang.flag}</span>
                  <div className="text-left">
                    <div className="font-medium">{lang.name}</div>
                  </div>
                </div>
                {language === lang.code && (
                  <div className="absolute top-3 right-3">
                    <IconCheck className="w-5 h-5 text-blue-600" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* General Preferences */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
        <h3 className="text-lg font-semibold mb-4">General Preferences</h3>
        <div className="space-y-4">
          {/* Auto Save */}
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium">Auto Save</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automatically save your work as you type
              </p>
            </div>
            <button
              onClick={() => handlePreferenceToggle('autoSave')}
              className={`
                relative w-12 h-6 rounded-full transition-colors
                ${preferences.autoSave ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}
              `}
              type="button"
            >
              <div
                className={`
                  absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform
                  ${preferences.autoSave ? 'translate-x-6' : 'translate-x-0.5'}
                `}
              />
            </button>
          </div>

          {/* Compact View */}
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium">Compact View</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Show more content with reduced spacing
              </p>
            </div>
            <button
              onClick={() => handlePreferenceToggle('compactView')}
              className={`
                relative w-12 h-6 rounded-full transition-colors
                ${preferences.compactView ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}
              `}
              type="button"
            >
              <div
                className={`
                  absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform
                  ${preferences.compactView ? 'translate-x-6' : 'translate-x-0.5'}
                `}
              />
            </button>
          </div>

          {/* Weekly Digest */}
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium">Weekly Digest</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Receive a weekly summary of your activity
              </p>
            </div>
            <button
              onClick={() => handlePreferenceToggle('weeklyDigest')}
              className={`
                relative w-12 h-6 rounded-full transition-colors
                ${preferences.weeklyDigest ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}
              `}
              type="button"
            >
              <div
                className={`
                  absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform
                  ${preferences.weeklyDigest ? 'translate-x-6' : 'translate-x-0.5'}
                `}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
        <h3 className="text-lg font-semibold mb-4">Data & Privacy</h3>
        <div className="space-y-3">
          <button className="w-full text-left p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <h4 className="font-medium">Download Your Data</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Export all your data in a portable format
            </p>
          </button>

          <button className="w-full text-left p-4 border border-red-200 dark:border-red-900 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <h4 className="font-medium text-red-600 dark:text-red-400">Delete Account</h4>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              Permanently delete your account and all data
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesSettings;
