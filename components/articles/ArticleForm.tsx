import React, { useState, useEffect } from 'react';
import { Article } from '../../types/article';
import { IconX } from '../Icons';
import { articleCategories, articleStatuses } from '../../data/articleCategories';
import { generateSlug } from '../../utils/articleHelpers';

interface ArticleFormProps {
  article?: Article;
  onSave: (article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  magazines: Array<{ id: string; title: { en: string } }>;
}

export const ArticleForm: React.FC<ArticleFormProps> = ({ article, onSave, onCancel, magazines }) => {
  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    slug: '',
    excerpt: '',
    excerptAr: '',
    content: '',
    contentAr: '',
    author: '',
    category: '',
    status: 'draft' as Article['status'],
    featuredImage: '',
    tags: [] as string[],
    views: 0,
    likes: 0,
    shares: 0,
    commentsCount: 0,
    isFeatured: false,
    isPinned: false,
    allowComments: true,
    publishedDate: '',
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        titleAr: article.titleAr || '',
        slug: article.slug,
        excerpt: article.excerpt || '',
        excerptAr: article.excerptAr || '',
        content: article.content,
        contentAr: article.contentAr || '',
        author: article.author,
        category: article.category,
        status: article.status,
        featuredImage: article.featuredImage || '',
        tags: article.tags || [],
        views: article.views || 0,
        likes: article.likes || 0,
        shares: article.shares || 0,
        commentsCount: article.commentsCount || 0,
        isFeatured: article.isFeatured || false,
        isPinned: article.isPinned || false,
        allowComments: article.allowComments !== false,
        publishedDate: article.publishedDate || '',
      });
    }
  }, [article]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formData.slug || generateSlug(formData.title);
    onSave({ ...formData, slug });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {article ? 'Edit Article' : 'New Article'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {article ? 'Update article details' : 'Fill in the article information'}
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Close"
        >
          <IconX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label htmlFor="title-en" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Title (English) *
            </label>
            <input
              id="title-en"
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Enter article title"
            />
          </div>

          <div>
            <label htmlFor="title-ar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Title (Arabic)
            </label>
            <input
              id="title-ar"
              type="text"
              value={formData.titleAr}
              onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="أدخل عنوان المقال"
              dir="rtl"
            />
          </div>

          <div>
            <label htmlFor="excerpt-en" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Excerpt (English)
            </label>
            <textarea
              id="excerpt-en"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              rows={2}
              placeholder="Brief summary..."
            />
          </div>

          <div>
            <label htmlFor="excerpt-ar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Excerpt (Arabic)
            </label>
            <textarea
              id="excerpt-ar"
              value={formData.excerptAr}
              onChange={(e) => setFormData({ ...formData, excerptAr: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              rows={2}
              placeholder="ملخص مختصر..."
              dir="rtl"
            />
          </div>

          <div>
            <label htmlFor="content-en" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Content (English) *
            </label>
            <textarea
              id="content-en"
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              rows={4}
              placeholder="Article content..."
            />
          </div>

          <div>
            <label htmlFor="content-ar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Content (Arabic)
            </label>
            <textarea
              id="content-ar"
              value={formData.contentAr}
              onChange={(e) => setFormData({ ...formData, contentAr: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              rows={4}
              placeholder="محتوى المقال..."
              dir="rtl"
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Author *
            </label>
            <input
              id="author"
              type="text"
              required
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Author name"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Category *
            </label>
            <select
              id="category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              title="Select category"
            >
              <option value="">Select category</option>
              {articleCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Status *
            </label>
            <select
              id="status"
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Article['status'] })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              title="Select status"
            >
              {articleStatuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="featured-image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Featured Image URL
            </label>
            <input
              id="featured-image"
              type="url"
              value={formData.featuredImage}
              onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label htmlFor="tags-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                id="tags-input"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                placeholder="Add tag and press Enter"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                title="Add tag"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md text-xs flex items-center gap-1.5"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-blue-900 dark:hover:text-blue-300"
                    title="Remove tag"
                  >
                    <IconX className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {formData.status === 'published' && (
            <div>
              <label htmlFor="published-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Published Date
              </label>
              <input
                id="published-date"
                type="datetime-local"
                value={formData.publishedDate}
                onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          )}

        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
          >
            {article ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};
