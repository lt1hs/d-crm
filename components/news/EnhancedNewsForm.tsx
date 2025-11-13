import React, { useState, useEffect } from 'react';
import { NewsPost, newsLanguages, NewsPriority } from '../../types/news';
import { useAuth } from '../../context/AuthContext';
import { Save, X, Upload, Trash2, Eye, AlertCircle } from '../Icons';
import { useNewsAutoSave } from '../../hooks/useNewsAutoSave';
import CategoryManager from './CategoryManager';
import TagManager from './TagManager';
import RichTextEditor from './RichTextEditor';
import NewsPriorityBadge from './NewsPriorityBadge';

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
        tags: post.tags,
        images: post.images,
        priority: post.priority,
        featured: post.featured || false,
        allowComments: post.allowComments !== false,
        seoTitle: post.seoTitle || '',
        seoDescription: post.seoDescription || '',
        overallDeadline: post.overallDeadline || '',
      });
    }
  }, [post]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title should be at least 10 characters';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title should not exceed 200 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 100) {
      newErrors.content = 'Content should be at least 100 characters';
    }

    if (formData.excerpt && formData.excerpt.length > 300) {
      newErrors.excerpt = 'Excerpt should not exceed 300 characters';
    }

    if (formData.tags.length === 0) {
      newErrors.tags = 'Please select at least one tag';
    } else if (formData.tags.length > 10) {
      newErrors.tags = 'Maximum 10 tags allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !currentUser) return;

    const now = new Date().toISOString();
    const newsPost: NewsPost = {
      id: post?.id || Date.now().toString(),
      ...formData,
      status: post?.status || 'draft',
      authorId: post?.authorId || currentUser.id,
      authorName: post?.authorName || currentUser.username,
      designerId: post?.designerId,
      designerName: post?.designerName,
      reviewerId: post?.reviewerId,
      reviewerName: post?.reviewerName,
      createdAt: post?.createdAt || now,
      updatedAt: now,
      submittedForDesignAt: post?.submittedForDesignAt,
      submittedForReviewAt: post?.submittedForReviewAt,
      approvedAt: post?.approvedAt,
      publishedAt: post?.publishedAt,
      scheduledFor: post?.scheduledFor,
      deadlines: post?.deadlines || [],
      comments: post?.comments || [],
      revisions: post?.revisions || [],
      currentVersion: post?.currentVersion || 1,
    };

    onSave(newsPost);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file: File) => URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {post ? 'Edit News Post' : 'Create News Post'}
              </h1>
              <p className="text-gray-600 mt-1">
                {post ? 'Update your post details' : 'Fill in the details to create a new post'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {lastSaved && (
                <span className="text-sm text-gray-500">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </span>
              )}
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Eye className="w-5 h-5" />
                {showPreview ? 'Hide Preview' : 'Preview'}
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

                {/* Title */}
                <div>
                  <label htmlFor="post-title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    id="post-title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-lg ${
                      errors.title ? 'border-red-500' : ''
                    }`}
                    placeholder="Enter an engaging title..."
                    required
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.title.length}/200 characters
                  </p>
                </div>

                {/* Excerpt */}
                <div>
                  <label htmlFor="post-excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt (Optional)
                  </label>
                  <textarea
                    id="post-excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={3}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.excerpt ? 'border-red-500' : ''
                    }`}
                    placeholder="Brief summary of the post (shown in previews)..."
                  />
                  {errors.excerpt && (
                    <p className="text-sm text-red-600 mt-1">{errors.excerpt}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.excerpt.length}/300 characters
                  </p>
                </div>

                {/* Language */}
                <div>
                  <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Language *
                  </label>
                  <select
                    id="language-select"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value as any })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(newsLanguages).map(([code, name]) => (
                      <option key={code} value={code}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Content Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Start writing your post..."
                />
                {errors.content && (
                  <p className="text-sm text-red-600 mt-2">{errors.content}</p>
                )}
              </div>

              {/* Images Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Images</h2>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <Upload className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-600">Upload Images</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      aria-label="Upload images"
                    />
                  </label>
                  <span className="text-sm text-gray-500">
                    {formData.images.length} image(s) uploaded
                  </span>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                            Featured
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Image Tips:</p>
                    <ul className="mt-1 space-y-1 list-disc list-inside">
                      <li>First image will be used as featured image</li>
                      <li>Recommended size: 1200x630px for best results</li>
                      <li>Use high-quality, relevant images</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - 1/3 width */}
            <div className="space-y-6">
              {/* Publishing Options */}
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Publishing</h2>

                {/* Priority */}
                <div>
                  <label htmlFor="priority-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    id="priority-select"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as NewsPriority })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">⚪ Low</option>
                    <option value="normal">🔵 Normal</option>
                    <option value="high">🟠 High</option>
                    <option value="urgent">🔴 Urgent</option>
                  </select>
                  <div className="mt-2">
                    <NewsPriorityBadge priority={formData.priority} deadline={formData.overallDeadline} />
                  </div>
                </div>

                {/* Deadline */}
                <div>
                  <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                    Deadline (Optional)
                  </label>
                  <input
                    id="deadline"
                    type="datetime-local"
                    value={formData.overallDeadline}
                    onChange={(e) => setFormData({ ...formData, overallDeadline: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Options */}
                <div className="space-y-3 pt-4 border-t">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Featured Post</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.allowComments}
                      onChange={(e) => setFormData({ ...formData, allowComments: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Allow Comments</span>
                  </label>
                </div>
              </div>

              {/* Category */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <CategoryManager
                  selectedCategory={formData.category}
                  onSelectCategory={(category) => setFormData({ ...formData, category })}
                />
              </div>

              {/* Tags */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <TagManager
                  selectedTags={formData.tags}
                  onTagsChange={(tags) => setFormData({ ...formData, tags })}
                />
                {errors.tags && (
                  <p className="text-sm text-red-600 mt-2">{errors.tags}</p>
                )}
              </div>

              {/* SEO */}
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">SEO Settings</h2>

                <div>
                  <label htmlFor="seo-title" className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Title
                  </label>
                  <input
                    id="seo-title"
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Leave empty to use post title"
                  />
                </div>

                <div>
                  <label htmlFor="seo-description" className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Description
                  </label>
                  <textarea
                    id="seo-description"
                    value={formData.seoDescription}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Leave empty to use excerpt"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={onCancel}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="w-5 h-5" />
                {post ? 'Update Post' : 'Save Draft'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedNewsForm;
