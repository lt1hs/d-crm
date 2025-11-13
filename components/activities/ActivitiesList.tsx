import React from 'react';
import { Activity } from '../../types/activity';
import ActivityCard from './ActivityCard';

interface ActivitiesListProps {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete: (activityId: string) => void;
  onToggleFeatured: (activityId: string) => void;
  onChangeStatus: (activityId: string, status: Activity['status']) => void;
}

const ActivitiesList: React.FC<ActivitiesListProps> = ({
  activities,
  onEdit,
  onDelete,
  onToggleFeatured,
  onChangeStatus,
}) => {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFeatured={onToggleFeatured}
          onChangeStatus={onChangeStatus}
        />
      ))}
    </div>
  );
};

export default ActivitiesList;
