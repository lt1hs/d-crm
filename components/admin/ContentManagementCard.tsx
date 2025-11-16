import React from 'react';
import Card, { CardHeader } from '../Card';
import { IconChevronRight } from '../Icons';

interface ContentSection {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
  color: string;
}

interface ContentManagementCardProps {
  sections: ContentSection[];
}

const ContentManagementCard: React.FC<ContentManagementCardProps> = ({ sections }) => {
  return (
    <Card padding="p-0" className="overflow-hidden border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <div className="p-4 pb-3 bg-gray-50/50 dark:bg-gray-900/20">
        <CardHeader title="Content Management" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="group p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md hover:border-blue-500 dark:hover:border-blue-400 transition-all bg-white dark:bg-gray-800"
          >
            <div className="flex items-start gap-2.5 mb-3">
              <div className={`p-2 rounded-md ${section.color}`}>
                <section.icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 dark:text-white truncate text-sm">
                  {section.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {section.count} items
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {section.count}
              </span>
              <IconChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </div>
          </a>
        ))}
      </div>
    </Card>
  );
};

export default ContentManagementCard;
