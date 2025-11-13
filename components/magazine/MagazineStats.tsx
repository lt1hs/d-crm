import React from 'react';
import { MagazineStats as MagazineStatsType } from '../../types/magazine';
import { formatNumber } from '../../utils/magazineHelpers';
import { IconMagazine, IconCheck, IconEdit, IconEye, IconDownload, IconStar } from '../Icons';

interface MagazineStatsProps {
  stats: MagazineStatsType;
}

const MagazineStats: React.FC<MagazineStatsProps> = ({ stats }) => {
  const statCards = [
    {
      label: 'Total Issues',
      value: stats.total,
      icon: IconMagazine,
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      label: 'Published',
      value: stats.published,
      icon: IconCheck,
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Draft',
      value: stats.draft,
      icon: IconEdit,
      bgColor: 'bg-gray-100 dark:bg-gray-700',
      textColor: 'text-gray-600 dark:text-gray-400',
    },
    {
      label: 'Featured',
      value: stats.featured,
      icon: IconStar,
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      textColor: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      label: 'Total Views',
      value: formatNumber(stats.totalViews),
      icon: IconEye,
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Downloads',
      value: formatNumber(stats.totalDownloads),
      icon: IconDownload,
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
      textColor: 'text-indigo-600 dark:text-indigo-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {stat.value}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MagazineStats;
