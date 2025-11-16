import React from 'react';
import Card from '../Card';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  change?: string;
  changeType?: 'increase' | 'decrease';
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color,
  change,
  changeType = 'increase'
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">{value}</p>
          {change && (
            <div className="flex items-center gap-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                changeType === 'increase' 
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                  : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {changeType === 'increase' ? '↑' : '↓'} {change}
              </span>
            </div>
          )}
        </div>
        <div className={`p-2.5 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
