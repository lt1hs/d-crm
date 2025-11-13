import React from 'react';
import { MagazineIssue } from '../../types/magazine';
import MagazineCard from './MagazineCard';

interface MagazineListProps {
  magazines: MagazineIssue[];
  onEdit: (magazine: MagazineIssue) => void;
  onDelete: (magazineId: string) => void;
  onToggleFeatured: (magazineId: string) => void;
  onChangeStatus: (magazineId: string, status: MagazineIssue['status']) => void;
}

const MagazineList: React.FC<MagazineListProps> = ({
  magazines,
  onEdit,
  onDelete,
  onToggleFeatured,
  onChangeStatus,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {magazines.map((magazine) => (
        <MagazineCard
          key={magazine.id}
          magazine={magazine}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFeatured={onToggleFeatured}
          onChangeStatus={onChangeStatus}
        />
      ))}
    </div>
  );
};

export default MagazineList;
