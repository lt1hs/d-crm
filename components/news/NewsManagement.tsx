import React, { useState, useEffect } from 'react';
import { NewsPost, NewsStatus } from '../../types/news';
import { useAuth } from '../../context/AuthContext';
import { Plus, Filter, Search } from '../Icons';
import EnhancedNewsForm from './EnhancedNewsForm';
import NewsList from './NewsList';
import NewsStats from './NewsStats';
import NewsFilters from './NewsFilters';
import { filterNewsByStatus, searchNews, sortNews } from '../../utils/newsHelpers';

const NewsManagement: React.FC = () => {
  const { currentUser, hasPermission } = useAuth();
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<NewsPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<NewsPost | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<NewsStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title' | 'status'>('newest');
  const [viewMode, setViewMode] = useState<'my_posts' | 'all' | 'pending_action'>('all');

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [posts, statusFilter, searchQuery, sortBy, viewMode, currentUser]);

  const loadPosts = () => {
    const savedPosts = localStorage.getItem('newsPosts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  };

  const savePosts = (updatedPosts: NewsPost[]) => {
    localStorage.setItem('newsPosts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };

  const applyFilters = () => {
    let filtered = [...posts];
    
    // View mode filter
    if (viewMode === 'my_posts' && currentUser) {
      filtered = filtered.filter(
        post => post.authorId === currentUser.id || post.designerId === currentUser.id
      );
    } else if (viewMode === 'pending_action' && currentUser) {
      filtered = filtered.filter(post => {
        if (currentUser.role === 'author' || currentUser.role === 'editor') {
          return (post.status === 'draft' || post.status === 'needs_revision') && post.authorId === currentUser.id;
        }
        if (currentUser.role === 'designer') {
          return (post.status === 'awaiting_design' || post.status === 'in_design') && 
                 (post.designerId === currentUser.id || !post.designerId);
        }
        if (currentUser.role === 'admin' || currentUser.role === 'boss') {
          return post.status === 'pending_review';
        }
        return false;
      });
    }
    
    // Status filter
    filtered = filterNewsByStatus(filtered, statusFilter);
    
    // Search filter
    if (searchQuery) {
      filtered = searchNews(filtered, searchQuery);
    }
    
    // Sort
    filtered = sortNews(filtered, sortBy);
    
    setFilteredPosts(filtered);
  };

  const handleSave = (post: NewsPost) => {
    if (editingPost) {
      const updated = posts.map(p => p.id === post.id ? post : p);
      savePosts(updated);
    } else {
      savePosts([...posts, post]);
    }
    setShowForm(false);
    setEditingPost(null);
  };

  const handleEdit = (post: NewsPost) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      savePosts(posts.filter(p => p.id !== id));
    }
  };

  const handleStatusChange = (post: NewsPost) => {
    const updated = posts.map(p => p.id === post.id ? post : p);
    savePosts(updated);
  };

  const handleBulkAction = (action: string, selectedPosts: NewsPost[]) => {
    const now = new Date().toISOString();
    const updated = posts.map(post => {
      const selected = selectedPosts.find(p => p.id === post.id);
      if (!selected) return post;

      switch (action) {
        case 'approve':
          return { ...post, status: 'approved' as const, approvedAt: now, updatedAt: now };
        case 'publish':
          return { ...post, status: 'published' as const, publishedAt: now, updatedAt: now };
        case 'schedule':
          return { ...post, status: 'scheduled' as const, updatedAt: now };
        case 'delete':
          return null;
        default:
          return post;
      }
    }).filter(Boolean) as NewsPost[];

    savePosts(updated);
  };

  const canCreate = hasPermission('news', 'create');

  if (showForm) {
    return (
      <EnhancedNewsForm
        post={editingPost}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false);
          setEditingPost(null);
        }}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News Management</h1>
          <p className="text-gray-600 mt-1">Manage news posts with workflow approval</p>
        </div>
        {canCreate && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Create Post
          </button>
        )}
      </div>

      {/* Stats */}
      <NewsStats posts={posts} />

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {showFilters && (
          <NewsFilters
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        )}
      </div>

      {/* Posts List */}
      <NewsList
        posts={filteredPosts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        onBulkAction={handleBulkAction}
      />
    </div>
  );
};

export default NewsManagement;
