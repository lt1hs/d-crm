import React, { useState } from 'react';
import { NewsPost } from '../../types/news';
import { useAuth } from '../../context/AuthContext';
import NewsCard from './NewsCard';
import NewsWorkflowModal from './NewsWorkflowModal';
import NewsBulkActions from './NewsBulkActions';

interface NewsListProps {
  posts: NewsPost[];
  onEdit: (post: NewsPost) => void;
  onDelete: (id: string) => void;
  onStatusChange: (post: NewsPost) => void;
  onBulkAction?: (action: string, posts: NewsPost[]) => void;
}

const NewsList: React.FC<NewsListProps> = ({ posts, onEdit, onDelete, onStatusChange, onBulkAction }) => {
  const { hasPermission } = useAuth();
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());

  const handleWorkflowAction = (updatedPost: NewsPost) => {
    onStatusChange(updatedPost);
    setSelectedPost(null);
  };

  const handleSelectPost = (postId: string, selected: boolean) => {
    const newSelection = new Set(selectedPosts);
    if (selected) {
      newSelection.add(postId);
    } else {
      newSelection.delete(postId);
    }
    setSelectedPosts(newSelection);
  };

  const handleBulkActionComplete = (action: string, posts: NewsPost[]) => {
    onBulkAction?.(action, posts);
    setSelectedPosts(new Set());
  };

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-gray-500">No posts found</p>
      </div>
    );
  }

  const selectedPostsArray = posts.filter(p => selectedPosts.has(p.id));

  return (
    <>
      <div className="grid gap-4">
        {posts.map(post => (
          <NewsCard
            key={post.id}
            post={post}
            onEdit={() => onEdit(post)}
            onDelete={() => onDelete(post.id)}
            onViewWorkflow={() => setSelectedPost(post)}
            canEdit={hasPermission('news', 'update')}
            canDelete={hasPermission('news', 'delete')}
            isSelected={selectedPosts.has(post.id)}
            onSelect={(selected) => handleSelectPost(post.id, selected)}
          />
        ))}
      </div>

      {selectedPost && (
        <NewsWorkflowModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onAction={handleWorkflowAction}
        />
      )}

      {selectedPostsArray.length > 0 && onBulkAction && (
        <NewsBulkActions
          selectedPosts={selectedPostsArray}
          onBulkAction={handleBulkActionComplete}
          onClearSelection={() => setSelectedPosts(new Set())}
        />
      )}
    </>
  );
};

export default NewsList;
