import React, { useState, useEffect } from 'react';
import { Activity, ActivityFilter, ActivitySortBy, ActivitySortOrder } from '../../types/activity';
import { filterActivities, sortActivities, getActivityStats } from '../../utils/activityHelpers';
import ActivitiesList from './ActivitiesList';
import ActivityForm from './ActivityForm';
import ActivityFilters from './ActivityFilters';
import ActivityStats from './ActivityStats';
import { IconPlus, IconSave, IconActivity } from '../Icons';

const ActivitiesManagement: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<ActivityFilter>({});
  const [sortBy, setSortBy] = useState<ActivitySortBy>('startDate');
  const [sortOrder, setSortOrder] = useState<ActivitySortOrder>('desc');

  // Load activities from localStorage
  useEffect(() => {
    const savedActivities = localStorage.getItem('activities');
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    }
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = filterActivities(activities, filter);
    result = sortActivities(result, sortBy, sortOrder);
    setFilteredActivities(result);
  }, [activities, filter, sortBy, sortOrder]);

  const handleSaveActivities = () => {
    localStorage.setItem('activities', JSON.stringify(activities));
  };

  const handleAddActivity = (activity: Activity) => {
    setActivities([...activities, activity]);
    setShowForm(false);
    handleSaveActivities();
  };

  const handleUpdateActivity = (activity: Activity) => {
    setActivities(activities.map(a => a.id === activity.id ? activity : a));
    setEditingActivity(null);
    setShowForm(false);
    handleSaveActivities();
  };

  const handleDeleteActivity = (activityId: string) => {
    setActivities(activities.filter(a => a.id !== activityId));
    handleSaveActivities();
  };

  const handleToggleFeatured = (activityId: string) => {
    setActivities(activities.map(a => 
      a.id === activityId ? { ...a, isFeatured: !a.isFeatured } : a
    ));
    handleSaveActivities();
  };

  const handleChangeStatus = (activityId: string, status: Activity['status']) => {
    setActivities(activities.map(a => 
      a.id === activityId ? { ...a, status } : a
    ));
    handleSaveActivities();
  };

  const stats = getActivityStats(activities);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Activities Management
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage company events, meetings, and activities
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setEditingActivity(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
            >
              <IconPlus className="w-4 h-4" />
              Add Activity
            </button>
            <button
              onClick={handleSaveActivities}
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
        <ActivityStats stats={stats} />
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 mb-6">
        <ActivityFilters
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
        {/* Activities List */}
        <div className={`${showForm ? 'lg:col-span-7' : 'lg:col-span-12'} flex flex-col min-h-0`}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden">
            <div className="flex-shrink-0 p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Activities
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'} found
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {filteredActivities.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-4">
                    <IconActivity className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {activities.length === 0 ? 'No activities yet' : 'No activities found'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-sm">
                    {activities.length === 0 
                      ? 'Start organizing by adding your first activity.'
                      : 'Try adjusting your filters to find what you\'re looking for.'
                    }
                  </p>
                  {activities.length === 0 && (
                    <button
                      onClick={() => {
                        setEditingActivity(null);
                        setShowForm(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <IconPlus className="w-4 h-4" />
                      Add Your First Activity
                    </button>
                  )}
                </div>
              ) : (
                <ActivitiesList
                  activities={filteredActivities}
                  onEdit={(activity) => {
                    setEditingActivity(activity);
                    setShowForm(true);
                  }}
                  onDelete={handleDeleteActivity}
                  onToggleFeatured={handleToggleFeatured}
                  onChangeStatus={handleChangeStatus}
                />
              )}
            </div>
          </div>
        </div>

        {/* Activity Form */}
        {showForm && (
          <div className="lg:col-span-5 flex flex-col min-h-0 animate-in slide-in-from-right duration-300">
            <ActivityForm
              activity={editingActivity}
              onSave={editingActivity ? handleUpdateActivity : handleAddActivity}
              onCancel={() => {
                setShowForm(false);
                setEditingActivity(null);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitiesManagement;
