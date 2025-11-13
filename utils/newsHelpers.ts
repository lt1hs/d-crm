import { NewsPost, NewsStatus, NewsComment, NewsRevision } from '../types/news';

export const getStatusColor = (status: NewsStatus): string => {
  const colors: Record<NewsStatus, string> = {
    draft: 'bg-gray-100 text-gray-800',
    awaiting_design: 'bg-yellow-100 text-yellow-800',
    in_design: 'bg-blue-100 text-blue-800',
    pending_review: 'bg-purple-100 text-purple-800',
    needs_revision: 'bg-orange-100 text-orange-800',
    approved: 'bg-green-100 text-green-800',
    published: 'bg-emerald-100 text-emerald-800',
    scheduled: 'bg-indigo-100 text-indigo-800',
  };
  return colors[status];
};

export const getStatusLabel = (status: NewsStatus): string => {
  const labels: Record<NewsStatus, string> = {
    draft: 'Draft',
    awaiting_design: 'Awaiting Design',
    in_design: 'In Design',
    pending_review: 'Pending Review',
    needs_revision: 'Needs Revision',
    approved: 'Approved',
    published: 'Published',
    scheduled: 'Scheduled',
  };
  return labels[status];
};

export const canPerformAction = (
  post: NewsPost,
  userRole: string,
  userId: string,
  action: string
): boolean => {
  // Super admin can do anything
  if (userRole === 'super_admin') return true;

  switch (action) {
    case 'edit_content':
      return (
        (post.status === 'draft' || post.status === 'needs_revision') &&
        post.authorId === userId
      );
    
    case 'submit_for_design':
      return post.status === 'draft' && post.authorId === userId;
    
    case 'start_design':
      return (
        (post.status === 'awaiting_design' || post.status === 'needs_revision') &&
        (userRole === 'designer' || userRole === 'admin')
      );
    
    case 'add_images':
      return (
        post.status === 'in_design' &&
        (post.designerId === userId || userRole === 'admin')
      );
    
    case 'submit_for_review':
      return (
        post.status === 'in_design' &&
        (post.designerId === userId || userRole === 'admin')
      );
    
    case 'approve':
    case 'request_revision':
      return (
        post.status === 'pending_review' &&
        (userRole === 'admin' || userRole === 'boss')
      );
    
    case 'publish':
    case 'schedule':
      return (
        post.status === 'approved' &&
        (userRole === 'admin' || userRole === 'boss')
      );
    
    default:
      return false;
  }
};

export const getAvailableActions = (
  post: NewsPost,
  userRole: string,
  userId: string
): string[] => {
  const actions: string[] = [];
  
  if (canPerformAction(post, userRole, userId, 'edit_content')) {
    actions.push('edit_content');
  }
  if (canPerformAction(post, userRole, userId, 'submit_for_design')) {
    actions.push('submit_for_design');
  }
  if (canPerformAction(post, userRole, userId, 'start_design')) {
    actions.push('start_design');
  }
  if (canPerformAction(post, userRole, userId, 'add_images')) {
    actions.push('add_images');
  }
  if (canPerformAction(post, userRole, userId, 'submit_for_review')) {
    actions.push('submit_for_review');
  }
  if (canPerformAction(post, userRole, userId, 'approve')) {
    actions.push('approve');
  }
  if (canPerformAction(post, userRole, userId, 'request_revision')) {
    actions.push('request_revision');
  }
  if (canPerformAction(post, userRole, userId, 'publish')) {
    actions.push('publish');
  }
  if (canPerformAction(post, userRole, userId, 'schedule')) {
    actions.push('schedule');
  }
  
  return actions;
};

export const addComment = (
  post: NewsPost,
  userId: string,
  username: string,
  userRole: string,
  comment: string,
  type: NewsComment['type'] = 'general'
): NewsPost => {
  const newComment: NewsComment = {
    id: Date.now().toString(),
    postId: post.id,
    userId,
    username,
    userRole,
    comment,
    timestamp: new Date().toISOString(),
    type,
  };
  
  return {
    ...post,
    comments: [...post.comments, newComment],
    updatedAt: new Date().toISOString(),
  };
};

export const createRevision = (
  post: NewsPost,
  userId: string,
  username: string,
  changes: string
): NewsPost => {
  const newRevision: NewsRevision = {
    id: Date.now().toString(),
    postId: post.id,
    version: post.currentVersion + 1,
    content: post.content,
    images: post.images,
    modifiedBy: username,
    modifiedAt: new Date().toISOString(),
    changes,
  };
  
  return {
    ...post,
    revisions: [...post.revisions, newRevision],
    currentVersion: post.currentVersion + 1,
    updatedAt: new Date().toISOString(),
  };
};

export const filterNewsByStatus = (posts: NewsPost[], status: NewsStatus | 'all'): NewsPost[] => {
  if (status === 'all') return posts;
  return posts.filter(post => post.status === status);
};

export const filterNewsByUser = (posts: NewsPost[], userId: string, role: 'author' | 'designer'): NewsPost[] => {
  if (role === 'author') {
    return posts.filter(post => post.authorId === userId);
  }
  return posts.filter(post => post.designerId === userId);
};

