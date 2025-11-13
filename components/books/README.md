# Books Management System

A comprehensive book library management system for the Aspire HR Dashboard with advanced filtering, categorization, and multi-language support.

## Features

- **Complete Book Management**: Add, edit, delete, and organize books
- **Multi-language Support**: English, Arabic, and Persian translations for titles, authors, and descriptions
- **Advanced Filtering**: Filter by category, language, status, and search by title/author/ISBN
- **Flexible Sorting**: Sort by title, author, published date, date added, or rating
- **Rich Metadata**: ISBN, publisher, pages, price, tags, and more
- **Category System**: 8 predefined categories with icons and colors
- **Featured Books**: Mark books as featured for special promotion
- **Active/Inactive Status**: Control book visibility
- **Cover Images**: Support for book cover images with fallback placeholders
- **Download & Preview Links**: Optional links for book downloads and previews
- **Statistics Dashboard**: Real-time stats showing total, active, featured books, and categories
- **Responsive Grid Layout**: Beautiful card-based display
- **LocalStorage Persistence**: All data saved locally

## Components

### BooksManagement
Main orchestrator component managing the entire books system.

### BookStats
Displays key statistics in an attractive card layout:
- Total books
- Active books
- Featured books
- Number of categories in use

### BookFilters
Comprehensive filtering and sorting interface:
- Search by title, author, or ISBN
- Filter by category
- Filter by language
- Filter by status (active/inactive)
- Sort by multiple criteria
- Active filters display with clear all option

### BookList & BookCard
Grid-based display of books with:
- Cover image with hover effects
- Category and featured badges
- Title, author, and description
- Rating and page count
- Price display
- Tags
- Quick actions (featured toggle, active toggle, edit, delete)
- Download and preview links overlay

### BookForm
Comprehensive form for creating/editing books:
- Cover image with live preview
- Multi-language fields (English, Arabic, Persian)
- Category and language selection
- ISBN and page count
- Publisher and published date
- Price with currency selection
- Tag management (add/remove)
- Download and preview URLs
- Featured and active toggles

## Data Structure

Books are stored in localStorage with the following structure:

```typescript
{
  id: string;
  title: string;
  titleAr?: string;
  titleFa?: string;
  author: string;
  description: string;
  isbn?: string;
  coverImage: string;
  category: string;
  tags: string[];
  publishedDate?: string;
  publisher?: string;
  pages?: number;
  language: string;
  price?: number;
  currency?: string;
  downloadUrl?: string;
  previewUrl?: string;
  isFeatured: boolean;
  isActive: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}
```

## Categories

8 predefined categories:
1. **Fiction** 📚 - Novels and fictional works
2. **Non-Fiction** 📖 - Biographies, history, factual content
3. **Science & Technology** 🔬 - Scientific and technical books
4. **Business & Economics** 💼 - Business, finance, economics
5. **Self-Help** 🌟 - Personal development and motivation
6. **Religion & Spirituality** 🕌 - Religious and spiritual texts
7. **Children & Young Adult** 🎨 - Books for children and young adults
8. **Education & Reference** 🎓 - Educational materials and references

## Supported Languages

- English
- Arabic (with RTL support)
- Persian/Farsi (with RTL support)
- French
- Spanish
- German

## Supported Currencies

- USD ($) - US Dollar
- EUR (€) - Euro
- GBP (£) - British Pound
- AED (د.إ) - UAE Dirham
- SAR (ر.س) - Saudi Riyal

## Usage

1. Click "Books" in the sidebar to access the books management page
2. View statistics at the top showing your library overview
3. Use filters to find specific books
4. Click "Add Book" to create a new book entry
5. Fill in the comprehensive form with book details
6. Add tags by typing and pressing Enter or clicking Add
7. Toggle featured status with the star icon
8. Toggle active status with the eye icon
9. Edit or delete books using the action buttons
10. Click "Save" to persist changes to localStorage

## Features in Detail

### Search & Filter
- Real-time search across title, author, and ISBN
- Category filtering with emoji icons
- Language filtering
- Status filtering (active/inactive)
- Active filters display with badges
- Clear all filters option

### Sorting
- Sort by date added (newest/oldest)
- Sort by title (A-Z/Z-A)
- Sort by author (A-Z/Z-A)
- Sort by published date
- Sort by rating
- Toggle ascending/descending order

### Book Cards
- Hover effects with scale animation
- Cover image with fallback placeholder
- Category badge with color coding
- Featured badge for promoted books
- Quick action overlay on hover
- Download and preview links
- Rating display with stars
- Page count and language
- Price with currency formatting
- Tag display (first 3 + count)
- Action buttons for edit, delete, featured, and active toggles

### Form Features
- Live image preview
- Multi-language input fields with RTL support
- Category dropdown with icons
- Language selection
- ISBN input
- Date picker for published date
- Price input with currency selector
- Tag management system
- URL inputs for download and preview
- Featured and active checkboxes
- Form validation

## Helper Functions

### bookHelpers.ts
- `generateBookId()` - Generate unique book IDs
- `filterBooks()` - Apply filters to book list
- `sortBooks()` - Sort books by criteria
- `getBookStats()` - Calculate statistics
- `validateISBN()` - Validate ISBN-10 and ISBN-13
- `formatPrice()` - Format price with currency
- `getBookCoverPlaceholder()` - Generate placeholder cover images

## Future Enhancements

1. **Reviews & Ratings**: User reviews and rating system
2. **Reading Lists**: Create and manage reading lists
3. **Import/Export**: Import books from CSV or export library
4. **Advanced Search**: Full-text search in descriptions
5. **Bulk Operations**: Bulk edit, delete, or update books
6. **Book Series**: Group books into series
7. **Author Management**: Separate author profiles
8. **Reading Progress**: Track reading progress
9. **Recommendations**: AI-powered book recommendations
10. **Cover Upload**: Direct image upload instead of URLs
11. **API Integration**: Connect to book databases (Google Books, Open Library)
12. **Barcode Scanner**: Scan ISBN barcodes to add books
