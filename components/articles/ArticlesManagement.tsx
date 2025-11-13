import React, { useState, useEffect } from 'react';
import { Article } from '../../types/article';
import { ArticleForm } from './ArticleForm';
import { ArticleList } from './ArticleList';
import { ArticleFilters } from './ArticleFilters';
import { ArticleStats } from './ArticleStats';
import { IconPlus, IconSave, IconArticle } from '../Icons';
import { generateArticleId } from '../../utils/articleHelpers';

// Mock magazines data
const mockMagazines = [
  { id: '1', title: { en: 'Tech Monthly', ar: 'التقنية الشهرية' } },
  { id: '2', title: { en: 'Business Insights', ar: 'رؤى الأعمال' } },
  { id: '3', title: { en: 'Culture & Arts', ar: 'الثقافة والفنون' } },
];

// Mock initial articles
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'The Future of AI in Business',
    titleAr: 'مستقبل الذكاء الاصطناعي في الأعمال',
    slug: 'future-of-ai-in-business',
    excerpt: 'Exploring how AI is transforming modern business practices',
    excerptAr: 'استكشاف كيف يحول الذكاء الاصطناعي ممارسات الأعمال الحديثة',
    content: 'Artificial intelligence is revolutionizing the way businesses operate...',
    contentAr: 'الذكاء الاصطناعي يحدث ثورة في طريقة عمل الشركات...',
    author: 'John Smith',
    category: 'technology',
    status: 'published',
    featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    tags: ['AI', 'Business', 'Technology'],
    views: 1250,
    likes: 89,
    shares: 45,
    commentsCount: 23,
    isFeatured: true,
    isPinned: false,
    allowComments: true,
    publishedDate: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Sustainable Business Practices',
    titleAr: 'ممارسات الأعمال المستدامة',
    slug: 'sustainable-business-practices',
    excerpt: 'How companies are adopting eco-friendly strategies',
    excerptAr: 'كيف تتبنى الشركات استراتيجيات صديقة للبيئة',
    content: 'Sustainability is no longer optional for modern businesses...',
    contentAr: 'الاستدامة لم تعد اختيارية للشركات الحديثة...',
    author: 'Sarah Johnson',
    category: 'business',
    status: 'published',
    featuredImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
    tags: ['Sustainability', 'Business', 'Environment'],
    views: 890,
    likes: 67,
    shares: 32,
    commentsCount: 15,
    isFeatured: false,
    isPinned: false,
    allowComments: true,
    publishedDate: '2024-01-20T14:00:00Z',
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-20T14:00:00Z',
  },
  {
    id: '3',
    title: 'Digital Art Revolution',
    titleAr: 'ثورة الفن الرقمي',
    slug: 'digital-art-revolution',
    excerpt: 'The rise of NFTs and digital creativity',
    excerptAr: 'صعود الرموز غير القابلة للاستبدال والإبداع الرقمي',
    content: 'Digital art is experiencing unprecedented growth in the modern era...',
    contentAr: 'يشهد الفن الرقمي نموًا غير مسبوق في العصر الحديث...',
    author: 'Michael Chen',
    category: 'culture',
    status: 'draft',
    featuredImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    tags: ['Art', 'NFT', 'Digital'],
    views: 654,
    likes: 45,
    shares: 18,
    commentsCount: 12,
    isFeatured: false,
    isPinned: false,
    allowComments: true,
    createdAt: '2024-01-22T11:00:00Z',
    updatedAt: '2024-01-22T11:00:00Z',
  },
];

export const ArticlesManagement: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedMagazine, setSelectedMagazine] = useState('');

  // Load articles from localStorage
  useEffect(() => {
    const savedArticles = localStorage.getItem('articles');
    if (savedArticles) {
      setArticles(JSON.parse(savedArticles));
    } else {
      // Initialize with mock data
      setArticles(mockArticles);
    }
  }, []);

  // Apply filters
  useEffect(() => {
    const result = articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.titleAr && article.titleAr.includes(searchTerm)) ||
        article.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || article.category === selectedCategory;
      const matchesStatus = !selectedStatus || article.status === selectedStatus;
      const matchesMagazine = !selectedMagazine || (article as any).magazineId === selectedMagazine;

      return matchesSearch && matchesCategory && matchesStatus && matchesMagazine;
    });
    setFilteredArticles(result);
  }, [articles, searchTerm, selectedCategory, selectedStatus, selectedMagazine]);

  const handleSaveArticles = () => {
    localStorage.setItem('articles', JSON.stringify(articles));
  };

  const handleAddArticle = (articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newArticle: Article = {
      ...articleData,
      id: generateArticleId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setArticles([newArticle, ...articles]);
    setShowForm(false);
    handleSaveArticles();
  };

  const handleUpdateArticle = (articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingArticle) {
      const updatedArticle: Article = {
        ...articleData,
        id: editingArticle.id,
        createdAt: editingArticle.createdAt,
        updatedAt: new Date().toISOString(),
      };
      setArticles(articles.map((a) => a.id === editingArticle.id ? updatedArticle : a));
      setEditingArticle(null);
      setShowForm(false);
      handleSaveArticles();
    }
  };

  const handleDeleteArticle = (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      setArticles(articles.filter((a) => a.id !== id));
      handleSaveArticles();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Articles Management
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Create and manage your articles and blog posts
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setEditingArticle(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
            >
              <IconPlus className="w-4 h-4" />
              Add Article
            </button>
            <button
              type="button"
              onClick={handleSaveArticles}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
            >
              <IconSave className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex-shrink-0 mb-6">
        <ArticleStats articles={articles} />
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 mb-6">
        <ArticleFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedMagazine={selectedMagazine}
          onMagazineChange={setSelectedMagazine}
          magazines={mockMagazines}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Articles List */}
        <div className={`${showForm ? 'lg:col-span-8' : 'lg:col-span-12'} flex flex-col min-h-0`}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden">
            <div className="flex-shrink-0 p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Articles
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'} found
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {filteredArticles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-4">
                    <IconArticle className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {articles.length === 0 ? 'No articles yet' : 'No articles found'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-sm">
                    {articles.length === 0 
                      ? 'Start creating content by adding your first article.'
                      : 'Try adjusting your filters to find what you\'re looking for.'
                    }
                  </p>
                  {articles.length === 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingArticle(null);
                        setShowForm(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <IconPlus className="w-4 h-4" />
                      Add Your First Article
                    </button>
                  )}
                </div>
              ) : (
                <ArticleList
                  articles={filteredArticles}
                  onEdit={(article) => {
                    setEditingArticle(article);
                    setShowForm(true);
                  }}
                  onDelete={handleDeleteArticle}
                />
              )}
            </div>
          </div>
        </div>

        {/* Article Form */}
        {showForm && (
          <div className="lg:col-span-4 flex flex-col min-h-0 animate-in slide-in-from-right duration-300">
            <ArticleForm
              article={editingArticle}
              onSave={editingArticle ? handleUpdateArticle : handleAddArticle}
              onCancel={() => {
                setShowForm(false);
                setEditingArticle(null);
              }}
              magazines={mockMagazines}
            />
          </div>
        )}
      </div>
    </div>
  );
};
