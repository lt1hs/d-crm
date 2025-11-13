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
      className="w-full p-5 border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:shadow-xl transition-all duration-300 text-left group hover:border-blue-600 dark:hover:border-blue-500 hover:-translate-y-1 bg-white dark:bg-gray-800"
    >
      <div className="flex items-start gap-4">
        <div className={`p-3.5 rounded-xl ${color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1.5 text-base">{title}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
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
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/10 pb-4">
        <CardHeader title="Quick Actions" />
      </div>
      <div className="grid grid-cols-1 gap-4 mt-2">
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
