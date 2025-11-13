import React from 'react';
import { Video } from '../../types/video';
import VideoCard from './VideoCard';

interface VideoListProps {
  videos: Video[];
  onEdit: (video: Video) => void;
  onDelete: (videoId: string) => void;
  onToggleFeatured: (videoId: string) => void;
  onChangeStatus: (videoId: string, status: Video['status']) => void;
}

const VideoList: React.FC<VideoListProps> = ({
  videos,
  onEdit,
  onDelete,
  onToggleFeatured,
  onChangeStatus,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFeatured={onToggleFeatured}
          onChangeStatus={onChangeStatus}
        />
      ))}
    </div>
  );
};

export default VideoList;
