import React from 'react';
import { MenuLocation } from '../../types/menu';

interface MenuLocationSelectorProps {
  locations: MenuLocation[];
  selectedLocation: string;
  onSelectLocation: (location: string) => void;
}

const MenuLocationSelector: React.FC<MenuLocationSelectorProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
        Select Menu Location
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {locations.map((location) => (
          <button
            key={location.id}
            onClick={() => onSelectLocation(location.slug)}
            className={`
              group p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden
              ${
                selectedLocation === location.slug
                  ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/20 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm'
              }
            `}
          >
            {selectedLocation === location.slug && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            )}
            <div className={`font-medium transition-colors ${
              selectedLocation === location.slug
                ? 'text-blue-900 dark:text-blue-100'
                : 'text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-300'
            }`}>
              {location.name}
            </div>
            {location.description && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {location.description}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuLocationSelector;
