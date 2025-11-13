import React, { useState, useEffect } from 'react';
import { Video, VideoFilter, VideoSortBy, VideoSortOrder } from '../../types/video';
import { filterVideos, sortVideos, getVideoStats } from '../../utils/videoHelpers';
import VideoList from './VideoList';
import VideoForm from './VideoForm';
import VideoFilters from './VideoFilters';
import VideoStats from './VideoStats';
import { IconPlus, IconSave, IconVideo } from '../Icons';

// Mock initial videos
const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Introduction to Digital Marketing Strategies',
    slug: 'introduction-to-digital-marketing-strategies',
    description: 'Learn the fundamentals of digital marketing and how to create effective campaigns for your business.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    videoUrl: 'https://youtube.com/watch?v=example1',
    embedUrl: 'https://youtube.com/embed/example1',
    category: 'marketing',
    type: 'tutorial',
    status: 'published',
    isFeatured: true,
    isPublic: true,
    presenter: 'Sarah Johnson',
    department: 'Marketing',
    duration: 1845, // 30:45
    publishDate: '2024-01-15',
    recordedDate: '2024-01-10',
    quality: '1080p',
    platform: 'youtube',
    language: 'en',
    tags: ['marketing', 'digital', 'strategy', 'tutorial'],
    views: 12450,
    likes: 892,
    comments: 156,
    shares: 234,
    playlist: 'Marketing Essentials',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Annual Tech Conference 2024 Keynote',
    slug: 'annual-tech-conference-2024-keynote',
    description: 'Watch the inspiring keynote presentation from our annual technology conference featuring industry leaders.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    videoUrl: 'https://vimeo.com/example2',
    category: 'events',
    type: 'event',
    status: 'published',
    isFeatured: false,
    isPublic: true,
    presenter: 'Dr. Michael Chen',
    department: 'Technology',
    duration: 3600, // 1:00:00
    publishDate: '2024-02-01',
    recordedDate: '2024-01-28',
    quality: '4k',
    platform: 'vimeo',
    language: 'en',
    tags: ['conference', 'technology', 'keynote', 'innovation'],
    views: 8920,
    likes: 654,
    comments: 89,
    shares: 145,
    createdAt: '2024-01-28T08:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
  },
];

const VideosManagement: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<VideoFilter>({});
  const [sortBy, setSortBy] = useState<VideoSortBy>('publishDate');
  const [sortOrder, setSortOrder] = useState<VideoSortOrder>('desc');

  // Load videos from localStorage
  useEffect(() => {
    const savedVideos = localStorage.getItem('videos');
    if (savedVideos) {
      setVideos(JSON.parse(savedVideos));
    } else {
      // Initialize with mock data
      setVideos(mockVideos);
    }
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = filterVideos(videos, filter);
    result = sortVideos(result, sortBy, sortOrder);
    setFilteredVideos(result);
  }, [videos, filter, sortBy, sortOrder]);

  const handleSaveVideos = () => {
    localStorage.setItem('videos', JSON.stringify(videos));
  };

  const handleAddVideo = (video: Video) => {
    setVideos([...videos, video]);
    setShowForm(false);
    handleSaveVideos();
  };

  const handleUpdateVideo = (video: Video) => {
    setVideos(videos.map(v => v.id === video.id ? video : v));
    setEditingVideo(null);
    setShowForm(false);
    handleSaveVideos();
  };

  const handleDeleteVideo = (videoId: string) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      setVideos(videos.filter(v => v.id !== videoId));
      handleSaveVideos();
    }
  };

  const handleToggleFeatured = (videoId: string) => {
    setVideos(videos.map(v => 
      v.id === videoId ? { ...v, isFeatured: !v.isFeatured } : v
    ));
    handleSaveVideos();
  };

  const handleChangeStatus = (videoId: string, status: Video['status']) => {
    setVideos(videos.map(v => 
      v.id === videoId ? { ...v, status } : v
    ));
    handleSaveVideos();
  };

  const stats = getVideoStats(videos);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Video Library
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage educational videos, webinars, and multimedia content
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setEditingVideo(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm hover:shadow-md"
            >
              <IconPlus className="w-4 h-4" />
              Add Video
            </button>
            <button
              type="button"
              onClick={handleSaveVideos}
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
        <VideoStats stats={stats} />
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 mb-6">
        <VideoFilters
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
        {/* Videos List */}
        <div className={`${showForm ? 'lg:col-span-8' : 'lg:col-span-12'} flex flex-col min-h-0`}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden">
            <div className="flex-shrink-0 p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Videos
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {filteredVideos.length} {filteredVideos.length === 1 ? 'video' : 'videos'} found
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {filteredVideos.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mb-4">
                    <IconVideo className="w-10 h-10 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {videos.length === 0 ? 'No videos yet' : 'No videos found'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-sm">
                    {videos.length === 0 
                      ? 'Start building your video library by adding your first video.'
                      : 'Try adjusting your filters to find what you\'re looking for.'
                    }
                  </p>
                  {videos.length === 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingVideo(null);
                        setShowForm(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <IconPlus className="w-4 h-4" />
                      Add Your First Video
                    </button>
                  )}
                </div>
              ) : (
                <VideoList
                  videos={filteredVideos}
                  onEdit={(video) => {
                    setEditingVideo(video);
                    setShowForm(true);
                  }}
                  onDelete={handleDeleteVideo}
                  onToggleFeatured={handleToggleFeatured}
                  onChangeStatus={handleChangeStatus}
                />
              )}
            </div>
          </div>
        </div>

        {/* Video Form */}
        {showForm && (
          <div className="lg:col-span-4 flex flex-col min-h-0 animate-in slide-in-from-right duration-300">
            <VideoForm
              video={editingVideo}
              onSave={editingVideo ? handleUpdateVideo : handleAddVideo}
              onCancel={() => {
                setShowForm(false);
                setEditingVideo(null);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideosManagement;
