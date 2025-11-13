import React from 'react';
import { NewsPost } from '../../types/news';
import { FileText, Clock, CheckCircle, AlertCircle } from '../Icons';

interface NewsStatsProps {
  posts: NewsPost[];
}

const NewsStats: React.FC<NewsStatsProps> = ({ posts }) => {
  const stats = [
    {
      label: 'Total Posts',
      count: posts.length,
      icon: FileText,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Pending Review',
      count: posts.filter(p => p.status === 'pending_review').length,
      icon: Clock,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'Approved',
      count: posts.filter(p => p.status === 'approved').length,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Needs Revision',
      count: posts.filter(p => p.status === 'needs_revision').length,
      icon: AlertCircle,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsStats;
