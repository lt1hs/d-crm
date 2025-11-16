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
  published: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  draft: 'bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  pending: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
};

const RecentContentCard: React.FC<RecentContentCardProps> = ({ items }) => {
  return (
    <Card padding="p-0" className="overflow-hidden border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <div className="p-4 pb-3 bg-gray-50/50 dark:bg-gray-900/20">
        <CardHeader 
          title="Recent Content" 
          action={
            <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium flex items-center gap-1 group">
              View All
              <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          }
        />
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="p-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 dark:text-white mb-1.5 truncate text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded font-medium">{item.type}</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {item.lastModified}
                  </span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${statusColors[item.status]}`}>
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
