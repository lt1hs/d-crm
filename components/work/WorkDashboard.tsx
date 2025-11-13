import React from 'react';
import { useWork } from '../../context/WorkContext';
import { useAuth } from '../../context/AuthContext';
import { 
  CheckCircle, Clock, AlertCircle, TrendingUp, 
  Folder, Users, BarChart3, Calendar 
} from 'lucide-react';
import { isTaskOverdue } from '../../utils/workHelpers';

export const WorkDashboard: React.FC = () => {
  const { tasks, projects, stats } = useWork();
  const { currentUser } = useAuth();

  const myTasks = tasks.filter(t => t.assigneeId === currentUser?.id);
  const myOverdueTasks = myTasks.filter(isTaskOverdue);
  const myTasksDueThisWeek = myTasks.filter(t => {
    if (!t.dueDate) return false;
    const dueDate = new Date(t.dueDate);
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return dueDate >= today && dueDate <= weekFromNow;
  });

  const statCards = [
    {
      title: 'My Tasks',
      value: myTasks.length,
      subtitle: `${myTasks.filter(t => t.status === 'completed').length} completed`,
      icon: CheckCircle,
      color: 'bg-blue-500',
      trend: '+12%'
    },
    {
      title: 'In Progress',
      value: stats.inProgressTasks,
      subtitle: 'Active tasks',
      icon: Clock,
      color: 'bg-purple-500',
      trend: '+5%'
    },
    {
      title: 'Overdue',
      value: myOverdueTasks.length,
      subtitle: 'Need attention',
      icon: AlertCircle,
      color: 'bg-red-500',
      trend: '-3%'
    },
    {
      title: 'Completion Rate',
      value: `${Math.round(stats.completionRate)}%`,
      subtitle: 'This month',
      icon: TrendingUp,
      color: 'bg-green-500',
      trend: '+8%'
    }
  ];

  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Work Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {currentUser?.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">{stat.trend}</span>
              <span className="text-gray-500 ml-2">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Folder className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Active Projects</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.activeProjects}</p>
          <p className="text-sm text-gray-500 mt-1">of {stats.totalProjects} total</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Hours Logged</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalHoursLogged.toFixed(1)}</p>
          <p className="text-sm text-gray-500 mt-1">This month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Due This Week</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{myTasksDueThisWeek.length}</p>
          <p className="text-sm text-gray-500 mt-1">Tasks to complete</p>
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Tasks by Priority</h3>
        <div className="space-y-3">
          {Object.entries(stats.tasksByPriority).map(([priority, count]) => {
            const total = stats.totalTasks;
            const percentage = total > 0 ? (count / total) * 100 : 0;
            const colors: Record<string, string> = {
              urgent: 'bg-red-500',
              high: 'bg-orange-500',
              medium: 'bg-yellow-500',
              low: 'bg-gray-400'
            };
            
            return (
              <div key={priority}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="capitalize text-gray-700">{priority}</span>
                  <span className="text-gray-600">{count} tasks</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${colors[priority]} h-2 rounded-full transition-all`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Recent Tasks</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentTasks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No tasks yet. Create your first task to get started!
            </div>
          ) : (
            recentTasks.map(task => {
              const project = projects.find(p => p.id === task.projectId);
              return (
                <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          task.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                          task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                        {project && (
                          <span className="flex items-center gap-1">
                            <Folder className="w-4 h-4" />
                            {project.name}
                          </span>
                        )}
                        {task.dueDate && (
                          <span className={isTaskOverdue(task) ? 'text-red-600' : ''}>
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.status === 'completed' ? 'bg-green-100 text-green-700' :
                      task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                      task.status === 'blocked' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {task.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
