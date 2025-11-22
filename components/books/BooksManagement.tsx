import React, { useState, useEffect } from 'react';
import { Book, BookFilter, BookSortBy, BookSortOrder } from '../../types/book';
import { filterBooks, sortBooks, getBookStats } from '../../utils/bookHelpers';
import BookList from './BookList';
import BookForm from './BookForm';
import BookFilters from './BookFilters';
import BookStats from './BookStats';
import { IconPlus, IconSave, IconBook } from '../Icons';

const BooksManagement: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<BookFilter>({});
  const [sortBy, setSortBy] = useState<BookSortBy>('createdAt');
  const [sortOrder, setSortOrder] = useState<BookSortOrder>('desc');

  // Load books from localStorage
  useEffect(() => {
    const savedBooks = localStorage.getItem('books');
    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    }
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = filterBooks(books, filter);
    result = sortBooks(result, sortBy, sortOrder);
    setFilteredBooks(result);
  }, [books, filter, sortBy, sortOrder]);

  const handleSaveBooks = () => {
    localStorage.setItem('books', JSON.stringify(books));
  };

  const handleAddBook = (book: Book) => {
    setBooks([...books, book]);
    setShowForm(false);
    handleSaveBooks();
  };

  const handleUpdateBook = (book: Book) => {
    setBooks(books.map(b => b.id === book.id ? book : b));
    setEditingBook(null);
    setShowForm(false);
    handleSaveBooks();
  };

  const handleDeleteBook = (bookId: string) => {
    setBooks(books.filter(b => b.id !== bookId));
    handleSaveBooks();
  };

  const handleToggleFeatured = (bookId: string) => {
    setBooks(books.map(b => 
      b.id === bookId ? { ...b, isFeatured: !b.isFeatured } : b
    ));
    handleSaveBooks();
  };

  const handleToggleActive = (bookId: string) => {
    setBooks(books.map(b => 
      b.id === bookId ? { ...b, isActive: !b.isActive } : b
    ));
    handleSaveBooks();
  };

  const stats = getBookStats(books);

  return (
    <div className="h-full flex flex-col space-y-5">
      {/* Header */}
      <div className="flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <IconBook className="w-5 h-5 text-blue-600" />
              Books Management
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Manage your book library and catalog
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setEditingBook(null);
                setShowForm(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <IconPlus className="w-3.5 h-3.5" />
              Add Book
            </button>
            <button
              onClick={handleSaveBooks}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <IconSave className="w-3.5 h-3.5" />
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex-shrink-0">
        <BookStats stats={stats} />
      </div>

      {/* Filters */}
      <div className="flex-shrink-0">
        <BookFilters
          filter={filter}
          onFilterChange={setFilter}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(by, order) => {
            setSortBy(by);
            setSortOrder(order);
          }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0">
        {/* Books List */}
        <div className={`${showForm ? 'lg:col-span-8' : 'lg:col-span-12'} flex flex-col min-h-0`}>
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-md border border-gray-200/50 dark:border-gray-700/50 flex flex-col h-full overflow-hidden">
            <div className="flex-shrink-0 p-3 border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">
                    Books Library
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} found
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {filteredBooks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-3">
                    <IconBook className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">
                    {books.length === 0 ? 'No books yet' : 'No books found'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-3 max-w-sm text-sm">
                    {books.length === 0 
                      ? 'Start building your library by adding your first book.'
                      : 'Try adjusting your filters to find what you\'re looking for.'
                    }
                  </p>
                  {books.length === 0 && (
                    <button
                      onClick={() => {
                        setEditingBook(null);
                        setShowForm(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <IconPlus className="w-3.5 h-3.5" />
                      Add Your First Book
                    </button>
                  )}
                </div>
              ) : (
                <BookList
                  books={filteredBooks}
                  onEdit={(book) => {
                    setEditingBook(book);
                    setShowForm(true);
                  }}
                  onDelete={handleDeleteBook}
                  onToggleFeatured={handleToggleFeatured}
                  onToggleActive={handleToggleActive}
                />
              )}
            </div>
          </div>
        </div>

        {/* Book Form */}
        {showForm && (
          <div className="lg:col-span-4 flex flex-col min-h-0 animate-in slide-in-from-right duration-300">
            <BookForm
              book={editingBook}
              onSave={editingBook ? handleUpdateBook : handleAddBook}
              onCancel={() => {
                setShowForm(false);
                setEditingBook(null);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksManagement;
