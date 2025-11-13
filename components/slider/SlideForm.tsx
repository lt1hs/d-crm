import React, { useState, useEffect } from 'react';
import { Slide } from '../../types/slider';
import { generateSlideId } from '../../utils/sliderHelpers';
import { IconX, IconUpload } from '../Icons';

interface SlideFormProps {
  slide: Slide | null;
  existingSlides: Slide[];
  onSave: (slide: Slide) => void;
  onCancel: () => void;
}

const SlideForm: React.FC<SlideFormProps> = ({ slide, existingSlides, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    titleFa: '',
    description: '',
    descriptionAr: '',
    descriptionFa: '',
    imageUrl: '',
    linkUrl: '',
    linkText: '',
    linkTextAr: '',
    linkTextFa: '',
    order: existingSlides.length,
    isActive: true,
  });

  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (slide) {
      setFormData({
        title: slide.title,
        titleAr: slide.titleAr || '',
        titleFa: slide.titleFa || '',
        description: slide.description || '',
        descriptionAr: slide.descriptionAr || '',
        descriptionFa: slide.descriptionFa || '',
        imageUrl: slide.imageUrl,
        linkUrl: slide.linkUrl || '',
        linkText: slide.linkText || '',
        linkTextAr: slide.linkTextAr || '',
        linkTextFa: slide.linkTextFa || '',
        order: slide.order,
        isActive: slide.isActive,
      });
      setImagePreview(slide.imageUrl);
    }
  }, [slide]);

  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, imageUrl: url });
    setImagePreview(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const slideData: Slide = {
      id: slide?.id || generateSlideId(),
      ...formData,
      createdAt: slide?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(slideData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {slide ? 'Edit Slide' : 'Add Slide'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {slide ? 'Update the slide details' : 'Fill in the details below'}
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
        {/* Image URL */}
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Image URL *
          </label>
          <input
            id="imageUrl"
            type="text"
            value={formData.imageUrl}
            onChange={(e) => handleImageUrlChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/image.jpg"
            required
          />
          {imagePreview && (
            <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-32 object-cover"
                onError={() => setImagePreview('')}
              />
            </div>
          )}
        </div>

        {/* Title (English) */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title (English) *
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Title (Arabic) */}
        <div>
          <label htmlFor="titleAr" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title (Arabic)
          </label>
          <input
            id="titleAr"
            type="text"
            value={formData.titleAr}
            onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            dir="rtl"
          />
        </div>

        {/* Title (Persian) */}
        <div>
          <label htmlFor="titleFa" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title (Persian)
          </label>
          <input
            id="titleFa"
            type="text"
            value={formData.titleFa}
            onChange={(e) => setFormData({ ...formData, titleFa: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            dir="rtl"
          />
        </div>

        {/* Description (English) */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description (English)
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>

        {/* Description (Arabic) */}
        <div>
          <label htmlFor="descriptionAr" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description (Arabic)
          </label>
          <textarea
            id="descriptionAr"
            value={formData.descriptionAr}
            onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            dir="rtl"
          />
        </div>

        {/* Description (Persian) */}
        <div>
          <label htmlFor="descriptionFa" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description (Persian)
          </label>
          <textarea
            id="descriptionFa"
            value={formData.descriptionFa}
            onChange={(e) => setFormData({ ...formData, descriptionFa: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            dir="rtl"
          />
        </div>

        {/* Link URL */}
        <div>
          <label htmlFor="linkUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Link URL (Optional)
          </label>
          <input
            id="linkUrl"
            type="text"
            value={formData.linkUrl}
            onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="/page or https://example.com"
          />
        </div>

        {/* Link Text (English) */}
        <div>
          <label htmlFor="linkText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Link Text (English)
          </label>
          <input
            id="linkText"
            type="text"
            value={formData.linkText}
            onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Learn More"
          />
        </div>

        {/* Order */}
        <div>
          <label htmlFor="order" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Order
          </label>
          <input
            id="order"
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
          />
        </div>

        {/* Active Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isActive" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Active
          </label>
        </div>

      </form>
      
      {/* Actions - Fixed at bottom */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            type="button"
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
          >
            {slide ? 'Update' : 'Add'} Slide
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

export default SlideForm;
