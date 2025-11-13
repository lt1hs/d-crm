import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, Project, TimeEntry, WorkStats } from '../types/work';
import { calculateWorkStats } from '../utils/workHelpers';

interface WorkContextType {
  tasks: Task[];
  projects: Project[];
  timeEntries: TimeEntry[];
  stats: WorkStats;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTimeEntry: (entry: Omit<TimeEntry, 'id' | 'createdAt'>) => void;
  addComment: (taskId: string, comment: Omit<any, 'id' | 'createdAt'>) => void;
  addSubtask: (taskId: string, subtask: Omit<any, 'id' | 'createdAt'>) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
}

const WorkContext = createContext<WorkContextType | undefined>(undefined);

export const WorkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [stats, setStats] = useState<WorkStats>({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
    totalProjects: 0,
    activeProjects: 0,
    totalHoursLogged: 0,
    tasksByPriority: { low: 0, medium: 0, high: 0, urgent: 0 },
    tasksByStatus: { 'todo': 0, 'in-progress': 0, 'review': 0, 'blocked': 0, 'completed': 0, 'cancelled': 0 },
    completionRate: 0,
    averageCompletionTime: 0
  });

  // Load from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('work_tasks');
    const savedProjects = localStorage.getItem('work_projects');
    const savedTimeEntries = localStorage.getItem('work_time_entries');
    
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedProjects) setProjects(JSON.parse(savedProjects));
    if (savedTimeEntries) setTimeEntries(JSON.parse(savedTimeEntries));
  }, []);

  // Save to localStorage and update stats
  useEffect(() => {
    localStorage.setItem('work_tasks', JSON.stringify(tasks));
    localStorage.setItem('work_projects', JSON.stringify(projects));
    localStorage.setItem('work_time_entries', JSON.stringify(timeEntries));
    setStats(calculateWorkStats(tasks, projects, timeEntries));
  }, [tasks, projects, timeEntries]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProjects(prev => [newProject, ...prev]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project => 
      project.id === id 
        ? { ...project, ...updates, updatedAt: new Date().toISOString() }
        : project
    ));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
    // Also delete all tasks in this project
    setTasks(prev => prev.filter(task => task.projectId !== id));
  };

  const addTimeEntry = (entryData: Omit<TimeEntry, 'id' | 'createdAt'>) => {
    const newEntry: TimeEntry = {
      ...entryData,
      id: `time-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    setTimeEntries(prev => [newEntry, ...prev]);
    
    // Update task actual hours
    const task = tasks.find(t => t.id === entryData.taskId);
    if (task) {
      updateTask(task.id, {
        actualHours: (task.actualHours || 0) + entryData.hours
      });
    }
  };

  const addComment = (taskId: string, commentData: any) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newComment = {
        ...commentData,
        id: `comment-${Date.now()}`,
        taskId,
        createdAt: new Date().toISOString()
      };
      updateTask(taskId, {
        comments: [...task.comments, newComment]
      });
    }
  };

  const addSubtask = (taskId: string, subtaskData: any) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newSubtask = {
        ...subtaskData,
        id: `subtask-${Date.now()}`,
        completed: false,
        createdAt: new Date().toISOString()
      };
      updateTask(taskId, {
        subtasks: [...task.subtasks, newSubtask]
      });
    }
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      updateTask(taskId, {
        subtasks: task.subtasks.map(st =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        )
      });
    }
  };

  return (
    <WorkContext.Provider value={{
      tasks,
      projects,
      timeEntries,
      stats,
      addTask,
      updateTask,
      deleteTask,
      addProject,
      updateProject,
      deleteProject,
      addTimeEntry,
      addComment,
      addSubtask,
      toggleSubtask
    }}>
      {children}
    </WorkContext.Provider>
  );
};

export const useWork = () => {
  const context = useContext(WorkContext);
  if (!context) {
    throw new Error('useWork must be used within WorkProvider');
  }
  return context;
};
