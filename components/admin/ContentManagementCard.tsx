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
    <Card padding="p-0" className="overflow-hidden">
      <div className="p-6 pb-4 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/10">
        <CardHeader title="Content Management" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="group p-5 border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:shadow-lg hover:border-blue-600 dark:hover:border-blue-500 transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-800"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className={`p-3 rounded-xl ${section.color} group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                <section.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 dark:text-white truncate text-sm mb-1">
                  {section.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {section.count} items
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {section.count}
              </span>
              <IconChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </a>
        ))}
      </div>
    </Card>
  );
};

export default ContentManagementCard;
