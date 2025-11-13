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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {book ? 'Edit Book' : 'Add Book'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {book ? 'Update the book details' : 'Fill in the details below'}
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
            placeholder="https://example.com/cover.jpg"
            required
          />
          {imagePreview && (
            <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-48 object-cover"
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            dir="rtl"
          />
        </div>

        {/* Author (English) */}
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Author (English) *
          </label>
          <input
            id="author"
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Description (English) */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description (English) *
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

        {/* Category & Language */}
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
              {BOOK_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
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
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {BOOK_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ISBN & Pages */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ISBN
            </label>
            <input
              id="isbn"
              type="text"
              value={formData.isbn}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="978-3-16-148410-0"
            />
          </div>

          <div>
            <label htmlFor="pages" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Pages
            </label>
            <input
              id="pages"
              type="number"
              value={formData.pages || ''}
              onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
            />
          </div>
        </div>

        {/* Publisher & Published Date */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Publisher
            </label>
            <input
              id="publisher"
              type="text"
              value={formData.publisher}
              onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="publishedDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Published Date
            </label>
            <input
              id="publishedDate"
              type="date"
              value={formData.publishedDate}
              onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
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
              value={formData.price || ''}
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
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Add
            </button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs flex items-center gap-1"
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

        {/* Download & Preview URLs */}
        <div>
          <label htmlFor="downloadUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Download URL
          </label>
          <input
            id="downloadUrl"
            type="text"
            value={formData.downloadUrl}
            onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/book.pdf"
          />
        </div>

        <div>
          <label htmlFor="previewUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Preview URL
          </label>
          <input
            id="previewUrl"
            type="text"
            value={formData.previewUrl}
            onChange={(e) => setFormData({ ...formData, previewUrl: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/preview"
          />
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
            <label htmlFor="isFeatured" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Featured Book
            </label>
          </div>

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
            {book ? 'Update' : 'Add'} Book
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

export default BookForm;