export const searchNews = (posts: NewsPost[], query: string): NewsPost[] => {
  const lowerQuery = query.toLowerCase();
  return posts.filter(
    post =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.content.toLowerCase().includes(lowerQuery) ||
      post.category.toLowerCase().includes(lowerQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

export const sortNews = (posts: NewsPost[], sortBy: 'newest' | 'oldest' | 'title' | 'status'): NewsPost[] => {
  const sorted = [...posts];
  
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'status':
      return sorted.sort((a, b) => a.status.localeCompare(b.status));
    default:
      return sorted;
  }
};


// Priority helpers
export const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    urgent: 'bg-red-100 text-red-800 border-red-300',
    high: 'bg-orange-100 text-orange-800 border-orange-300',
    normal: 'bg-blue-100 text-blue-800 border-blue-300',
    low: 'bg-gray-100 text-gray-800 border-gray-300',
  };
  return colors[priority] || colors.normal;
};

export const getPriorityLabel = (priority: string): string => {
  const labels: Record<string, string> = {
    urgent: '🔴 Urgent',
    high: '🟠 High',
    normal: '🔵 Normal',
    low: '⚪ Low',
  };
  return labels[priority] || labels.normal;
};

// Deadline helpers
export const isOverdue = (deadline: string): boolean => {
  return new Date(deadline) < new Date();
};

export const getDeadlineStatus = (deadline: string): 'overdue' | 'due-soon' | 'on-track' => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const hoursUntilDeadline = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  if (hoursUntilDeadline < 0) return 'overdue';
  if (hoursUntilDeadline < 24) return 'due-soon';
  return 'on-track';
};

export const formatDeadline = (deadline: string): string => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diff = deadlineDate.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (diff < 0) return 'Overdue';
  if (hours < 1) return 'Due in less than 1 hour';
  if (hours < 24) return `Due in ${hours} hours`;
  if (days === 1) return 'Due tomorrow';
  return `Due in ${days} days`;
};

// Read time calculator
export const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

// Workflow analytics
export const calculateWorkflowDuration = (post: NewsPost): number => {
  const start = new Date(post.createdAt);
  const end = post.publishedAt ? new Date(post.publishedAt) : new Date();
  return Math.floor((end.getTime() - start.getTime()) / (1000 * 60)); // minutes
};

export const getAverageResponseTime = (comments: NewsComment[]): number => {
  if (comments.length < 2) return 0;
  
  let totalTime = 0;
  for (let i = 1; i < comments.length; i++) {
    const prev = new Date(comments[i - 1].timestamp);
    const curr = new Date(comments[i].timestamp);
    totalTime += (curr.getTime() - prev.getTime()) / (1000 * 60);
  }
  
  return Math.floor(totalTime / (comments.length - 1));
};

// Bulk actions
export const canBulkApprove = (posts: NewsPost[], userRole: string): boolean => {
  return (userRole === 'admin' || userRole === 'boss') && 
         posts.every(p => p.status === 'pending_review');
};

export const canBulkPublish = (posts: NewsPost[], userRole: string): boolean => {
  return (userRole === 'admin' || userRole === 'boss') && 
         posts.every(p => p.status === 'approved');
};

// Filter by priority
export const filterNewsByPriority = (posts: NewsPost[], priority: string | 'all'): NewsPost[] => {
  if (priority === 'all') return posts;
  return posts.filter(post => post.priority === priority);
};

// Filter by deadline
export const filterNewsByDeadline = (posts: NewsPost[], filter: 'overdue' | 'due-soon' | 'all'): NewsPost[] => {
  if (filter === 'all') return posts;
  
  return posts.filter(post => {
    if (!post.overallDeadline) return false;
    const status = getDeadlineStatus(post.overallDeadline);
    return status === filter;
  });
};

// Get posts needing attention
export const getPostsNeedingAttention = (posts: NewsPost[], userId: string, userRole: string): NewsPost[] => {
  return posts.filter(post => {
    // Overdue posts
    if (post.overallDeadline && isOverdue(post.overallDeadline)) return true;
    
    // Assigned to user
    if (post.assignedDesignerId === userId && post.status === 'awaiting_design') return true;
    if (post.assignedReviewerId === userId && post.status === 'pending_review') return true;
    
    // High priority pending action
    if (post.priority === 'urgent' || post.priority === 'high') {
      if (userRole === 'designer' && post.status === 'awaiting_design') return true;
      if ((userRole === 'boss' || userRole === 'admin') && post.status === 'pending_review') return true;
    }
    
    return false;
  });
};

// Auto-save helpers
export const savePostDraft = (post: Partial<NewsPost>): void => {
  const key = `news_draft_${post.id || 'new'}`;
  localStorage.setItem(key, JSON.stringify({
    ...post,
    lastSaved: new Date().toISOString()
  }));
};

export const loadPostDraft = (postId: string): Partial<NewsPost> | null => {
  const key = `news_draft_${postId}`;
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : null;
};

export const clearPostDraft = (postId: string): void => {
  const key = `news_draft_${postId}`;
  localStorage.removeItem(key);
};
