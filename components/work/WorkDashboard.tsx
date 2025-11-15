import React, { useState, useRef, useEffect } from 'react';
import { useWork } from '../../context/WorkContext';
import { useAuth } from '../../context/AuthContext';
import { 
  CheckCircle, Clock, AlertCircle, TrendingUp, 
  Folder, Calendar, ArrowUpRight, Zap, Target, Activity,
  Plus, Users, BarChart, Download, ChevronDown, ArrowRight
} from 'lucide-react';
import { isTaskOverdue } from '../../utils/workHelpers';

export const WorkDashboard: React.FC = () => {
  const { tasks, projects, stats, addTask, addProject } = useWork();
  const { currentUser } = useAuth();
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const quickActionsRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target as Node)) {
        setIsQuickActionsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <div className="space-y-6 animate-fadeIn">
      {/* Sleeker Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            Welcome back, {currentUser?.fullName || 'User'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="hidden lg:block relative" ref={quickActionsRef}>
          <button 
            onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            type="button"
          >
            <Plus className="w-4 h-4" />
            Quick Actions
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isQuickActionsOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Quick Actions Dropdown */}
          {isQuickActionsOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 animate-fadeIn">
              {/* Create Section */}
              <div className="px-3 py-2">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Create New
                </p>
                <button
                  onClick={() => {
                    const title = prompt('Enter task title:');
                    if (title) {
                      addTask({
                        title,
                        description: '',
                        projectId: projects[0]?.id || '',
                        assigneeId: currentUser?.id || '',
                        creatorId: currentUser?.id || '',
                        priority: 'medium',
                        status: 'todo',
                        tags: [],
                        dueDate: '',
                        estimatedHours: 0,
                        actualHours: 0,
                        attachments: [],
                        comments: [],
                        subtasks: [],
                        dependencies: []
                      });
                      setIsQuickActionsOpen(false);
                    }
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors group"
                  type="button"
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">New Task</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Create a new task</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    const name = prompt('Enter project name:');
                    if (name) {
                      addProject({
                        name,
                        description: '',
                        color: '#3B82F6',
                        icon: '📁',
                        status: 'active',
                        startDate: new Date().toISOString().split('T')[0],
                        endDate: '',
                        ownerId: currentUser?.id || '',
                        teamMembers: [currentUser?.id || ''],
                        tags: [],
                        budget: 0
                      });
                      setIsQuickActionsOpen(false);
                    }
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors group"
                  type="button"
                >
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <Folder className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">New Project</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Start a new project</p>
                  </div>
                </button>
              </div>

              <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />

              {/* View Section */}
              <div className="px-3 py-2">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Quick Views
                </p>
                <button
                  onClick={() => {
                    setIsQuickActionsOpen(false);
                    // Navigate to tasks view filtered by overdue
                    alert('Navigate to overdue tasks view');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
                  type="button"
                >
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">Overdue Tasks</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{myOverdueTasks.length} tasks need attention</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setIsQuickActionsOpen(false);
                    alert('Navigate to this week\'s tasks');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors group"
                  type="button"
                >
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">This Week</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{myTasksDueThisWeek.length} tasks due soon</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setIsQuickActionsOpen(false);
                    alert('Navigate to team view');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors group"
                  type="button"
                >
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">Team Activity</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">View team progress</p>
                  </div>
                </button>
              </div>

              <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />

              {/* Reports Section */}
              <div className="px-3 py-2">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Reports & Export
                </p>
                <button
                  onClick={() => {
                    setIsQuickActionsOpen(false);
                    alert('Generate weekly report');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors group"
                  type="button"
                >
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <BarChart className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">Weekly Report</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Generate summary</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setIsQuickActionsOpen(false);
                    // Export tasks to CSV
                    const csv = tasks.map(t => `${t.title},${t.status},${t.priority},${t.dueDate}`).join('\n');
                    const blob = new Blob([`Title,Status,Priority,Due Date\n${csv}`], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'tasks-export.csv';
                    a.click();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded-lg transition-colors group"
                  type="button"
                >
                  <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <Download className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">Export Tasks</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Download as CSV</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sleeker Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md"
          >
            {/* Subtle Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} ${stat.darkBgGradient} opacity-30 dark:opacity-20`} />
            
            {/* Content */}
            <div className="relative p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} shadow-sm`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              
              {/* Compact Trend */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">{stat.subtitle}</span>
                <div className={`flex items-center gap-0.5 font-medium ${
                  stat.trendUp 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  <ArrowUpRight className={`w-3 h-3 ${!stat.trendUp ? 'rotate-90' : ''}`} />
                  {stat.trend}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Compact Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {quickStats.map((stat, index) => (
          <div 
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/60 dark:border-gray-700/60 p-4 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className={`${stat.iconBg} p-3 rounded-lg`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {stat.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Priority Distribution - Takes 1 column */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/60 dark:border-gray-700/60 p-5 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Priority Distribution
            </h3>
            <div className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs font-medium text-gray-600 dark:text-gray-400">
              {stats.totalTasks}
            </div>
          </div>
          <div className="space-y-3">
            {Object.entries(stats.tasksByPriority).map(([priority, count]) => {
              const total = stats.totalTasks;
              const percentage = total > 0 ? (count / total) * 100 : 0;
              const colors: Record<string, { dot: string; bar: string }> = {
                urgent: { 
                  dot: 'bg-red-500',
                  bar: 'bg-red-500'
                },
                high: { 
                  dot: 'bg-orange-500',
                  bar: 'bg-orange-500'
                },
                medium: { 
                  dot: 'bg-yellow-500',
                  bar: 'bg-yellow-500'
                },
                low: { 
                  dot: 'bg-gray-400',
                  bar: 'bg-gray-400'
                }
              };
              
              return (
                <div key={priority}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${colors[priority].dot}`} />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">
                        {priority}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                      {count}
                    </span>
                  </div>
                  <div className="relative w-full bg-gray-100 dark:bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`${colors[priority].bar} h-1.5 rounded-full transition-all duration-500 ease-out`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Tasks - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md">
          <div className="px-5 py-4 border-b border-gray-200/60 dark:border-gray-700/60">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Recent Tasks
              </h3>
              <button 
                className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                type="button"
              >
                View all
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {recentTasks.length === 0 ? (
              <div className="p-10 text-center">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">No tasks yet</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Create your first task to get started</p>
              </div>
            ) : (
              recentTasks.map(task => {
                const project = projects.find(p => p.id === task.projectId);
                const priorityDots: Record<string, string> = {
                  urgent: 'bg-red-500',
                  high: 'bg-orange-500',
                  medium: 'bg-yellow-500',
                  low: 'bg-gray-400'
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
                    className="px-5 py-3.5 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${priorityDots[task.priority]}`} />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate mb-1">
                            {task.title}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            {project && (
                              <span className="flex items-center gap-1">
                                <Folder className="w-3 h-3" />
                                <span className="truncate">{project.name}</span>
                              </span>
                            )}
                            {task.dueDate && (
                              <span className={`flex items-center gap-1 ${isTaskOverdue(task) ? 'text-red-600 dark:text-red-400 font-medium' : ''}`}>
                                <Calendar className="w-3 h-3" />
                                {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap ${statusColors[task.status]}`}>
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
