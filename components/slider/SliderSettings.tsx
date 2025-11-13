import React, { useState } from 'react';
import { SliderSettings as SliderSettingsType } from '../../types/slider';
import { IconX, IconSettings } from '../Icons';

interface SliderSettingsProps {
  settings: SliderSettingsType;
  onUpdate: (settings: SliderSettingsType) => void;
  onClose: () => void;
}

const SliderSettings: React.FC<SliderSettingsProps> = ({ settings, onUpdate, onClose }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onUpdate(localSettings);
    onClose();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <IconSettings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            Slider Settings
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Customize slider behavior and appearance
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Close settings"
        >
          <IconX className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Autoplay */}
        <div className="flex items-center justify-between">
          <label htmlFor="autoplay" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Autoplay
          </label>
          <input
            id="autoplay"
            type="checkbox"
            checked={localSettings.autoplay}
            onChange={(e) => setLocalSettings({ ...localSettings, autoplay: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>

        {/* Autoplay Speed */}
        <div>
          <label htmlFor="autoplaySpeed" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Autoplay Speed (ms)
          </label>
          <input
            id="autoplaySpeed"
            type="number"
            value={localSettings.autoplaySpeed}
            onChange={(e) => setLocalSettings({ ...localSettings, autoplaySpeed: parseInt(e.target.value) || 5000 })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="1000"
            step="1000"
          />
        </div>

        {/* Show Arrows */}
        <div className="flex items-center justify-between">
          <label htmlFor="showArrows" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Show Arrows
          </label>
          <input
            id="showArrows"
            type="checkbox"
            checked={localSettings.showArrows}
            onChange={(e) => setLocalSettings({ ...localSettings, showArrows: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>

        {/* Show Dots */}
        <div className="flex items-center justify-between">
          <label htmlFor="showDots" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Show Dots
          </label>
          <input
            id="showDots"
            type="checkbox"
            checked={localSettings.showDots}
            onChange={(e) => setLocalSettings({ ...localSettings, showDots: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>

        {/* Infinite Loop */}
        <div className="flex items-center justify-between">
          <label htmlFor="infinite" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Infinite Loop
          </label>
          <input
            id="infinite"
            type="checkbox"
            checked={localSettings.infinite}
            onChange={(e) => setLocalSettings({ ...localSettings, infinite: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>

        {/* Transition */}
        <div>
          <label htmlFor="transition" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Transition Effect
          </label>
          <select
            id="transition"
            value={localSettings.transition}
            onChange={(e) => setLocalSettings({ ...localSettings, transition: e.target.value as 'slide' | 'fade' })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="slide">Slide</option>
            <option value="fade">Fade</option>
          </select>
        </div>

        {/* Height */}
        <div>
          <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Height Mode
          </label>
          <select
            id="height"
            value={localSettings.height}
            onChange={(e) => setLocalSettings({ ...localSettings, height: e.target.value as 'auto' | 'fixed' })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="auto">Auto</option>
            <option value="fixed">Fixed</option>
          </select>
        </div>

        {/* Fixed Height */}
        {localSettings.height === 'fixed' && (
          <div>
            <label htmlFor="fixedHeight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fixed Height (px)
            </label>
            <input
              id="fixedHeight"
              type="number"
              value={localSettings.fixedHeight || 400}
              onChange={(e) => setLocalSettings({ ...localSettings, fixedHeight: parseInt(e.target.value) || 400 })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="200"
              step="50"
            />
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SliderSettings;
