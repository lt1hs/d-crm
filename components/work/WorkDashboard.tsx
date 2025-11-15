import React from 'react';
import { useWork } from '../../context/WorkContext';
import { useAuth } from '../../context/AuthContext';
import { 
  CheckCircle, Clock, AlertCircle, TrendingUp, 
  Folder, Calendar, ArrowUpRight, Zap, Target, Activity
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

  const completedTasks = myTasks.filter(t => t.status === 'completed').length;

  const statCards = [
    {
      title: 'My Tasks',
      value: myTasks.length,
      subtitle: `${completedTasks} completed`,
      icon: CheckCircle,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      darkBgGradient: 'dark:from-blue-900/20 dark:to-blue-800/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'In Progress',
      value: stats.inProgressTasks,
      subtitle: 'Active tasks',
      icon: Clock,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      darkBgGradient: 'dark:from-purple-900/20 dark:to-purple-800/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      trend: '+5%',
      trendUp: true
    },
    {
      title: 'Overdue',
      value: myOverdueTasks.length,
      subtitle: 'Need attention',
      icon: AlertCircle,
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-50 to-red-100',
      darkBgGradient: 'dark:from-red-900/20 dark:to-red-800/20',
      iconColor: 'text-red-600 dark:text-red-400',
      trend: '-3%',
      trendUp: false
    },
    {
      title: 'Completion Rate',
      value: `${Math.round(stats.completionRate)}%`,
      subtitle: 'This month',
      icon: TrendingUp,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      darkBgGradient: 'dark:from-green-900/20 dark:to-green-800/20',
      iconColor: 'text-green-600 dark:text-green-400',
      trend: '+8%',
      trendUp: true
    }
  ];

  const quickStats = [
    {
      title: 'Active Projects',
      value: stats.activeProjects,
      subtitle: `of ${stats.totalProjects} total`,
      icon: Folder,
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
      iconColor: 'text-indigo-600 dark:text-indigo-400'
    },
    {
      title: 'Hours Logged',
      value: stats.totalHoursLogged.toFixed(1),
      subtitle: 'This month',
      icon: Activity,
      iconBg: 'bg-cyan-100 dark:bg-cyan-900/30',
      iconColor: 'text-cyan-600 dark:text-cyan-400'
    },
    {
      title: 'Due This Week',
      value: myTasksDueThisWeek.length,
      subtitle: 'Tasks to complete',
      icon: Calendar,
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600 dark:text-amber-400'
    }
  ];

  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header with Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome back, {currentUser?.fullName || 'User'}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            Here's what's happening with your work today
          </p>
        </div>
        <button className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg">
          <Target className="w-4 h-4" />
          Quick Actions
        </button>
      </div>

      {/* Main Stats Grid - Enhanced Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:-translate-y-1"
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} ${stat.darkBgGradient} opacity-50 dark:opacity-30`} />
            
            {/* Content */}
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.subtitle}
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              
              {/* Trend Indicator */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
                  stat.trendUp 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                }`}>
                  <ArrowUpRight className={`w-3 h-3 ${!stat.trendUp ? 'rotate-90' : ''}`} />
                  {stat.trend}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">vs last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => (
          <div 
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-4">
              <div className={`${stat.iconBg} p-4 rounded-xl`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stat.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Distribution - Takes 1 column */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Tasks by Priority
            </h3>
            <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400">
              {stats.totalTasks} total
            </div>
          </div>
          <div className="space-y-4">
            {Object.entries(stats.tasksByPriority).map(([priority, count]) => {
              const total = stats.totalTasks;
              const percentage = total > 0 ? (count / total) * 100 : 0;
              const colors: Record<string, { bg: string; text: string; bar: string }> = {
                urgent: { 
                  bg: 'bg-red-100 dark:bg-red-900/30', 
                  text: 'text-red-700 dark:text-red-400',
                  bar: 'bg-gradient-to-r from-red-500 to-red-600'
                },
                high: { 
                  bg: 'bg-orange-100 dark:bg-orange-900/30', 
                  text: 'text-orange-700 dark:text-orange-400',
                  bar: 'bg-gradient-to-r from-orange-500 to-orange-600'
                },
                medium: { 
                  bg: 'bg-yellow-100 dark:bg-yellow-900/30', 
                  text: 'text-yellow-700 dark:text-yellow-400',
                  bar: 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                },
                low: { 
                  bg: 'bg-gray-100 dark:bg-gray-700', 
                  text: 'text-gray-700 dark:text-gray-400',
                  bar: 'bg-gradient-to-r from-gray-400 to-gray-500'
                }
              };
              
              return (
                <div key={priority} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${colors[priority].bg} ${colors[priority].text}`}>
                        {priority}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {count}
                    </span>
                  </div>
                  <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`${colors[priority].bar} h-2.5 rounded-full transition-all duration-500 ease-out shadow-sm`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Tasks - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Recent Tasks
              </h3>
              <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                View all →
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentTasks.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-2">No tasks yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Create your first task to get started!</p>
              </div>
            ) : (
              recentTasks.map(task => {
                const project = projects.find(p => p.id === task.projectId);
                const priorityColors: Record<string, string> = {
                  urgent: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
                  high: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
                  medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
                  low: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600'
                };
                const statusColors: Record<string, string> = {
                  completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
                  'in-progress': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
                  blocked: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
                  todo: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                };
                
                return (
                  <div 
                    key={task.id} 
                    className="p-5 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                            {task.title}
                          </h4>
                          <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold border flex-shrink-0 ${priorityColors[task.priority]}`}>
                            {task.priority}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          {project && (
                            <span className="flex items-center gap-1.5">
                              <Folder className="w-4 h-4" />
                              <span className="truncate">{project.name}</span>
                            </span>
                          )}
                          {task.dueDate && (
                            <span className={`flex items-center gap-1.5 ${isTaskOverdue(task) ? 'text-red-600 dark:text-red-400 font-medium' : ''}`}>
                              <Calendar className="w-4 h-4" />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${statusColors[task.status]}`}>
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
    </div>
  );
};
