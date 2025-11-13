import React from 'react';
import { Infographic } from '../../types/infographic';
import InfographicCard from './InfographicCard';

interface InfographicListProps {
  infographics: Infographic[];
  onEdit: (infographic: Infographic) => void;
  onDelete: (infographicId: string) => void;
  onToggleFeatured: (infographicId: string) => void;
  onChangeStatus: (infographicId: string, status: Infographic['status']) => void;
}

const InfographicList: React.FC<InfographicListProps> = ({
  infographics,
  onEdit,
  onDelete,
  onToggleFeatured,
  onChangeStatus,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {infographics.map((infographic) => (
        <InfographicCard
          key={infographic.id}
          infographic={infographic}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFeatured={onToggleFeatured}
          onChangeStatus={onChangeStatus}
        />
      ))}
    </div>
  );
};

export default InfographicList;
