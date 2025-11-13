import React, { useState, useEffect } from 'react';
import { Course, CourseFilter, CourseSortBy, CourseSortOrder } from '../../types/course';
import { filterCourses, sortCourses, getCourseStats } from '../../utils/courseHelpers';
import CourseList from './CourseList';
import CourseForm from './CourseForm';
import CourseFilters from './CourseFilters';
import CourseStats from './CourseStats';
import { IconPlus, IconSave, IconBook } from '../Icons';

// Mock initial courses
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Complete Web Development Bootcamp',
    slug: 'complete-web-development-bootcamp',
    description: 'Learn web development from scratch with HTML, CSS, JavaScript, React, Node.js and more.',
    shortDescription: 'Master web development with this comprehensive bootcamp',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    category: 'web-development',
    level: 'beginner',
    price: 99.99,
    currency: 'USD',
    duration: 40,
    lessonsCount: 250,
    language: 'en',
    instructor: 'John Smith',
    status: 'published',
    isFeatured: true,
    isBestseller: true,
    enrolledStudents: 15420,
    rating: 4.8,
    reviewsCount: 3250,
    tags: ['Web Development', 'JavaScript', 'React', 'Node.js'],
    requirements: ['Basic computer skills', 'Internet connection'],
    whatYouWillLearn: ['Build responsive websites', 'Master JavaScript', 'Create full-stack applications'],
    certificateOffered: true,
    hasLifetimeAccess: true,
    publishedDate: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'iOS App Development with Swift',
    slug: 'ios-app-development-swift',
    description: 'Build professional iOS applications using Swift and SwiftUI.',
    shortDescription: 'Create stunning iOS apps from scratch',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
    category: 'mobile-development',
    level: 'intermediate',
    price: 129.99,
    currency: 'USD',
    duration: 35,
    lessonsCount: 180,
    language: 'en',
    instructor: 'Sarah Johnson',
    status: 'published',
    isFeatured: false,
    isBestseller: true,
    enrolledStudents: 8750,
    rating: 4.7,
    reviewsCount: 1890,
    tags: ['iOS', 'Swift', 'Mobile Development', 'SwiftUI'],
    requirements: ['Mac computer', 'Basic programming knowledge'],
    whatYouWillLearn: ['Build iOS apps', 'Master Swift', 'Publish to App Store'],
    certificateOffered: true,
    hasLifetimeAccess: true,
    publishedDate: '2024-02-01T10:00:00Z',
    createdAt: '2024-01-25T08:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
  },
];

const CoursesManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<CourseFilter>({});
  const [sortBy, setSortBy] = useState<CourseSortBy>('createdAt');
  const [sortOrder, setSortOrder] = useState<CourseSortOrder>('desc');

  // Load courses from localStorage
  useEffect(() => {
    const savedCourses = localStorage.getItem('courses');
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    } else {
      // Initialize with mock data
      setCourses(mockCourses);
    }
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = filterCourses(courses, filter);
    result = sortCourses(result, sortBy, sortOrder);
    setFilteredCourses(result);
  }, [courses, filter, sortBy, sortOrder]);

  const handleSaveCourses = () => {
    localStorage.setItem('courses', JSON.stringify(courses));
  };

  const handleAddCourse = (course: Course) => {
    setCourses([...courses, course]);
    setShowForm(false);
    handleSaveCourses();
  };

  const handleUpdateCourse = (course: Course) => {
    setCourses(courses.map(c => c.id === course.id ? course : c));
    setEditingCourse(null);
    setShowForm(false);
    handleSaveCourses();
  };

  const handleDeleteCourse = (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(c => c.id !== courseId));
      handleSaveCourses();
    }
  };

  const handleToggleFeatured = (courseId: string) => {
    setCourses(courses.map(c => 
      c.id === courseId ? { ...c, isFeatured: !c.isFeatured } : c
    ));
    handleSaveCourses();
  };

  const handleToggleBestseller = (courseId: string) => {
    setCourses(courses.map(c => 
      c.id === courseId ? { ...c, isBestseller: !c.isBestseller } : c
    ));
    handleSaveCourses();
  };

  const handleChangeStatus = (courseId: string, status: Course['status']) => {
    setCourses(courses.map(c => 
      c.id === courseId ? { ...c, status } : c
    ));
    handleSaveCourses();
  };

  const stats = getCourseStats(courses);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Courses Management
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Create and manage online courses and learning content
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setEditingCourse(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
            >
              <IconPlus className="w-4 h-4" />
              Add Course
            </button>
            <button
              type="button"
              onClick={handleSaveCourses}
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
        <CourseStats stats={stats} />
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 mb-6">
        <CourseFilters
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
        {/* Courses List */}
        <div className={`${showForm ? 'lg:col-span-8' : 'lg:col-span-12'} flex flex-col min-h-0`}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden">
            <div className="flex-shrink-0 p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Courses
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} found
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {filteredCourses.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center animate-pulse">
                      <IconBook className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg">📚</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                    {courses.length === 0 ? 'No courses yet' : 'No courses found'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md leading-relaxed">
                    {courses.length === 0 
                      ? 'Start creating educational content by adding your first course. Share your knowledge with students worldwide!'
                      : 'Try adjusting your filters to find what you\'re looking for.'
                    }
                  </p>
                  {courses.length === 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCourse(null);
                        setShowForm(true);
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                    >
                      <IconPlus className="w-5 h-5" />
                      Add Your First Course
                    </button>
                  )}
                </div>
              ) : (
                <CourseList
                  courses={filteredCourses}
                  onEdit={(course) => {
                    setEditingCourse(course);
                    setShowForm(true);
                  }}
                  onDelete={handleDeleteCourse}
                  onToggleFeatured={handleToggleFeatured}
                  onToggleBestseller={handleToggleBestseller}
                  onChangeStatus={handleChangeStatus}
                />
              )}
            </div>
          </div>
        </div>

        {/* Course Form */}
        {showForm && (
          <div className="lg:col-span-4 flex flex-col min-h-0 animate-in slide-in-from-right duration-300">
            <CourseForm
              course={editingCourse}
              onSave={editingCourse ? handleUpdateCourse : handleAddCourse}
              onCancel={() => {
                setShowForm(false);
                setEditingCourse(null);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesManagement;
