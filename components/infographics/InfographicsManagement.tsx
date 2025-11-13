import React, { useState, useEffect } from 'react';
import { Infographic, InfographicFilter, InfographicSortBy, InfographicSortOrder } from '../../types/infographic';
import { filterInfographics, sortInfographics, getInfographicStats } from '../../utils/infographicHelpers';
import InfographicList from './InfographicList';
import InfographicForm from './InfographicForm';
import InfographicFilters from './InfographicFilters';
import InfographicStats from './InfographicStats';
import { IconPlus, IconSave, IconImage } from '../Icons';

// Mock initial infographics
const mockInfographics: Infographic[] = [
  {
    id: '1',
    title: 'Annual Growth Statistics 2024',
    slug: 'annual-growth-statistics-2024',
    description: 'Comprehensive visualization of organizational growth metrics and key performance indicators for 2024.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    category: 'business',
    type: 'statistical',
    status: 'published',
    isFeatured: true,
    isPublic: true,
    designer: 'Design Team',
    department: 'Marketing',
    createdDate: '2024-01-15',
    publishedDate: '2024-01-20',
    dimensions: { width: 1920, height: 1080 },
    fileSize: 3.2,
    format: 'png',
    language: 'en',
    tags: ['statistics', 'growth', 'annual report'],
    views: 5420,
    downloads: 1230,
    likes: 456,
    shares: 89,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: '2',
    title: 'Digital Transformation Journey',
    slug: 'digital-transformation-journey',
    description: 'Timeline infographic showing the stages of digital transformation implementation.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    category: 'technology',
    type: 'timeline',
    status: 'published',
    isFeatured: false,
    isPublic: true,
    designer: 'Tech Graphics',
    department: 'IT',
    createdDate: '2024-02-01',
    publishedDate: '2024-02-05',
    dimensions: { width: 2400, height: 1200 },
    fileSize: 4.5,
    format: 'svg',
    language: 'en',
    tags: ['technology', 'transformation', 'timeline'],
    views: 3890,
    downloads: 892,
    likes: 234,
    shares: 67,
    createdAt: '2024-01-28T08:00:00Z',
    updatedAt: '2024-02-05T10:00:00Z',
  },
];

const InfographicsManagement: React.FC = () => {
  const [infographics, setInfographics] = useState<Infographic[]>([]);
  const [filteredInfographics, setFilteredInfographics] = useState<Infographic[]>([]);
  const [editingInfographic, setEditingInfographic] = useState<Infographic | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<InfographicFilter>({});
  const [sortBy, setSortBy] = useState<InfographicSortBy>('createdDate');
  const [sortOrder, setSortOrder] = useState<InfographicSortOrder>('desc');

  // Load infographics from localStorage
  useEffect(() => {
    const savedInfographics = localStorage.getItem('infographics');
    if (savedInfographics) {
      setInfographics(JSON.parse(savedInfographics));
    } else {
      // Initialize with mock data
      setInfographics(mockInfographics);
    }
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = filterInfographics(infographics, filter);
    result = sortInfographics(result, sortBy, sortOrder);
    setFilteredInfographics(result);
  }, [infographics, filter, sortBy, sortOrder]);

  const handleSaveInfographics = () => {
    localStorage.setItem('infographics', JSON.stringify(infographics));
  };

  const handleAddInfographic = (infographic: Infographic) => {
    setInfographics([...infographics, infographic]);
    setShowForm(false);
    handleSaveInfographics();
  };

  const handleUpdateInfographic = (infographic: Infographic) => {
    setInfographics(infographics.map(i => i.id === infographic.id ? infographic : i));
    setEditingInfographic(null);
    setShowForm(false);
    handleSaveInfographics();
  };

  const handleDeleteInfographic = (infographicId: string) => {
    if (window.confirm('Are you sure you want to delete this infographic?')) {
      setInfographics(infographics.filter(i => i.id !== infographicId));
      handleSaveInfographics();
    }
  };

  const handleToggleFeatured = (infographicId: string) => {
    setInfographics(infographics.map(i => 
      i.id === infographicId ? { ...i, isFeatured: !i.isFeatured } : i
    ));
    handleSaveInfographics();
  };

  const handleChangeStatus = (infographicId: string, status: Infographic['status']) => {
    setInfographics(infographics.map(i => 
      i.id === infographicId ? { ...i, status } : i
    ));
    handleSaveInfographics();
  };

  const stats = getInfographicStats(infographics);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Infographics
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage visual data representations and information graphics
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setEditingInfographic(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm hover:shadow-md"
            >
              <IconPlus className="w-4 h-4" />
              Add Infographic
            </button>
            <button
              type="button"
              onClick={handleSaveInfographics}
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
        <InfographicStats stats={stats} />
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 mb-6">
        <InfographicFilters
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
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Infographics List */}
        <div className={`${showForm ? 'lg:col-span-8' : 'lg:col-span-12'} flex flex-col min-h-0`}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden">
            <div className="flex-shrink-0 p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Infographics
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {filteredInfographics.length} {filteredInfographics.length === 1 ? 'infographic' : 'infographics'} found
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {filteredInfographics.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-full flex items-center justify-center mb-4">
                    <IconImage className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {infographics.length === 0 ? 'No infographics yet' : 'No infographics found'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-sm">
                    {infographics.length === 0 
                      ? 'Start building your visual library by adding your first infographic.'
                      : 'Try adjusting your filters to find what you\'re looking for.'
                    }
                  </p>
                  {infographics.length === 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingInfographic(null);
                        setShowForm(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      <IconPlus className="w-4 h-4" />
                      Add Your First Infographic
                    </button>
                  )}
                </div>
              ) : (
                <InfographicList
                  infographics={filteredInfographics}
                  onEdit={(infographic) => {
                    setEditingInfographic(infographic);
                    setShowForm(true);
                  }}
                  onDelete={handleDeleteInfographic}
                  onToggleFeatured={handleToggleFeatured}
                  onChangeStatus={handleChangeStatus}
                />
              )}
            </div>
          </div>
        </div>

        {/* Infographic Form */}
        {showForm && (
          <div className="lg:col-span-4 flex flex-col min-h-0 animate-in slide-in-from-right duration-300">
            <InfographicForm
              infographic={editingInfographic}
              onSave={editingInfographic ? handleUpdateInfographic : handleAddInfographic}
              onCancel={() => {
                setShowForm(false);
                setEditingInfographic(null);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InfographicsManagement;
