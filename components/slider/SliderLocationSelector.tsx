import React from 'react';
import { SliderLocation } from '../../types/slider';

interface SliderLocationSelectorProps {
  locations: SliderLocation[];
  selectedLocation: string;
  onSelectLocation: (location: string) => void;
}

const SliderLocationSelector: React.FC<SliderLocationSelectorProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
}) => {
  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-md border border-gray-200/50 dark:border-gray-700/50 p-3">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
        <span className="w-1 h-1 bg-purple-600 rounded-full"></span>
        Slider Location
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {locations.map((location) => (
          <button
            key={location.id}
            onClick={() => onSelectLocation(location.slug)}
            className={`
              group p-3 rounded-md border transition-all text-left relative
              ${
                selectedLocation === location.slug
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-sm'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }
            `}
          >
            {selectedLocation === location.slug && (
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
            )}
            <div className={`font-medium text-sm transition-colors ${
              selectedLocation === location.slug
                ? 'text-purple-900 dark:text-purple-100'
                : 'text-gray-900 dark:text-gray-100 group-hover:text-purple-700 dark:group-hover:text-purple-300'
            }`}>
              {location.name}
            </div>
            {location.description && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {location.description}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SliderLocationSelector;
