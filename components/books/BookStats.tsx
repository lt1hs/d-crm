import React from 'react';
import { BookStats as BookStatsType } from '../../types/book';
import { IconBook, IconStar, IconCheck, IconGrid } from '../Icons';

interface BookStatsProps {
  stats: BookStatsType;
}

const BookStats: React.FC<BookStatsProps> = ({ stats }) => {
  const statCards = [
    {
      label: 'Total Books',
      value: stats.total,
      icon: IconBook,
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Active',
      value: stats.active,
      icon: IconCheck,
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Featured',
      value: stats.featured,
      icon: IconStar,
      color: 'yellow',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      label: 'Categories',
      value: Object.keys(stats.byCategory).length,
      icon: IconGrid,
      color: 'purple',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-md border border-gray-200/50 dark:border-gray-700/50 p-3 hover:bg-white dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                {stat.label}
              </p>
              <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {stat.value}
              </p>
            </div>
            <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookStats;
