import React from 'react';
import { Book } from '../../types/book';
import { BOOK_CATEGORIES } from '../../data/bookCategories';
import { getBookCoverPlaceholder, formatPrice } from '../../utils/bookHelpers';
import { IconEdit, IconTrash, IconStar, IconEye, IconEyeOff, IconDownload, IconExternalLink } from '../Icons';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (bookId: string) => void;
  onToggleFeatured: (bookId: string) => void;
  onToggleActive: (bookId: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onEdit,
  onDelete,
  onToggleFeatured,
  onToggleActive,
}) => {
  const category = BOOK_CATEGORIES.find(c => c.id === book.category);

  return (
    <div
      className={`
        group bg-white dark:bg-gray-800 rounded-xl border-2 transition-all
        ${book.isActive 
          ? 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700' 
          : 'border-gray-200 dark:border-gray-700 opacity-60'
        }
        hover:shadow-lg
      `}
    >
      {/* Cover Image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-t-xl bg-gray-100 dark:bg-gray-900">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = getBookCoverPlaceholder(book.title);
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {book.isFeatured && (
            <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded flex items-center gap-1">
              <IconStar className="w-3 h-3" />
              Featured
            </span>
          )}
          {category && (
            <span className="px-2 py-1 bg-purple-600 text-white text-xs font-medium rounded">
              {category.icon} {category.name}
            </span>
          )}
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {book.downloadUrl && (
            <a
              href={book.downloadUrl}
              className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Download"
              onClick={(e) => e.stopPropagation()}
            >
              <IconDownload className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            </a>
          )}
          {book.previewUrl && (
            <a
              href={book.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Preview"
              onClick={(e) => e.stopPropagation()}
            >
              <IconExternalLink className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title & Author */}
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {book.author}
        </p>

        {/* Description */}
        {book.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
            {book.description}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
          {book.rating && (
            <div className="flex items-center gap-1">
              <IconStar className="w-3 h-3 text-yellow-500 fill-current" />
              <span>{book.rating.toFixed(1)}</span>
            </div>
          )}
          {book.pages && (
            <span>{book.pages} pages</span>
          )}
          {book.language && (
            <span className="uppercase">{book.language}</span>
          )}
        </div>

        {/* Price */}
        {book.price && (
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-3">
            {formatPrice(book.price, book.currency)}
          </div>
        )}

        {/* Tags */}
        {book.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {book.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
              >
                {tag}
              </span>
            ))}
            {book.tags.length > 3 && (
              <span className="px-2 py-0.5 text-gray-500 dark:text-gray-400 text-xs">
                +{book.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onToggleFeatured(book.id)}
            className={`p-2 rounded-lg transition-colors ${
              book.isFeatured
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
            title={book.isFeatured ? 'Remove from featured' : 'Add to featured'}
          >
            <IconStar className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToggleActive(book.id)}
            className={`p-2 rounded-lg transition-colors ${
              book.isActive
                ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-green-600 dark:text-green-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-600'
            }`}
            title={book.isActive ? 'Deactivate' : 'Activate'}
          >
            {book.isActive ? <IconEye className="w-4 h-4" /> : <IconEyeOff className="w-4 h-4" />}
          </button>
          <div className="flex-1"></div>
          <button
            onClick={() => onEdit(book)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Edit"
          >
            <IconEdit className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete "${book.title}"?`)) {
                onDelete(book.id);
              }
            }}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete"
          >
            <IconTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
