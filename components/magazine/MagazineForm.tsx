import React, { useState, useEffect } from 'react';
import { MagazineIssue, MagazineArticle } from '../../types/magazine';
import { generateMagazineId, generateArticleId } from '../../utils/magazineHelpers';
import { MAGAZINE_CATEGORIES, MAGAZINE_STATUSES, CURRENCIES } from '../../data/magazineCategories';
import { IconX, IconPlus, IconTrash } from '../Icons';

interface MagazineFormProps {
  magazine: MagazineIssue | null;
  onSave: (magazine: MagazineIssue) => void;
  onCancel: () => void;
}

const MagazineForm: React.FC<MagazineFormProps> = ({ magazine, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    issueNumber: 1,
    volume: 1,
    description: '',
    coverImage: '',
    publishDate: '',
    category: 'business',
    articles: [] as MagazineArticle[],
    totalPages: 0,
    pdfUrl: '',
    downloadUrl: '',
    previewUrl: '',
    tags: [] as string[],
    editor: '',
    status: 'draft' as MagazineIssue['status'],
    isFeatured: false,
    isPublic: true,
    price: 0,
    currency: 'USD',
  });

  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (magazine) {
      setFormData({
        title: magazine.title,
        issueNumber: magazine.issueNumber,
        volume: magazine.volume || 1,
        description: magazine.description,
        coverImage: magazine.coverImage,
        publishDate: magazine.publishDate,
        category: magazine.category,
        articles: magazine.articles,
        totalPages: magazine.totalPages,
        pdfUrl: magazine.pdfUrl || '',
        downloadUrl: magazine.downloadUrl || '',
        previewUrl: magazine.previewUrl || '',
        tags: magazine.tags,
        editor: magazine.editor,
        status: magazine.status,
        isFeatured: magazine.isFeatured,
        isPublic: magazine.isPublic,
        price: magazine.price || 0,
        currency: magazine.currency || 'USD',
      });
      setImagePreview(magazine.coverImage);
    }
  }, [magazine]);

  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, coverImage: url });
    setImagePreview(url);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const magazineData: MagazineIssue = {
      id: magazine?.id || generateMagazineId(),
      ...formData,
      views: magazine?.views || 0,
      downloads: magazine?.downloads || 0,
      likes: magazine?.likes || 0,
      createdAt: magazine?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(magazineData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {magazine ? 'Edit Magazine Issue' : 'Add Magazine Issue'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {magazine ? 'Update the issue details' : 'Fill in the details below'}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Close form"
        >
          <IconX className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Cover Image */}
        <div>
          <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Cover Image URL *
          </label>
          <input
            id="coverImage"
            type="text"
            value={formData.coverImage}
            onChange={(e) => handleImageUrlChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          {imagePreview && (
            <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" onError={() => setImagePreview('')} />
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Issue Number & Volume */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="issueNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Issue Number *
            </label>
            <input
              id="issueNumber"
              type="number"
              value={formData.issueNumber}
              onChange={(e) => setFormData({ ...formData, issueNumber: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              required
            />
          </div>

          <div>
            <label htmlFor="volume" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Volume
            </label>
            <input
              id="volume"
              type="number"
              value={formData.volume}
              onChange={(e) => setFormData({ ...formData, volume: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            required
          />
        </div>

        {/* Category & Status */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {MAGAZINE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status *
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as MagazineIssue['status'] })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {MAGAZINE_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.icon} {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Editor & Publish Date */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="editor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Editor *
            </label>
            <input
              id="editor"
              type="text"
              value={formData.editor}
              onChange={(e) => setFormData({ ...formData, editor: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Publish Date *
            </label>
            <input
              id="publishDate"
              type="date"
              value={formData.publishDate}
              onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Total Pages */}
        <div>
          <label htmlFor="totalPages" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Total Pages *
          </label>
          <input
            id="totalPages"
            type="number"
            value={formData.totalPages}
            onChange={(e) => setFormData({ ...formData, totalPages: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            required
          />
        </div>

        {/* Price & Currency */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Price
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
            />
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Currency
            </label>
            <select
              id="currency"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {CURRENCIES.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.code}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* PDF URL */}
        <div>
          <label htmlFor="pdfUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            PDF URL
          </label>
          <input
            id="pdfUrl"
            type="text"
            value={formData.pdfUrl}
            onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/magazine.pdf"
          />
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              id="tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add a tag..."
            />
            <button type="button" onClick={handleAddTag} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Add
            </button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-xs flex items-center gap-1">
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-purple-900 dark:hover:text-purple-200">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Checkboxes */}
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isFeatured" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Featured Issue</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Public Issue</label>
          </div>
        </div>
      </form>
      
      {/* Actions */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            type="button"
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
          >
            {magazine ? 'Update' : 'Add'} Issue
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MagazineForm;
