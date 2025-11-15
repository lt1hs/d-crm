import React, { useState } from 'react';
import { useWork } from '../../context/WorkContext';
import { useAuth } from '../../context/AuthContext';
import { Clock, Calendar, TrendingUp, BarChart3, Activity } from 'lucide-react';
import { formatDuration } from '../../utils/workHelpers';

export const TimeTracking: React.FC = () => {
  const { timeEntries, tasks, projects } = useWork();
  const { currentUser } = useAuth();
  const [dateRange, setDateRange] = useState('week');

  const myTimeEntries = timeEntries.filter(e => e.userId === currentUser?.id);
  const totalHours = myTimeEntries.reduce((acc, entry) => acc + entry.hours, 0);

  // Group by date
  const entriesByDate = myTimeEntries.reduce((acc, entry) => {
    const date = new Date(entry.date).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, typeof timeEntries>);

  // Group by project
  const entriesByProject = myTimeEntries.reduce((acc, entry) => {
    const task = tasks.find(t => t.id === entry.taskId);
    if (task) {
      const projectId = task.projectId;
      if (!acc[projectId]) acc[projectId] = 0;
      acc[projectId] += entry.hours;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Sleeker Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Time Tracking</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {myTimeEntries.length} entries · {formatDuration(totalHours)} logged
          </p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          aria-label="Select date range"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Sleeker Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/60 dark:border-gray-700/60 p-5 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Hours</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{formatDuration(totalHours)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Logged this period</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/60 dark:border-gray-700/60 p-5 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Entries</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{myTimeEntries.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Time logs recorded</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/60 dark:border-gray-700/60 p-5 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Average/Day</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {formatDuration(totalHours / Math.max(Object.keys(entriesByDate).length, 1))}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Daily average</p>
        </div>
      </div>

      {/* Time by Project */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/60 dark:border-gray-700/60 p-5 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Time by Project
        </h3>
        <div className="space-y-3">
          {Object.entries(entriesByProject).length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No project data available</p>
          ) : (
            Object.entries(entriesByProject).map(([projectId, hours]) => {
              const project = projects.find(p => p.id === projectId);
              if (!project) return null;
              
              const percentage = (hours / totalHours) * 100;
              
              return (
                <div key={projectId}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                      <span className="text-gray-900 dark:text-gray-100 font-medium">{project.name}</span>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 font-semibold">{formatDuration(hours)}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: project.color
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Recent Time Entries */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all">
        <div className="px-5 py-4 border-b border-gray-200/60 dark:border-gray-700/60">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Recent Time Entries</h3>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
          {myTimeEntries.slice(0, 10).map(entry => {
            const task = tasks.find(t => t.id === entry.taskId);
            const project = task ? projects.find(p => p.id === task.projectId) : null;
            
            return (
              <div key={entry.id} className="px-5 py-3.5 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {project && (
                        <div 
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: project.color }}
                        />
                      )}
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {task?.title || 'Unknown Task'}
                      </h4>
                    </div>
                    {entry.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1.5 line-clamp-1">{entry.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                      {project && (
                        <span className="truncate">{project.name}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-base font-bold text-gray-900 dark:text-gray-100">{formatDuration(entry.hours)}</div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {myTimeEntries.length === 0 && (
            <div className="p-10 text-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">No time entries yet</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Start logging time on your tasks</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
