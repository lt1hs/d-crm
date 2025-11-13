import React from 'react';
import { NewsPriority } from '../../types/news';
import { AlertCircle, Clock } from '../Icons';
import { getPriorityColor, getPriorityLabel, getDeadlineStatus, formatDeadline } from '../../utils/newsHelpers';

interface NewsPriorityBadgeProps {
  priority: NewsPriority;
  deadline?: string;
  compact?: boolean;
}

const NewsPriorityBadge: React.FC<NewsPriorityBadgeProps> = ({ priority, deadline, compact = false }) => {
  const deadlineStatus = deadline ? getDeadlineStatus(deadline) : null;
  
  return (
    <div className="flex items-center gap-2">
      {/* Priority Badge */}
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(priority)}`}>
        {compact ? priority.toUpperCase() : getPriorityLabel(priority)}
      </span>
      
      {/* Deadline Badge */}
      {deadline && (
        <span
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            deadlineStatus === 'overdue'
              ? 'bg-red-100 text-red-800 border border-red-300'
              : deadlineStatus === 'due-soon'
              ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
              : 'bg-green-100 text-green-800 border border-green-300'
          }`}
        >
          {deadlineStatus === 'overdue' ? (
            <AlertCircle className="w-3 h-3" />
          ) : (
            <Clock className="w-3 h-3" />
          )}
          {formatDeadline(deadline)}
        </span>
      )}
    </div>
  );
};

export default NewsPriorityBadge;
