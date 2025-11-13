export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'blocked' | 'completed' | 'cancelled';

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assigneeId: string;
  creatorId: string;
  priority: TaskPriority;
  status: TaskStatus;
  tags: string[];
  dueDate: string;
  estimatedHours?: number;
  actualHours?: number;
  startDate?: string;
  completedDate?: string;
  attachments: TaskAttachment[];
  comments: TaskComment[];
  subtasks: SubTask[];
  dependencies: string[]; // Task IDs this task depends on
  createdAt: string;
  updatedAt: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  assigneeId?: string;
  createdAt: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  mentions: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  description: string;
  hours: number;
  date: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  ownerId: string;
  teamMembers: string[];
  status: 'active' | 'on-hold' | 'completed' | 'archived';
  startDate: string;
  endDate?: string;
  budget?: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  totalProjects: number;
  activeProjects: number;
  totalHoursLogged: number;
  tasksByPriority: Record<TaskPriority, number>;
  tasksByStatus: Record<TaskStatus, number>;
  completionRate: number;
  averageCompletionTime: number;
}

export interface TaskFilters {
  search: string;
  projectId: string;
  assigneeId: string;
  priority: TaskPriority | 'all';
  status: TaskStatus | 'all';
  tags: string[];
  dueDateRange: { start: string; end: string } | null;
}
