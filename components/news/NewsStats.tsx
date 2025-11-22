import React from 'react';
import { NewsPost } from '../../types/news';
import { IconFileText, IconClock, IconCheckCircle, IconAlertCircle } from '../Icons';

interface NewsStatsProps {
  posts: NewsPost[];
}

const NewsStats: React.FC<NewsStatsProps> = ({ posts }) => {
  const stats = [
    {
      label: 'Total Posts',
      count: posts.length,
      icon: IconFileText,
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    },
    {
      label: 'Pending Review',
      count: posts.filter(p => p.status === 'pending_review').length,
      icon: IconClock,
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    },
    {
      label: 'Approved',
      count: posts.filter(p => p.status === 'approved').length,
      icon: IconCheckCircle,
      color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    },
    {
      label: 'Needs Revision',
      count: posts.filter(p => p.status === 'needs_revision').length,
      icon: IconAlertCircle,
      color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-md border border-gray-200/50 dark:border-gray-700/50 p-3 hover:bg-white dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">{stat.label}</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{stat.count}</p>
            </div>
            <div className={`p-2 rounded-lg ${stat.color}`}>
              <stat.icon className="w-4 h-4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsStats;
