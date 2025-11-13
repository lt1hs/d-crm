import React from 'react';
import { Article } from '../../types/article';
import { ArticleCard } from './ArticleCard';

interface ArticleListProps {
  articles: Article[];
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
}

export const ArticleList: React.FC<ArticleListProps> = ({ articles, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
