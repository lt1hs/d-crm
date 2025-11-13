import React, { useState } from 'react';
import { useWork } from '../../context/WorkContext';
import { useAuth } from '../../context/AuthContext';
import { Clock, Calendar, TrendingUp, BarChart3 } from 'lucide-react';
import { formatDuration } from '../../utils/workHelpers';

export const TimeTracking: React.FC = () => {
  const { timeEntries, tasks, projects } = useWork();
  const { users, currentUser } = useAuth();
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Time Tracking</h2>
          <p className="text-gray-600 mt-1">Track and analyze your work hours</p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Total Hours</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatDuration(totalHours)}</p>
          <p className="text-sm text-gray-500 mt-1">Logged this period</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Entries</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{myTimeEntries.length}</p>
          <p className="text-sm text-gray-500 mt-1">Time logs recorded</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Average/Day</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {formatDuration(totalHours / Math.max(Object.keys(entriesByDate).length, 1))}
          </p>
          <p className="text-sm text-gray-500 mt-1">Daily average</p>
        </div>
      </div>

      {/* Time by Project */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Time by Project
        </h3>
        <div className="space-y-3">
          {Object.entries(entriesByProject).map(([projectId, hours]) => {
            const project = projects.find(p => p.id === projectId);
            if (!project) return null;
            
            const percentage = (hours / totalHours) * 100;
            
            return (
              <div key={projectId}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${project.color}`} />
                    <span className="text-gray-900">{project.name}</span>
                  </div>
                  <span className="text-gray-600 font-medium">{formatDuration(hours)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${project.color} h-2 rounded-full transition-all`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Time Entries */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Recent Time Entries</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {myTimeEntries.slice(0, 10).map(entry => {
            const task = tasks.find(t => t.id === entry.taskId);
            const project = task ? projects.find(p => p.id === task.projectId) : null;
            
            return (
              <div key={entry.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {project && (
                        <div className={`w-3 h-3 rounded-full ${project.color}`} />
                      )}
                      <h4 className="font-medium text-gray-900">{task?.title || 'Unknown Task'}</h4>
                    </div>
                    {entry.description && (
                      <p className="text-sm text-gray-600 mb-2">{entry.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{new Date(entry.date).toLocaleDateString()}</span>
                      {project && <span>{project.name}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{formatDuration(entry.hours)}</div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {myTimeEntries.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No time entries yet. Start logging time on your tasks!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
