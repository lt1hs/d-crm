import React, { useState, useEffect } from 'react';
import { Book } from '../../types/book';
import { generateBookId } from '../../utils/bookHelpers';
import { BOOK_CATEGORIES, BOOK_LANGUAGES, CURRENCIES } from '../../data/bookCategories';
import { IconX } from '../Icons';

interface BookFormProps {
  book: Book | null;
  onSave: (book: Book) => void;
  onCancel: () => void;
}

const BookForm: React.FC<BookFormProps> = ({ book, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    titleFa: '',
    author: '',
    authorAr: '',
    authorFa: '',
    description: '',
    descriptionAr: '',
    descriptionFa: '',
    isbn: '',
    coverImage: '',
    category: 'fiction',
    tags: [] as string[],
    publishedDate: '',
    publisher: '',
    publisherAr: '',
    publisherFa: '',
    pages: 0,
    language: 'en',
    price: 0,
    currency: 'USD',
    downloadUrl: '',
    previewUrl: '',
    isFeatured: false,
    isActive: true,
  });

  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        titleAr: book.titleAr || '',
        titleFa: book.titleFa || '',
        author: book.author,
        authorAr: book.authorAr || '',
        authorFa: book.authorFa || '',
        description: book.description,
        descriptionAr: book.descriptionAr || '',
        descriptionFa: book.descriptionFa || '',
        isbn: book.isbn || '',
        coverImage: book.coverImage,
        category: book.category,
        tags: book.tags,
        publishedDate: book.publishedDate || '',
        publisher: book.publisher || '',
        publisherAr: book.publisherAr || '',
        publisherFa: book.publisherFa || '',
        pages: book.pages || 0,
        language: book.language,
        price: book.price || 0,
        currency: book.currency || 'USD',
        downloadUrl: book.downloadUrl || '',
        previewUrl: book.previewUrl || '',
        isFeatured: book.isFeatured,
        isActive: book.isActive,
      });
      setImagePreview(book.coverImage);
    }
  }, [book]);

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
    
    const bookData: Book = {
      id: book?.id || generateBookId(),
      ...formData,
      rating: book?.rating,
      reviewCount: book?.reviewCount,
      createdAt: book?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(bookData);
  };

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-md border border-gray-200/50 dark:border-gray-700/50 flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0 p-3 border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/20 flex items-center justify-between">
        <div>
          <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">
            {book ? 'Edit Book' : 'Add Book'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {book ? 'Update details' : 'Fill in details'}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          aria-label="Close form"
        >
          <IconX className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Cover Image */}
        <div>
          <label htmlFor="coverImage" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Cover Image URL *
          </label>
          <input
            id="coverImage"
            type="text"
            value={formData.coverImage}
            onChange={(e) => handleImageUrlChange(e.target.value)}
            className="w-full px-2.5 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/cover.jpg"
            required
          />
          {imagePreview && (
            <div className="mt-2 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
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
          <label htmlFor="title" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title (English) *
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-2.5 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Title (Arabic) */}
        <div>
          <label htmlFor="titleAr" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title (Arabic)
          </label>
          <input
            id="titleAr"
            type="text"
            value={formData.titleAr}
            onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
            className="w-full px-2.5 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            dir="rtl"
          />
        </div>

        {/* Title (Persian) */}
        <div>
          <label htmlFor="titleFa" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title (Persian)
          </label>
          <input
            id="titleFa"
            type="text"
            value={formData.titleFa}
            onChange={(e) => setFormData({ ...formData, titleFa: e.target.value })}
            className="w-full px-2.5 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            dir="rtl"
          />
        </div>

        {/* Author */}
        <div>
          <label htmlFor="author" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Author *
          </label>
          <input
            id="author"
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-2.5 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Category & Language Row */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="category" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-2.5 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              {BOOK_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="language" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Language
            </label>
            <select
              id="language"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="w-full px-2.5 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              {BOOK_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-2.5 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            required
          />
        </div>

        {/* ISBN & Pages Row */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="isbn" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              ISBN
            </label>
            <input
              id="isbn"
              type="text"
              value={formData.isbn}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              className="w-full px-2.5 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="pages" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Pages
            </label>
            <input
              id="pages"
              type="number"
              value={formData.pages}
              onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) || 0 })}
              className="w-full px-2.5 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              min="0"
            />
          </div>
        </div>

        {/* Price & Currency Row */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="price" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Price
            </label>
            <input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              className="w-full px-2.5 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label htmlFor="currency" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Currency
            </label>
            <select
              id="currency"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-2.5 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              {CURRENCIES.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.code}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="flex-1 px-2.5 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add tag..."
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              Add
            </button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-blue-900 dark:hover:text-blue-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Checkboxes */}
        <div className="flex items-center gap-4 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-1"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Featured</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-1"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
          </label>
        </div>
      </form>
      
      {/* Actions */}
      <div className="flex-shrink-0 p-3 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/20">
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            type="button"
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            {book ? 'Update' : 'Add'} Book
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookForm;
