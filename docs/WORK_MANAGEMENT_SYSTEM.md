# Work Management System

A comprehensive todo and work management system with the same layout and design as your CRM, built for the same users.

## Features

### 📊 Dashboard
- **Overview Statistics**: Total tasks, in-progress, overdue, completion rate
- **Quick Stats**: Active projects, hours logged, tasks due this week
- **Priority Distribution**: Visual breakdown of tasks by priority
- **Recent Tasks**: Latest task activity with status indicators

### 📋 Task Management
- **Create & Edit Tasks**: Full task lifecycle management
- **Task Properties**:
  - Title, description, and rich details
  - Project assignment
  - Assignee selection
  - Priority levels (Low, Medium, High, Urgent)
  - Status tracking (To Do, In Progress, Review, Blocked, Completed, Cancelled)
  - Due dates and start dates
  - Estimated vs actual hours
  - Tags for organization
  - Subtasks with progress tracking
  - Comments and mentions
  - File attachments
  - Task dependencies

### 🎯 Kanban Board
- **Visual Workflow**: Drag-and-drop task management
- **Status Columns**: To Do, In Progress, Review, Blocked, Completed
- **Quick Overview**: See task details at a glance
- **Real-time Updates**: Instant status changes
- **Overdue Indicators**: Visual alerts for overdue tasks

### 📝 Task List View
- **Advanced Filtering**:
  - Search by title/description
  - Filter by project
  - Filter by assignee
  - Filter by priority
  - Filter by status
  - Filter by tags
- **Sorting Options**:
  - Created date
  - Due date
  - Priority
  - Status
  - Title
- **Detailed View**: All task information in one place

### 📁 Project Management
- **Create Projects**: Organize tasks into projects
- **Project Properties**:
  - Name and description
  - Custom colors and icons
  - Project status (Active, On Hold, Completed, Archived)
  - Start and end dates
  - Budget tracking
  - Team member assignment
  - Tags
- **Progress Tracking**: Visual progress bars
- **Team Collaboration**: Assign multiple team members

### ⏱️ Time Tracking
- **Log Time**: Track hours spent on tasks
- **Time Analytics**:
  - Total hours logged
  - Number of time entries
  - Average hours per day
  - Time breakdown by project
- **Recent Entries**: View and manage time logs
- **Integration**: Automatic task hour updates

### 👥 Team Collaboration
- **Comments**: Discuss tasks with team members
- **Mentions**: Tag users in comments
- **Subtasks**: Break down work into smaller pieces
- **Assignments**: Assign tasks to team members
- **Activity Tracking**: See who's working on what

## Quick Start

### 1. Add to Your App

```tsx
import { WorkProvider } from './context/WorkContext';
import { WorkManagement } from './components/work/WorkManagement';

function App() {
  return (
    <AuthProvider>
      <WorkProvider>
        {/* Your existing app */}
        <WorkManagement />
      </WorkProvider>
    </AuthProvider>
  );
}
```

### 2. Create Your First Project

1. Navigate to the **Projects** tab
2. Click **New Project**
3. Fill in project details:
   - Name and description
   - Choose a color and icon
   - Set start/end dates
   - Add team members
4. Click **Create Project**

### 3. Create Tasks

1. Go to any view (Dashboard, Kanban, or Task List)
2. Click **New Task**
3. Fill in task details:
   - Title and description
   - Select project
   - Assign to team member
   - Set priority and status
   - Add due date
   - Estimate hours
   - Add tags
4. Click **Create Task**

### 4. Use the Kanban Board

1. Navigate to the **Kanban** tab
2. Drag tasks between columns to update status
3. Click on any task to view/edit details
4. Add subtasks and comments
5. Log time spent on tasks

### 5. Track Time

1. Open a task detail modal
2. Enter hours worked and description
3. Click **Log** to record time
4. View time analytics in the **Time Tracking** tab

## Components

### Core Components

- **WorkManagement**: Main container with tab navigation
- **WorkDashboard**: Overview and statistics
- **KanbanBoard**: Visual task board with drag-and-drop
- **TaskList**: Filterable and sortable task list
- **ProjectManagement**: Project creation and management
- **TimeTracking**: Time logging and analytics

### Form Components

- **TaskForm**: Create/edit tasks
- **ProjectForm**: Create/edit projects
- **TaskDetailModal**: Full task details with actions

### Context

- **WorkContext**: Global state management for tasks, projects, and time entries

### Utilities

- **workHelpers.ts**: Helper functions for calculations and formatting
- **types/work.ts**: TypeScript type definitions

## Data Structure

### Task
```typescript
{
  id: string;
  title: string;
  description: string;
  projectId: string;
  assigneeId: string;
  creatorId: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'review' | 'blocked' | 'completed' | 'cancelled';
  tags: string[];
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  subtasks: SubTask[];
  comments: TaskComment[];
  attachments: TaskAttachment[];
  dependencies: string[];
}
```

### Project
```typescript
{
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  ownerId: string;
  teamMembers: string[];
  status: 'active' | 'on-hold' | 'completed' | 'archived';
  startDate: string;
  endDate: string;
  budget: number;
  tags: string[];
}
```

### TimeEntry
```typescript
{
  id: string;
  taskId: string;
  userId: string;
  description: string;
  hours: number;
  date: string;
}
```

## Integration with Existing CRM

The work management system is designed to work alongside your existing CRM:

1. **Shared Authentication**: Uses the same AuthContext and user management
2. **Consistent Design**: Matches your CRM's UI/UX patterns
3. **Same Users**: All CRM users can access the work management system
4. **Separate Data**: Work data is stored separately from CRM data
5. **Independent Navigation**: Can be accessed via sidebar or separate route

## Customization

### Adding Custom Fields

Edit `types/work.ts` to add new fields:

```typescript
export interface Task {
  // ... existing fields
  customField: string;
}
```

### Custom Task Statuses

Modify the `TaskStatus` type and update the Kanban columns:

```typescript
export type TaskStatus = 'todo' | 'in-progress' | 'custom-status' | 'completed';
```

### Custom Priority Levels

Add new priority levels in `types/work.ts` and update color mappings in `workHelpers.ts`.

## Best Practices

1. **Create Projects First**: Organize work into projects before creating tasks
2. **Use Tags**: Tag tasks for easy filtering and organization
3. **Set Due Dates**: Keep track of deadlines
4. **Break Down Work**: Use subtasks for complex tasks
5. **Log Time Regularly**: Track time as you work for accurate reporting
6. **Use Comments**: Communicate with team members on tasks
7. **Update Status**: Keep task status current for accurate progress tracking

## Tips

- Use the **Kanban board** for visual workflow management
- Use the **Task List** for detailed filtering and sorting
- Check the **Dashboard** daily for overview and priorities
- Use **Time Tracking** to analyze productivity
- Assign tasks to team members for clear ownership
- Use **Urgent** priority sparingly for true emergencies
- Archive completed projects to keep the workspace clean

## Future Enhancements

Potential features to add:

- [ ] Task templates
- [ ] Recurring tasks
- [ ] Email notifications
- [ ] Calendar integration
- [ ] File upload for attachments
- [ ] Task history/audit log
- [ ] Advanced reporting
- [ ] Sprint planning
- [ ] Gantt chart view
- [ ] Mobile app
- [ ] API integration
- [ ] Export to CSV/PDF
- [ ] Custom workflows
- [ ] Automation rules

## Support

For issues or questions:
1. Check this documentation
2. Review the code comments
3. Test with sample data
4. Verify user permissions

## License

Same as your CRM system.
