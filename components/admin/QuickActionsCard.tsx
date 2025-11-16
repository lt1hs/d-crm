import React from 'react';
import Card, { CardHeader } from '../Card';
import { IconPlus } from '../Icons';

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  color: string;
}

const QuickAction: React.FC<QuickActionProps> = ({ title, description, icon: Icon, onClick, color }) => {
  return (
    <button
      onClick={onClick}
      className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all text-left group hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-gray-800"
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-md ${color}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 dark:text-white mb-1 text-sm">{title}</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </div>
    </button>
  );
};

interface QuickActionsCardProps {
  actions: Array<{
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }>;
}

const QuickActionsCard: React.FC<QuickActionsCardProps> = ({ actions }) => {
  return (
    <Card className="overflow-hidden border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <div className="bg-gray-50/50 dark:bg-gray-900/20 pb-3">
        <CardHeader title="Quick Actions" />
      </div>
      <div className="grid grid-cols-1 gap-3 mt-2">
        {actions.map((action, index) => (
          <QuickAction
            key={index}
            title={action.title}
            description={action.description}
            icon={action.icon}
            onClick={() => console.log(`Action: ${action.title}`)}
            color={action.color}
          />
        ))}
      </div>
    </Card>
  );
};

export default QuickActionsCard;
