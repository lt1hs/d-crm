import React from 'react';
import Card, { CardHeader } from '../Card';

interface ContentItem {
  id: string;
  title: string;
  status: 'published' | 'draft' | 'pending';
  lastModified: string;
  type: string;
}

interface RecentContentCardProps {
  items: ContentItem[];
}

const statusColors = {
  published: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  draft: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
};

const RecentContentCard: React.FC<RecentContentCardProps> = ({ items }) => {
  return (
    <Card padding="p-0" className="overflow-hidden">
      <div className="p-6 pb-4 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/10">
        <CardHeader 
          title="Recent Content" 
          action={
            <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold flex items-center gap-1 group">
              View All
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          }
        />
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="p-5 hover:bg-gradient-to-r hover:from-blue-50/50 dark:hover:from-blue-900/10 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                  <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-full font-medium">{item.type}</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {item.lastModified}
                  </span>
                </div>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm ${statusColors[item.status]}`}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentContentCard;
