import React from 'react';
import { Publication } from '../../types/publication';
import PublicationCard from './PublicationCard';

interface PublicationListProps {
  publications: Publication[];
  onEdit: (publication: Publication) => void;
  onDelete: (publicationId: string) => void;
  onToggleFeatured: (publicationId: string) => void;
  onChangeStatus: (publicationId: string, status: Publication['status']) => void;
}

const PublicationList: React.FC<PublicationListProps> = ({
  publications,
  onEdit,
  onDelete,
  onToggleFeatured,
  onChangeStatus,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {publications.map((publication) => (
        <PublicationCard
          key={publication.id}
          publication={publication}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFeatured={onToggleFeatured}
          onChangeStatus={onChangeStatus}
        />
      ))}
    </div>
  );
};

export default PublicationList;
