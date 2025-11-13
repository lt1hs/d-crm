import React, { useState, useEffect } from 'react';
import { Testimonial, TestimonialFilter, TestimonialSortBy, TestimonialSortOrder } from '../../types/testimonial';
import { filterTestimonials, sortTestimonials, getTestimonialStats } from '../../utils/testimonialHelpers';
import TestimonialList from './TestimonialList';
import TestimonialForm from './TestimonialForm';
import TestimonialFilters from './TestimonialFilters';
import TestimonialStats from './TestimonialStats';
import { IconPlus, IconSave, IconQuote } from '../Icons';

// Mock initial testimonials
const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    slug: 'sarah-johnson',
    position: 'CEO',
    company: 'Tech Innovations Inc.',
    testimonial: 'Working with this team has been an absolute game-changer for our business. Their expertise and dedication to excellence is unmatched. Highly recommended!',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    category: 'client',
    type: 'text',
    status: 'published',
    isFeatured: true,
    isPublic: true,
    rating: 5,
    date: '2024-01-15',
    location: 'San Francisco, USA',
    email: 'sarah@techinnovations.com',
    website: 'https://techinnovations.com',
    tags: ['business', 'technology', 'partnership'],
    verified: true,
    helpfulCount: 45,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Ahmed Al-Rashid',
    slug: 'ahmed-al-rashid',
    position: 'Marketing Director',
    company: 'Global Solutions Ltd.',
    testimonial: 'The level of professionalism and attention to detail exceeded our expectations. Our project was delivered on time and within budget. Excellent service!',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    category: 'customer',
    type: 'text',
    status: 'published',
    isFeatured: false,
    isPublic: true,
    rating: 5,
    date: '2024-02-01',
    location: 'Dubai, UAE',
    tags: ['marketing', 'service', 'quality'],
    verified: true,
    helpfulCount: 32,
    createdAt: '2024-01-28T08:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
  },
];

const TestimonialsManagement: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>([]);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<TestimonialFilter>({});
  const [sortBy, setSortBy] = useState<TestimonialSortBy>('date');
  const [sortOrder, setSortOrder] = useState<TestimonialSortOrder>('desc');

  // Load testimonials from localStorage
  useEffect(() => {
    const savedTestimonials = localStorage.getItem('testimonials');
    if (savedTestimonials) {
      setTestimonials(JSON.parse(savedTestimonials));
    } else {
      // Initialize with mock data
      setTestimonials(mockTestimonials);
    }
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = filterTestimonials(testimonials, filter);
    result = sortTestimonials(result, sortBy, sortOrder);
    setFilteredTestimonials(result);
  }, [testimonials, filter, sortBy, sortOrder]);

  const handleSaveTestimonials = () => {
    localStorage.setItem('testimonials', JSON.stringify(testimonials));
  };

  const handleAddTestimonial = (testimonial: Testimonial) => {
    setTestimonials([...testimonials, testimonial]);
    setShowForm(false);
    handleSaveTestimonials();
  };

  const handleUpdateTestimonial = (testimonial: Testimonial) => {
    setTestimonials(testimonials.map(t => t.id === testimonial.id ? testimonial : t));
    setEditingTestimonial(null);
    setShowForm(false);
    handleSaveTestimonials();
  };

  const handleDeleteTestimonial = (testimonialId: string) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      setTestimonials(testimonials.filter(t => t.id !== testimonialId));
      handleSaveTestimonials();
    }
  };

  const handleToggleFeatured = (testimonialId: string) => {
    setTestimonials(testimonials.map(t => 
      t.id === testimonialId ? { ...t, isFeatured: !t.isFeatured } : t
    ));
    handleSaveTestimonials();
  };

  const handleChangeStatus = (testimonialId: string, status: Testimonial['status']) => {
    setTestimonials(testimonials.map(t => 
      t.id === testimonialId ? { ...t, status } : t
    ));
    handleSaveTestimonials();
  };

  const stats = getTestimonialStats(testimonials);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Testimonials
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage customer reviews, feedback, and success stories
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setEditingTestimonial(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-sm hover:shadow-md"
            >
              <IconPlus className="w-4 h-4" />
              Add Testimonial
            </button>
            <button
              type="button"
              onClick={handleSaveTestimonials}
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
        <TestimonialStats stats={stats} />
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 mb-6">
        <TestimonialFilters
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
        {/* Testimonials List */}
        <div className={`${showForm ? 'lg:col-span-8' : 'lg:col-span-12'} flex flex-col min-h-0`}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden">
            <div className="flex-shrink-0 p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Testimonials
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {filteredTestimonials.length} {filteredTestimonials.length === 1 ? 'testimonial' : 'testimonials'} found
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {filteredTestimonials.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center mb-4">
                    <IconQuote className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {testimonials.length === 0 ? 'No testimonials yet' : 'No testimonials found'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-sm">
                    {testimonials.length === 0 
                      ? 'Start building your testimonials collection by adding your first review.'
                      : 'Try adjusting your filters to find what you\'re looking for.'
                    }
                  </p>
                  {testimonials.length === 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTestimonial(null);
                        setShowForm(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      <IconPlus className="w-4 h-4" />
                      Add Your First Testimonial
                    </button>
                  )}
                </div>
              ) : (
                <TestimonialList
                  testimonials={filteredTestimonials}
                  onEdit={(testimonial) => {
                    setEditingTestimonial(testimonial);
                    setShowForm(true);
                  }}
                  onDelete={handleDeleteTestimonial}
                  onToggleFeatured={handleToggleFeatured}
                  onChangeStatus={handleChangeStatus}
                />
              )}
            </div>
          </div>
        </div>

        {/* Testimonial Form */}
        {showForm && (
          <div className="lg:col-span-4 flex flex-col min-h-0 animate-in slide-in-from-right duration-300">
            <TestimonialForm
              testimonial={editingTestimonial}
              onSave={editingTestimonial ? handleUpdateTestimonial : handleAddTestimonial}
              onCancel={() => {
                setShowForm(false);
                setEditingTestimonial(null);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsManagement;
