import React, { useState, useEffect } from 'react';
import { Infographic } from '../../types/infographic';
import { INFOGRAPHIC_CATEGORIES, INFOGRAPHIC_TYPES, INFOGRAPHIC_FORMATS, INFOGRAPHIC_LANGUAGES } from '../../data/infographicCategories';
import { generateInfographicId, generateSlug } from '../../utils/infographicHelpers';
import { IconX, IconSave } from '../Icons';

interface InfographicFormProps {
  infographic: Infographic | null;
  onSave: (infographic: Infographic) => void;
  onCancel: () => void;
}

const InfographicForm: React.FC<InfographicFormProps> = ({ infographic, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Infographic>>({
    title: '',
    description: '',
    imageUrl: '',
    thumbnailUrl: '',
    category: INFOGRAPHIC_CATEGORIES[0].id,
    type: 'statistical',
    status: 'draft',
    isFeatured: false,
    isPublic: true,
    designer: '',
    department: '',
    createdDate: new Date().toISOString().split('T')[0],
    format: 'png',
    language: 'en',
    tags: [],
    views: 0,
    downloads: 0,
    likes: 0,
    shares: 0,
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (infographic) {
      setFormData(infographic);
    }
  }, [infographic]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date().toISOString();
    const infographicData: Infographic = {
      id: infographic?.id || generateInfographicId(),
      title: formData.title || '',
      slug: generateSlug(formData.title || ''),
      description: formData.description || '',
      imageUrl: formData.imageUrl || '',
      thumbnailUrl: formData.thumbnailUrl,
      category: formData.category || INFOGRAPHIC_CATEGORIES[0].id,
      type: formData.type || 'statistical',
      status: formData.status || 'draft',
      isFeatured: formData.isFeatured || false,
      isPublic: formData.isPublic !== undefined ? formData.isPublic : true,
      designer: formData.designer || '',
      department: formData.department,
      createdDate: formData.createdDate || new Date().toISOString().split('T')[0],
      publishedDate: formData.publishedDate,
      dimensions: formData.dimensions,
      fileSize: formData.fileSize,
      format: formData.format || 'png',
      language: formData.language || 'en',
      tags: formData.tags || [],
      views: formData.views || 0,
      downloads: formData.downloads || 0,
      likes: formData.likes || 0,
      shares: formData.shares || 0,
      sourceData: formData.sourceData,
      relatedContent: formData.relatedContent,
      createdAt: infographic?.createdAt || now,
      updatedAt: now,
    };

    onSave(infographicData);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(tag => tag !== tagToRemove) || [],
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0 flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-emerald-50 to-white dark:from-gray-800 dark:to-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {infographic ? 'Edit Infographic' : 'Add New Infographic'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <IconX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title *
          </label>
          <input
            id="title"
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Enter infographic title"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Brief description of the infographic"
          />
        </div>

        {/* Image URL */}
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Image URL *
          </label>
          <input
            id="imageUrl"
            type="url"
            required
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="https://example.com/infographic.png"
          />
        </div>

        {/* Thumbnail URL */}
        <div>
          <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Thumbnail URL
          </label>
          <input
            id="thumbnailUrl"
            type="url"
            value={formData.thumbnailUrl || ''}
            onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="https://example.com/thumbnail.png"
          />
        </div>

        {/* Category & Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category *
            </label>
            <select
              id="category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {INFOGRAPHIC_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type *
            </label>
            <select
              id="type"
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Infographic['type'] })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {INFOGRAPHIC_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Format & Language */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="format" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Format *
            </label>
            <select
              id="format"
              required
              value={formData.format}
              onChange={(e) => setFormData({ ...formData, format: e.target.value as Infographic['format'] })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {INFOGRAPHIC_FORMATS.map((format) => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Language *
            </label>
            <select
              id="language"
              required
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {INFOGRAPHIC_LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Designer & Department */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="designer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Designer *
            </label>
            <input
              id="designer"
              type="text"
              required
              value={formData.designer}
              onChange={(e) => setFormData({ ...formData, designer: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Designer name"
            />
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Department
            </label>
            <input
              id="department"
              type="text"
              value={formData.department || ''}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Department name"
            />
          </div>
        </div>

        {/* Dimensions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Dimensions (px)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={formData.dimensions?.width || ''}
              onChange={(e) => setFormData({
                ...formData,
                dimensions: {
                  width: parseInt(e.target.value) || 0,
                  height: formData.dimensions?.height || 0,
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Width"
            />
            <input
              type="number"
              value={formData.dimensions?.height || ''}
              onChange={(e) => setFormData({
                ...formData,
                dimensions: {
                  width: formData.dimensions?.width || 0,
                  height: parseInt(e.target.value) || 0,
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Height"
            />
          </div>
        </div>

        {/* File Size */}
        <div>
          <label htmlFor="fileSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            File Size (MB)
          </label>
          <input
            id="fileSize"
            type="number"
            step="0.1"
            value={formData.fileSize || ''}
            onChange={(e) => setFormData({ ...formData, fileSize: parseFloat(e.target.value) || undefined })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="2.5"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="createdDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Created Date *
            </label>
            <input
              id="createdDate"
              type="date"
              required
              value={formData.createdDate}
              onChange={(e) => setFormData({ ...formData, createdDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="publishedDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Published Date
            </label>
            <input
              id="publishedDate"
              type="date"
              value={formData.publishedDate || ''}
              onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tagInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              id="tagInput"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Add a tag"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags?.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-emerald-900 dark:hover:text-emerald-200"
                >
                  <IconX className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status *
          </label>
          <select
            id="status"
            required
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Infographic['status'] })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Checkboxes */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Featured Infographic</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Public Access</span>
          </label>
        </div>

        {/* Source Data */}
        <div>
          <label htmlFor="sourceData" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Source Data
          </label>
          <input
            id="sourceData"
            type="text"
            value={formData.sourceData || ''}
            onChange={(e) => setFormData({ ...formData, sourceData: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Data source or reference"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            <IconSave className="w-4 h-4" />
            {infographic ? 'Update Infographic' : 'Create Infographic'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default InfographicForm;
