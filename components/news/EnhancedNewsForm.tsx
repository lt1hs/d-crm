import React, { useState, useEffect } from 'react';
import { NewsPost, newsLanguages, NewsPriority } from '../../types/news';
import { useAuth } from '../../context/AuthContext';
import { IconSave, IconX, IconEye } from '../Icons';
import { useNewsAutoSave } from '../../hooks/useNewsAutoSave';
import CategoryManager from './CategoryManager';
import TagManager from './TagManager';
import RichTextEditor from './RichTextEditor';

interface EnhancedNewsFormProps {
  post: NewsPost | null;
  onSave: (post: NewsPost) => void;
  onCancel: () => void;
}

const EnhancedNewsForm: React.FC<EnhancedNewsFormProps> = ({ post, onSave, onCancel }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    language: 'en' as const,
    category: 'Technology',
    tags: [] as string[],
    images: [] as string[],
    priority: 'normal' as NewsPriority,
    featured: false,
    allowComments: true,
    seoTitle: '',
    seoDescription: '',
    overallDeadline: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save
  useNewsAutoSave(
    { ...formData, id: post?.id || 'new' },
    {
      enabled: !post || post.status === 'draft',
      interval: 30000,
      onSave: () => setLastSaved(new Date()),
    }
  );

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || '',
        language: post.language,
        category: post.category,
        tags: post.tags || [],
        images: post.images || [],
        priority: post.priority || 'normal',
        featured: post.featured || false,
        allowComments: post.allowComments !== false,
        seoTitle: post.seoTitle || '',
        seoDescription: post.seoDescription || '',
        overallDeadline: post.overallDeadline || '',
      });
    }
  }, [post]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newsPost: NewsPost = {
      id: post?.id || `news_${Date.now()}`,
      ...formData,
      status: post?.status || 'draft',
      authorId: currentUser?.id || '',
      authorName: currentUser?.fullName || '',
      createdAt: post?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: post?.publishedAt,
      approvedAt: post?.approvedAt,
      designerId: post?.designerId,
      designerName: post?.designerName,
      workflowHistory: post?.workflowHistory || [],
      comments: post?.comments || [],
      views: post?.views || 0,
      likes: post?.likes || 0,
      shares: post?.shares || 0,
    };

    onSave(newsPost);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-5">
        {/* Header */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-md border border-gray-200/50 dark:border-gray-700/50 p-3 mb-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {post ? 'Edit News Post' : 'Create News Post'}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {lastSaved && (
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Auto-saved {lastSaved.toLocaleTimeString()}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  showPreview 
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <IconEye className="w-3.5 h-3.5" />
                Preview
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <IconX className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-5">
              {/* Title & Basic Info */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-md border border-gray-200/50 dark:border-gray-700/50 p-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Excerpt
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                      placeholder="Brief summary of the post..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Language
                      </label>
                      <select
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {Object.entries(newsLanguages).map(([code, name]) => (
                          <option key={code} value={code}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Priority
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as NewsPriority })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Editor */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-md border border-gray-200/50 dark:border-gray-700/50 p-4">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content *
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Write your news content here..."
                />
                {errors.content && <p className="text-xs text-red-600 mt-1">{errors.content}</p>}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Category & Tags */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-md border border-gray-200/50 dark:border-gray-700/50 p-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Organization</h3>
                <div className="space-y-3">
                  <CategoryManager
                    selectedCategory={formData.category}
                    onCategoryChange={(category) => setFormData({ ...formData, category })}
                  />
                  <TagManager
                    selectedTags={formData.tags}
                    onTagsChange={(tags) => setFormData({ ...formData, tags })}
                  />
                </div>
              </div>

              {/* Settings */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-md border border-gray-200/50 dark:border-gray-700/50 p-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-1"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Featured Post</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.allowComments}
                      onChange={(e) => setFormData({ ...formData, allowComments: e.target.checked })}
                      className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-1"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Allow Comments</span>
                  </label>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Deadline
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.overallDeadline}
                      onChange={(e) => setFormData({ ...formData, overallDeadline: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-md border border-gray-200/50 dark:border-gray-700/50 p-4">
                <div className="space-y-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <IconSave className="w-3.5 h-3.5" />
                    {post ? 'Update Post' : 'Create Post'}
                  </button>
                  <button
                    type="button"
                    onClick={onCancel}
                    className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedNewsForm;
