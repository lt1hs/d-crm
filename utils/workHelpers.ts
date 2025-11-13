import { Task, Project, TaskStatus, TaskPriority, WorkStats, TimeEntry } from '../types/work';

export const getTaskStatusColor = (status: TaskStatus): string => {
  const colors: Record<TaskStatus, string> = {
    'todo': 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'review': 'bg-purple-100 text-purple-800',
    'blocked': 'bg-red-100 text-red-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-gray-100 text-gray-500'
  };
  return colors[status];
};

export const getTaskPriorityColor = (priority: TaskPriority): string => {
  const colors: Record<TaskPriority, string> = {
    'low': 'bg-gray-100 text-gray-600',
    'medium': 'bg-yellow-100 text-yellow-700',
    'high': 'bg-orange-100 text-orange-700',
    'urgent': 'bg-red-100 text-red-700'
  };
  return colors[priority];
};

export const isTaskOverdue = (task: Task): boolean => {
  if (!task.dueDate || task.status === 'completed' || task.status === 'cancelled') {
    return false;
  }
  return new Date(task.dueDate) < new Date();
};

export const calculateTaskProgress = (task: Task): number => {
  if (task.subtasks.length === 0) return 0;
  const completed = task.subtasks.filter(st => st.completed).length;
  return Math.round((completed / task.subtasks.length) * 100);
};

export const calculateWorkStats = (tasks: Task[], projects: Project[], timeEntries: TimeEntry[]): WorkStats => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const overdueTasks = tasks.filter(isTaskOverdue).length;
  
  const tasksByPriority = {
    low: tasks.filter(t => t.priority === 'low').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    high: tasks.filter(t => t.priority === 'high').length,
    urgent: tasks.filter(t => t.priority === 'urgent').length
  };

  const tasksByStatus = {
    'todo': tasks.filter(t => t.status === 'todo').length,
    'in-progress': inProgressTasks,
    'review': tasks.filter(t => t.status === 'review').length,
    'blocked': tasks.filter(t => t.status === 'blocked').length,
    'completed': completedTasks,
    'cancelled': tasks.filter(t => t.status === 'cancelled').length
  };

  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const completedTasksWithDates = tasks.filter(t => 
    t.status === 'completed' && t.startDate && t.completedDate
  );
  
  const averageCompletionTime = completedTasksWithDates.length > 0
    ? completedTasksWithDates.reduce((acc, task) => {
        const start = new Date(task.startDate!).getTime();
        const end = new Date(task.completedDate!).getTime();
        return acc + (end - start) / (1000 * 60 * 60 * 24); // days
      }, 0) / completedTasksWithDates.length
    : 0;

  const totalHoursLogged = timeEntries.reduce((acc, entry) => acc + entry.hours, 0);

  return {
    totalTasks,
    completedTasks,
    inProgressTasks,
    overdueTasks,
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    totalHoursLogged,
    tasksByPriority,
    tasksByStatus,
    completionRate,
    averageCompletionTime
  };
};

export const filterTasks = (tasks: Task[], filters: any): Task[] => {
  return tasks.filter(task => {
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !task.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.projectId && filters.projectId !== 'all' && task.projectId !== filters.projectId) {
      return false;
    }
    if (filters.assigneeId && filters.assigneeId !== 'all' && task.assigneeId !== filters.assigneeId) {
      return false;
    }
    if (filters.priority && filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }
    if (filters.status && filters.status !== 'all' && task.status !== filters.status) {
      return false;
    }
    if (filters.tags && filters.tags.length > 0) {
      const hasTag = filters.tags.some((tag: string) => task.tags.includes(tag));
      if (!hasTag) return false;
    }
    return true;
  });
};

export const sortTasks = (tasks: Task[], sortBy: string): Task[] => {
  const sorted = [...tasks];
  
  switch (sortBy) {
    case 'dueDate':
      return sorted.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    case 'priority':
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      return sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    case 'status':
      return sorted.sort((a, b) => a.status.localeCompare(b.status));
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'createdAt':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    default:
      return sorted;
  }
};

export const getProjectColor = (color: string): string => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    pink: 'bg-pink-500',
    indigo: 'bg-indigo-500',
    orange: 'bg-orange-500'
  };
  return colors[color] || 'bg-gray-500';
};

export const formatDuration = (hours: number): string => {
  if (hours < 1) {
    return `${Math.round(hours * 60)}m`;
  }
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};
