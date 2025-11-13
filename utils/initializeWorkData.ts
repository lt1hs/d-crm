import { Task, Project, TimeEntry } from '../types/work';

/**
 * Initialize sample work management data for testing and demonstration
 * This creates sample projects, tasks, and time entries
 */
export const initializeWorkData = () => {
  // Check if data already exists
  const existingProjects = localStorage.getItem('work_projects');
  if (existingProjects) {
    console.log('Work data already exists. Skipping initialization.');
    return;
  }

  // Sample Projects
  const projects: Project[] = [
    {
      id: 'project-1',
      name: 'Website Redesign',
      description: 'Complete redesign of company website with modern UI/UX',
      color: 'bg-blue-500',
      icon: '🚀',
      ownerId: 'user-1',
      teamMembers: ['user-1', 'user-2', 'user-3'],
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      budget: 50000,
      tags: ['web', 'design', 'frontend'],
      createdAt: new Date('2024-01-01').toISOString(),
      updatedAt: new Date('2024-01-01').toISOString()
    },
    {
      id: 'project-2',
      name: 'Mobile App Development',
      description: 'Build native mobile app for iOS and Android',
      color: 'bg-purple-500',
      icon: '📱',
      ownerId: 'user-1',
      teamMembers: ['user-1', 'user-4'],
      status: 'active',
      startDate: '2024-02-01',
      endDate: '2024-08-31',
      budget: 80000,
      tags: ['mobile', 'ios', 'android'],
      createdAt: new Date('2024-02-01').toISOString(),
      updatedAt: new Date('2024-02-01').toISOString()
    },
    {
      id: 'project-3',
      name: 'Marketing Campaign',
      description: 'Q2 marketing campaign for product launch',
      color: 'bg-green-500',
      icon: '📢',
      ownerId: 'user-2',
      teamMembers: ['user-2', 'user-3'],
      status: 'active',
      startDate: '2024-03-01',
      endDate: '2024-05-31',
      budget: 30000,
      tags: ['marketing', 'campaign', 'social-media'],
      createdAt: new Date('2024-03-01').toISOString(),
      updatedAt: new Date('2024-03-01').toISOString()
    },
    {
      id: 'project-4',
      name: 'API Integration',
      description: 'Integrate third-party APIs for enhanced functionality',
      color: 'bg-orange-500',
      icon: '🔌',
      ownerId: 'user-4',
      teamMembers: ['user-4'],
      status: 'on-hold',
      startDate: '2024-01-15',
      tags: ['backend', 'api', 'integration'],
      createdAt: new Date('2024-01-15').toISOString(),
      updatedAt: new Date('2024-01-15').toISOString()
    }
  ];

  // Sample Tasks
  const tasks: Task[] = [
    {
      id: 'task-1',
      title: 'Design homepage mockup',
      description: 'Create initial design concepts for the new homepage with modern aesthetics',
      projectId: 'project-1',
      assigneeId: 'user-2',
      creatorId: 'user-1',
      priority: 'high',
      status: 'completed',
      tags: ['design', 'ui'],
      dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedHours: 8,
      actualHours: 10,
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      completedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      attachments: [],
      comments: [
        {
          id: 'comment-1',
          taskId: 'task-1',
          userId: 'user-1',
          content: 'Great work on the initial concepts!',
          mentions: [],
          createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      subtasks: [
        {
          id: 'subtask-1',
          title: 'Research competitor websites',
          completed: true,
          assigneeId: 'user-2',
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'subtask-2',
          title: 'Create wireframes',
          completed: true,
          assigneeId: 'user-2',
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'subtask-3',
          title: 'Design mockup in Figma',
          completed: true,
          assigneeId: 'user-2',
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      dependencies: [],
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'task-2',
      title: 'Implement responsive navigation',
      description: 'Build mobile-responsive navigation menu with hamburger icon',
      projectId: 'project-1',
      assigneeId: 'user-3',
      creatorId: 'user-1',
      priority: 'high',
      status: 'in-progress',
      tags: ['frontend', 'responsive'],
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedHours: 6,
      actualHours: 3,
      startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      attachments: [],
      comments: [],
      subtasks: [
        {
          id: 'subtask-4',
          title: 'Create navigation component',
          completed: true,
          assigneeId: 'user-3',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'subtask-5',
          title: 'Add mobile styles',
          completed: false,
          assigneeId: 'user-3',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'subtask-6',
          title: 'Test on different devices',
          completed: false,
          assigneeId: 'user-3',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      dependencies: ['task-1'],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'task-3',
      title: 'Set up authentication system',
      description: 'Implement user authentication with JWT tokens',
      projectId: 'project-2',
      assigneeId: 'user-4',
      creatorId: 'user-1',
      priority: 'urgent',
      status: 'in-progress',
      tags: ['backend', 'security'],
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedHours: 12,
      actualHours: 8,
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      attachments: [],
      comments: [],
      subtasks: [],
      dependencies: [],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'task-4',
      title: 'Create social media content calendar',
      description: 'Plan and schedule social media posts for Q2',
      projectId: 'project-3',
      assigneeId: 'user-2',
      creatorId: 'user-2',
      priority: 'medium',
      status: 'todo',
      tags: ['marketing', 'content'],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedHours: 4,
      actualHours: 0,
      attachments: [],
      comments: [],
      subtasks: [],
      dependencies: [],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'task-5',
      title: 'Fix critical bug in checkout flow',
      description: 'Users unable to complete purchase - payment gateway error',
      projectId: 'project-1',
      assigneeId: 'user-3',
      creatorId: 'user-1',
      priority: 'urgent',
      status: 'blocked',
      tags: ['bug', 'critical'],
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedHours: 3,
      actualHours: 2,
      startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      attachments: [],
      comments: [
        {
          id: 'comment-2',
          taskId: 'task-5',
          userId: 'user-3',
          content: 'Waiting for payment gateway API credentials from vendor',
          mentions: ['user-1'],
          createdAt: new Date().toISOString()
        }
      ],
      subtasks: [],
      dependencies: [],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'task-6',
      title: 'Write API documentation',
      description: 'Document all API endpoints with examples',
      projectId: 'project-2',
      assigneeId: 'user-4',
      creatorId: 'user-1',
      priority: 'low',
      status: 'todo',
      tags: ['documentation', 'api'],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedHours: 8,
      actualHours: 0,
      attachments: [],
      comments: [],
      subtasks: [],
      dependencies: ['task-3'],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'task-7',
      title: 'Design email templates',
      description: 'Create responsive email templates for marketing campaigns',
      projectId: 'project-3',
      assigneeId: 'user-2',
      creatorId: 'user-2',
      priority: 'medium',
      status: 'review',
      tags: ['design', 'email'],
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedHours: 6,
      actualHours: 7,
      startDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      attachments: [],
      comments: [],
      subtasks: [],
      dependencies: [],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Sample Time Entries
  const timeEntries: TimeEntry[] = [
    {
      id: 'time-1',
      taskId: 'task-1',
      userId: 'user-2',
      description: 'Research and wireframing',
      hours: 4,
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'time-2',
      taskId: 'task-1',
      userId: 'user-2',
      description: 'Design mockup in Figma',
      hours: 6,
      date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'time-3',
      taskId: 'task-2',
      userId: 'user-3',
      description: 'Built navigation component',
      hours: 3,
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'time-4',
      taskId: 'task-3',
      userId: 'user-4',
      description: 'JWT implementation',
      hours: 5,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'time-5',
      taskId: 'task-3',
      userId: 'user-4',
      description: 'Testing and debugging',
      hours: 3,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    },
    {
      id: 'time-6',
      taskId: 'task-5',
      userId: 'user-3',
      description: 'Investigating payment gateway issue',
      hours: 2,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    },
    {
      id: 'time-7',
      taskId: 'task-7',
      userId: 'user-2',
      description: 'Email template design',
      hours: 7,
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Save to localStorage
  localStorage.setItem('work_projects', JSON.stringify(projects));
  localStorage.setItem('work_tasks', JSON.stringify(tasks));
  localStorage.setItem('work_time_entries', JSON.stringify(timeEntries));

  console.log('✅ Work management sample data initialized!');
  console.log(`   - ${projects.length} projects`);
  console.log(`   - ${tasks.length} tasks`);
  console.log(`   - ${timeEntries.length} time entries`);
};

/**
 * Clear all work management data
 */
export const clearWorkData = () => {
  localStorage.removeItem('work_projects');
  localStorage.removeItem('work_tasks');
  localStorage.removeItem('work_time_entries');
  console.log('🗑️ Work management data cleared');
};

/**
 * Export work data as JSON
 */
export const exportWorkData = () => {
  const data = {
    projects: JSON.parse(localStorage.getItem('work_projects') || '[]'),
    tasks: JSON.parse(localStorage.getItem('work_tasks') || '[]'),
    timeEntries: JSON.parse(localStorage.getItem('work_time_entries') || '[]'),
    exportedAt: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `work-data-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  console.log('📥 Work data exported');
};

/**
 * Import work data from JSON
 */
export const importWorkData = (jsonData: string) => {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.projects) {
      localStorage.setItem('work_projects', JSON.stringify(data.projects));
    }
    if (data.tasks) {
      localStorage.setItem('work_tasks', JSON.stringify(data.tasks));
    }
    if (data.timeEntries) {
      localStorage.setItem('work_time_entries', JSON.stringify(data.timeEntries));
    }
    
    console.log('📤 Work data imported successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to import work data:', error);
    return false;
  }
};
