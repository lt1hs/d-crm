import React from 'react';
import { Article } from '../../types/article';
import { IconEdit, IconTrash, IconEye, IconHeart, IconMessageCircle, IconCalendar, IconStar } from '../Icons';
import { articleCategories, articleStatuses } from '../../data/articleCategories';
import { formatNumber } from '../../utils/articleHelpers';

interface ArticleCardProps {
  article: Article;
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onEdit, onDelete }) => {
  const category = articleCategories.find(c => c.id === article.category);
  const status = articleStatuses.find(s => s.id === article.status);
  
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'published':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'draft':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
      case 'review':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'approved':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'archived':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg transition-all overflow-hidden">
      {/* Featured Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-900">
        <img
          src={article.featuredImage}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect fill='%239333ea' width='300' height='400'/%3E%3Ctext fill='white' font-size='48' font-family='Arial' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EArticle%3C/text%3E%3C/svg%3E`;
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {article.isFeatured && (
            <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded flex items-center gap-1">
              <IconStar className="w-3 h-3" />
              Featured
            </span>
          )}
          {category && (
            <span className="px-2 py-1 bg-purple-600 text-white text-xs font-medium rounded">
              {category.label}
            </span>
          )}
        </div>

        {/* Status Badge */}
        <div className="absolute bottom-2 left-2">
          <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(article.status)}`}>
            {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
          {article.title}
        </h3>
        
        {/* Author & Date */}
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          By {article.author} • {new Date(article.publishedDate || article.createdAt).toLocaleDateString()}
        </p>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
            {article.excerpt}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <IconEye className="w-3 h-3" />
            {formatNumber(article.views || 0)}
          </span>
          <span className="flex items-center gap-1">
            <IconHeart className="w-3 h-3" />
            {formatNumber(article.likes || 0)}
          </span>
          <span className="flex items-center gap-1">
            <IconMessageCircle className="w-3 h-3" />
            {formatNumber(article.commentsCount || 0)}
          </span>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {article.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
              >
                {tag}
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className="px-2 py-0.5 text-gray-500 dark:text-gray-400 text-xs">
                +{article.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex-1"></div>

          <button
            type="button"
            onClick={() => onEdit(article)}
            className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
            title="Edit"
          >
            <IconEdit className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm(`Delete "${article.title}"?`)) {
                onDelete(article.id);
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
