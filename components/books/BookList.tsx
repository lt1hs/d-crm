import React from 'react';
import { Book } from '../../types/book';
import BookCard from './BookCard';

interface BookListProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (bookId: string) => void;
  onToggleFeatured: (bookId: string) => void;
  onToggleActive: (bookId: string) => void;
}

const BookList: React.FC<BookListProps> = ({
  books,
  onEdit,
  onDelete,
  onToggleFeatured,
  onToggleActive,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFeatured={onToggleFeatured}
          onToggleActive={onToggleActive}
        />
      ))}
    </div>
  );
};

export default BookList;
