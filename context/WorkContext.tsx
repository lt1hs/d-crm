import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, Project, TimeEntry, WorkStats } from '../types/work';
import { calculateWorkStats } from '../utils/workHelpers';
import { tasksApi, projectsApi } from '../utils/api';
import { supabase } from '../config/supabase';
import { useAuth } from './AuthContext';

interface WorkContextType {
  tasks: Task[];
  projects: Project[];
  timeEntries: TimeEntry[];
  stats: WorkStats;
  loading: boolean;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addTimeEntry: (entry: Omit<TimeEntry, 'id' | 'createdAt'>) => Promise<void>;
  addComment: (taskId: string, comment: Omit<any, 'id' | 'createdAt'>) => Promise<void>;
  addSubtask: (taskId: string, subtask: Omit<any, 'id' | 'createdAt'>) => Promise<void>;
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<void>;
}

const WorkContext = createContext<WorkContextType | undefined>(undefined);

export const WorkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (currentUser) {
      loadData();
      subscribeToChanges();
    }
  }, [currentUser]);

  useEffect(() => {
    setStats(calculateWorkStats(tasks, projects, timeEntries));
  }, [tasks, projects, timeEntries]);

  const loadData = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const [tasksData, projectsData] = await Promise.all([
        tasksApi.getMyTasks(currentUser.id),
        projectsApi.getMyProjects(currentUser.id)
      ]);
      
      // Map Supabase data to local Task type
      const mappedTasks: Task[] = tasksData.map((t: any) => ({
        id: t.id,
        title: t.title,
        description: t.description || '',
        projectId: t.project_id,
        assigneeId: t.assignee_id || '',
        creatorId: t.creator_id,
        priority: t.priority,
        status: t.status,
        tags: t.tags || [],
        dueDate: t.due_date || '',
        estimatedHours: t.estimated_hours,
        actualHours: t.actual_hours,
        startDate: t.start_date,
        completedDate: t.completed_date,
        attachments: t.task_attachments?.map((a: any) => ({
          id: a.id,
          name: a.name,
          url: a.url,
          type: a.type,
          size: a.size,
          uploadedBy: a.uploaded_by,
          uploadedAt: a.uploaded_at
        })) || [],
        comments: t.task_comments?.map((c: any) => ({
          id: c.id,
          taskId: c.task_id,
          userId: c.user_id,
          content: c.content,
          mentions: c.mentions || [],
          createdAt: c.created_at,
          updatedAt: c.updated_at
        })) || [],
        subtasks: t.subtasks?.map((s: any) => ({
          id: s.id,
          title: s.title,
          completed: s.completed,
          assigneeId: s.assignee_id,
          createdAt: s.created_at
        })) || [],
        dependencies: [],
        createdAt: t.created_at,
        updatedAt: t.updated_at
      }));

      // Map Supabase data to local Project type
      const mappedProjects: Project[] = projectsData.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description || '',
        color: p.color,
        icon: p.icon,
        ownerId: p.owner_id,
        teamMembers: p.members?.map((m: any) => m.user.id) || [],
        status: p.status,
        startDate: p.start_date,
        endDate: p.end_date,
        budget: p.budget,
        tags: p.tags || [],
        createdAt: p.created_at,
        updatedAt: p.updated_at
      }));

      setTasks(mappedTasks);
      setProjects(mappedProjects);
    } catch (error: any) {
      console.error('WorkContext: Failed to load work data:', error);
      console.error('WorkContext: Error message:', error.message);
      console.error('WorkContext: Error details:', error);
      
      // Check if it's a table not found error
      if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
        console.error('❌ DATABASE TABLES NOT FOUND!');
        console.error('📝 Please run the migration: supabase/migrations/001_initial_schema.sql');
        console.error('🔗 Go to Supabase Dashboard → SQL Editor → Run the migration');
      }
    } finally {
      setLoading(false);
    }
  };

  const subscribeToChanges = () => {
    if (!currentUser) return;

    // Subscribe to task updates
    const taskSubscription = supabase
      .channel('task-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `assignee_id=eq.${currentUser.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            loadData(); // Reload to get full task with relations
          } else if (payload.eventType === 'UPDATE') {
            loadData(); // Reload to get updated task
          } else if (payload.eventType === 'DELETE') {
            setTasks(prev => prev.filter(t => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      taskSubscription.unsubscribe();
    };
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) return;

    try {
      const taskInsert: any = {
        title: taskData.title,
        description: taskData.description,
        project_id: taskData.projectId,
        creator_id: currentUser.id,
        priority: taskData.priority,
        status: taskData.status,
        tags: taskData.tags,
        estimated_hours: taskData.estimatedHours
      };

      // Only include assignee_id if it's a valid UUID (not empty or invalid)
      if (taskData.assigneeId && taskData.assigneeId.length > 10) {
        taskInsert.assignee_id = taskData.assigneeId;
      }

      // Only include due_date if it's not empty
      if (taskData.dueDate && taskData.dueDate !== '') {
        taskInsert.due_date = taskData.dueDate;
      }

      const task = await tasksApi.createTask(taskInsert);

      await loadData(); // Reload to get full task data
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const supabaseUpdates: any = {};
      if (updates.title) supabaseUpdates.title = updates.title;
      if (updates.description !== undefined) supabaseUpdates.description = updates.description;
      if (updates.status) supabaseUpdates.status = updates.status;
      if (updates.priority) supabaseUpdates.priority = updates.priority;
      
      // Only include assignee_id if it's a valid UUID
      if (updates.assigneeId !== undefined) {
        if (updates.assigneeId && updates.assigneeId.length > 10) {
          supabaseUpdates.assignee_id = updates.assigneeId;
        } else {
          supabaseUpdates.assignee_id = null;
        }
      }
      
      // Only include dates if they're not empty
      if (updates.dueDate !== undefined && updates.dueDate !== '') {
        supabaseUpdates.due_date = updates.dueDate;
      }
      if (updates.completedDate !== undefined && updates.completedDate !== '') {
        supabaseUpdates.completed_date = updates.completedDate;
      }
      
      if (updates.estimatedHours !== undefined) supabaseUpdates.estimated_hours = updates.estimatedHours;
      if (updates.actualHours !== undefined) supabaseUpdates.actual_hours = updates.actualHours;
      if (updates.tags) supabaseUpdates.tags = updates.tags;

      await tasksApi.updateTask(id, supabaseUpdates);
      
      // Optimistic update
      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
      ));
    } catch (error) {
      console.error('Failed to update task:', error);
      await loadData(); // Reload on error
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await tasksApi.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  };

  const addProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) return;

    try {
      const projectInsert: any = {
        name: projectData.name,
        description: projectData.description,
        color: projectData.color,
        icon: projectData.icon,
        owner_id: currentUser.id,
        status: projectData.status,
        start_date: projectData.startDate,
        budget: projectData.budget,
        tags: projectData.tags
      };

      // Only include end_date if it's not empty
      if (projectData.endDate && projectData.endDate !== '') {
        projectInsert.end_date = projectData.endDate;
      }

      await projectsApi.createProject(projectInsert);

      await loadData();
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const supabaseUpdates: any = {};
      if (updates.name) supabaseUpdates.name = updates.name;
      if (updates.description !== undefined) supabaseUpdates.description = updates.description;
      if (updates.status) supabaseUpdates.status = updates.status;
      if (updates.color) supabaseUpdates.color = updates.color;
      if (updates.icon) supabaseUpdates.icon = updates.icon;
      // Only include end_date if it's not empty
      if (updates.endDate !== undefined && updates.endDate !== '') {
        supabaseUpdates.end_date = updates.endDate;
      }
      if (updates.budget !== undefined) supabaseUpdates.budget = updates.budget;
      if (updates.tags) supabaseUpdates.tags = updates.tags;

      await projectsApi.updateProject(id, supabaseUpdates);
      
      setProjects(prev => prev.map(project => 
        project.id === id ? { ...project, ...updates, updatedAt: new Date().toISOString() } : project
      ));
    } catch (error) {
      console.error('Failed to update project:', error);
      await loadData();
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await projectsApi.deleteProject(id);
      setProjects(prev => prev.filter(project => project.id !== id));
      setTasks(prev => prev.filter(task => task.projectId !== id));
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    }
  };

  const addTimeEntry = async (entryData: Omit<TimeEntry, 'id' | 'createdAt'>) => {
    if (!currentUser) return;

    try {
      const newEntry: TimeEntry = {
        ...entryData,
        id: `time-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      setTimeEntries(prev => [newEntry, ...prev]);
      
      // Update task actual hours
      const task = tasks.find(t => t.id === entryData.taskId);
      if (task) {
        await updateTask(task.id, {
          actualHours: (task.actualHours || 0) + entryData.hours
        });
      }
    } catch (error) {
      console.error('Failed to add time entry:', error);
      throw error;
    }
  };

  const addComment = async (taskId: string, commentData: any) => {
    if (!currentUser) return;

    try {
      await tasksApi.addComment(taskId, currentUser.id, commentData.content, commentData.mentions || []);
      await loadData(); // Reload to get updated comments
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw error;
    }
  };

  const addSubtask = async (taskId: string, subtaskData: any) => {
    try {
      await tasksApi.addSubtask(taskId, subtaskData.title, subtaskData.assigneeId);
      await loadData(); // Reload to get updated subtasks
    } catch (error) {
      console.error('Failed to add subtask:', error);
      throw error;
    }
  };

  const toggleSubtask = async (taskId: string, subtaskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const subtask = task?.subtasks.find(st => st.id === subtaskId);
      
      if (subtask) {
        await tasksApi.updateSubtask(subtaskId, !subtask.completed);
        
        // Optimistic update
        setTasks(prev => prev.map(t => {
          if (t.id === taskId) {
            return {
              ...t,
              subtasks: t.subtasks.map(st =>
                st.id === subtaskId ? { ...st, completed: !st.completed } : st
              )
            };
          }
          return t;
        }));
      }
    } catch (error) {
      console.error('Failed to toggle subtask:', error);
      await loadData();
      throw error;
    }
  };

  return (
    <WorkContext.Provider value={{
      tasks,
      projects,
      timeEntries,
      stats,
      loading,
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
