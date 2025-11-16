# Task List View Documentation

## Overview
The Task List View provides a table-like interface for managing tasks, complementing the Kanban Board view. Users can switch between Board and List views using the view switcher in the header.

## Features

### View Switcher
Located in the header with two buttons:
- **Board**: Shows the kanban board view
- **List**: Shows the list/table view
- Active view is highlighted with gray background

### Layout Structure

#### Header Row
Fixed header with columns:
- **Checkbox column** (40px): For task completion
- **Name column** (flexible): Task title and subtasks count
- **Due date column** (150px): Calendar icon + date
- **Priority column** (100px): Flag icon + priority level
- **Actions column** (40px): Chevron for opening task details

#### Task Groups
Tasks are organized by status:
- TO DO
- IN PROGRESS
- REVIEW
- BLOCKED
- COMPLETE

Each group:
- Can be expanded/collapsed
- Shows task count
- Has chevron icon indicating state
- Contains "Add task" button at bottom

### Task Rows

Each task row displays:
1. **Checkbox**: Click to toggle completion status
   - Empty for incomplete tasks
   - Filled blue square for completed tasks
   
2. **Task Name**: 
   - Title in medium font weight
   - Strikethrough and gray color when completed
   - Subtasks count below (if any)
   
3. **Due Date**:
   - Calendar icon + formatted date (e.g., "Jan 15")
   - Shows "-" if no due date set
   
4. **Priority**:
   - Flag icon colored by priority
   - Priority text (low, medium, high, urgent)
   - Colors:
     - Low: Gray (text-gray-500)
     - Medium: Blue (text-blue-500)
     - High: Orange (text-orange-500)
     - Urgent: Red (text-red-500)
   
5. **Actions**:
   - Chevron icon (appears on hover)
   - Opens task detail modal

### Interactions

#### Hover States
- Row background changes to light gray (bg-gray-50)
- Actions chevron becomes visible
- Smooth transitions on all elements

#### Click Actions
- **Row click**: Opens task detail modal
- **Checkbox click**: Toggles task completion (stops propagation)
- **Actions button**: Opens task detail modal (stops propagation)

#### Group Expansion
- Click group header to expand/collapse
- Chevron rotates to indicate state
- Smooth transition

### Add Task Button
- Located at bottom of each expanded group
- Plus icon with "Add task" text
- Opens task creation form
- Hover state for feedback

## Technical Implementation

### Component Structure
```tsx
<TaskListView>
  <Header Row />
  <Task Groups>
    <Group Header />
    <Task Rows />
    <Add Task Button />
  </Task Groups>
</TaskListView>
```

### Grid Layout
Uses CSS Grid for consistent column alignment:
```tsx
grid-cols-[40px_1fr_150px_100px_40px]
```

### State Management
- `expandedGroups`: Set of expanded status groups
- `showTaskForm`: Controls task creation modal
- `selectedTask`: Currently selected task for detail view
- `showDetailModal`: Controls task detail modal

### Priority Colors
```tsx
const PRIORITY_COLORS = {
  low: 'text-gray-500',
  medium: 'text-blue-500',
  high: 'text-orange-500',
  urgent: 'text-red-500'
};
```

## Design Principles

1. **Clean & Minimal**: Simple table layout with clear hierarchy
2. **Scannable**: Easy to scan tasks in a linear format
3. **Efficient**: Quick access to task actions and details
4. **Consistent**: Matches the minimal design of board view
5. **Responsive**: Hover states provide clear feedback

## Comparison: Board vs List View

### Board View
- Visual, spatial organization
- Drag and drop for status changes
- Better for workflow visualization
- Shows fewer details per card
- Horizontal scrolling for many columns

### List View
- Linear, table-like organization
- Click checkbox for completion
- Better for detailed task scanning
- Shows more information per row
- Vertical scrolling for many tasks
- Expandable groups for organization

## Use Cases

### When to Use List View
- Reviewing many tasks at once
- Checking due dates across all tasks
- Quickly marking tasks complete
- Scanning priorities
- Working with long task lists
- Need to see more details at a glance

### When to Use Board View
- Visualizing workflow stages
- Moving tasks between statuses
- Getting overview of work distribution
- Focusing on specific status columns
- Drag and drop workflow

## Keyboard Shortcuts (Future Enhancement)
- `B`: Switch to Board view
- `L`: Switch to List view
- `N`: New task
- `↑/↓`: Navigate tasks
- `Space`: Toggle task completion
- `Enter`: Open task details

## Accessibility

- Proper button types for all interactive elements
- Aria labels for icon-only buttons
- Keyboard navigation support
- Clear visual feedback for all interactions
- Sufficient color contrast
- Screen reader friendly structure

## Future Enhancements

1. **Sorting**: Sort by due date, priority, name
2. **Filtering**: Filter by status, priority, assignee
3. **Bulk Actions**: Select multiple tasks
4. **Column Customization**: Show/hide columns
5. **Inline Editing**: Edit task name directly
6. **Quick Actions**: Right-click context menu
7. **Keyboard Navigation**: Full keyboard support
8. **Search**: Search within list view
9. **Grouping Options**: Group by priority, assignee, project
10. **Export**: Export list to CSV/Excel
