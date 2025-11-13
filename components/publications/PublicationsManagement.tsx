import React, { useState, useEffect } from 'react';
import { Publication, PublicationFilter, PublicationSortBy, PublicationSortOrder } from '../../types/publication';
import { filterPublications, sortPublications, getPublicationStats } from '../../utils/publicationHelpers';
import PublicationList from './PublicationList';
import PublicationForm from './PublicationForm';
import PublicationFilters from './PublicationFilters';
import PublicationStats from './PublicationStats';
import { IconPlus, IconSave, IconFileText } from '../Icons';

// Mock initial publications
const mockPublications: Publication[] = [
  {
    id: '1',
    title: 'Annual Sustainability Report 2024',
    slug: 'annual-sustainability-report-2024',
    description: 'Comprehensive overview of our environmental initiatives and sustainability achievements throughout 2024.',
    coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
    category: 'reports',
    type: 'report',
    status: 'published',
    isFeatured: true,
    isPublic: true,
    author: 'Environmental Team',
    department: 'Sustainability',
    publishDate: '2024-01-15',
    fileUrl: '/files/sustainability-report-2024.pdf',
    fileSize: 12.5,
    pageCount: 84,
    language: 'en',
    tags: ['sustainability', 'environment', 'annual report'],
    views: 2450,
    downloads: 890,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Digital Transformation Strategy Guide',
    slug: 'digital-transformation-strategy-guide',
    description: 'A comprehensive guide for organizations looking to implement digital transformation initiatives.',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    category: 'guides',
    type: 'guide',
    status: 'published',
    isFeatured: false,
    isPublic: true,
    author: 'Technology Department',
    department: 'IT',
    publishDate: '2024-02-01',
    fileUrl: '/files/digital-transformation-guide.pdf',
    fileSize: 8.2,
    pageCount: 56,
    language: 'en',
    tags: ['digital transformation', 'technology', 'strategy'],
    views: 1820,
    downloads: 654,
    createdAt: '2024-01-25T08:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
  },
];

const PublicationsManagement: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [filteredPublications, setFilteredPublications] = useState<Publication[]>([]);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<PublicationFilter>({});
  const [sortBy, setSortBy] = useState<PublicationSortBy>('publishDate');
  const [sortOrder, setSortOrder] = useState<PublicationSortOrder>('desc');

  // Load publications from localStorage
  useEffect(() => {
    const savedPublications = localStorage.getItem('publications');
    if (savedPublications) {
      setPublications(JSON.parse(savedPublications));
    } else {
      // Initialize with mock data
      setPublications(mockPublications);
    }
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = filterPublications(publications, filter);
    result = sortPublications(result, sortBy, sortOrder);
    setFilteredPublications(result);
  }, [publications, filter, sortBy, sortOrder]);

  const handleSavePublications = () => {
    localStorage.setItem('publications', JSON.stringify(publications));
  };

  const handleAddPublication = (publication: Publication) => {
    setPublications([...publications, publication]);
    setShowForm(false);
    handleSavePublications();
  };

  const handleUpdatePublication = (publication: Publication) => {
    setPublications(publications.map(p => p.id === publication.id ? publication : p));
    setEditingPublication(null);
    setShowForm(false);
    handleSavePublications();
  };

  const handleDeletePublication = (publicationId: string) => {
    if (window.confirm('Are you sure you want to delete this publication?')) {
      setPublications(publications.filter(p => p.id !== publicationId));
      handleSavePublications();
    }
  };

  const handleToggleFeatured = (publicationId: string) => {
    setPublications(publications.map(p => 
      p.id === publicationId ? { ...p, isFeatured: !p.isFeatured } : p
    ));
    handleSavePublications();
  };

  const handleChangeStatus = (publicationId: string, status: Publication['status']) => {
    setPublications(publications.map(p => 
      p.id === publicationId ? { ...p, status } : p
    ));
    handleSavePublications();
  };

  const stats = getPublicationStats(publications);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Institutional Publications
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage institutional reports, guides, and research publications
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setEditingPublication(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md"
            >
              <IconPlus className="w-4 h-4" />
              Add Publication
            </button>
            <button
              type="button"
              onClick={handleSavePublications}
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
        <PublicationStats stats={stats} />
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 mb-6">
        <PublicationFilters
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
        {/* Publications List */}
        <div className={`${showForm ? 'lg:col-span-8' : 'lg:col-span-12'} flex flex-col min-h-0`}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden">
            <div className="flex-shrink-0 p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Publications
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {filteredPublications.length} {filteredPublications.length === 1 ? 'publication' : 'publications'} found
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {filteredPublications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-4">
                    <IconFileText className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {publications.length === 0 ? 'No publications yet' : 'No publications found'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-sm">
                    {publications.length === 0 
                      ? 'Start building your institutional library by adding your first publication.'
                      : 'Try adjusting your filters to find what you\'re looking for.'
                    }
                  </p>
                  {publications.length === 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPublication(null);
                        setShowForm(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <IconPlus className="w-4 h-4" />
                      Add Your First Publication
                    </button>
                  )}
                </div>
              ) : (
                <PublicationList
                  publications={filteredPublications}
                  onEdit={(publication) => {
                    setEditingPublication(publication);
                    setShowForm(true);
                  }}
                  onDelete={handleDeletePublication}
                  onToggleFeatured={handleToggleFeatured}
                  onChangeStatus={handleChangeStatus}
                />
              )}
            </div>
          </div>
        </div>

        {/* Publication Form */}
        {showForm && (
          <div className="lg:col-span-4 flex flex-col min-h-0 animate-in slide-in-from-right duration-300">
            <PublicationForm
              publication={editingPublication}
              onSave={editingPublication ? handleUpdatePublication : handleAddPublication}
              onCancel={() => {
                setShowForm(false);
                setEditingPublication(null);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicationsManagement;
