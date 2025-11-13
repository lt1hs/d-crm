
import React, { ReactNode } from 'react';
import { IconDotsVertical } from './Icons';

interface CardProps {
  title?: string;
  headerAction?: ReactNode;
  children: ReactNode;
  className?: string;
  padding?: string;
}

const Card: React.FC<CardProps> = ({ title, headerAction, children, className = '', padding = 'p-6' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100/80 dark:border-gray-700/80 ${className}`}>
      {(title || headerAction) && (
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b dark:border-gray-700">
          {title && <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">{title}</h2>}
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className={padding}>{children}</div>
    </div>
  );
};

export const CardHeader: React.FC<{title: string; action?: React.ReactNode}> = ({title, action}) => (
    <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
        {action || <button aria-label="More options" className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"><IconDotsVertical className="w-5 h-5"/></button>}
    </div>
)


export default Card;
