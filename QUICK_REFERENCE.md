# Work Management - Quick Reference Guide

## Views

### Board View
- **Purpose**: Visual workflow management
- **Best For**: Drag & drop status changes, workflow overview
- **Key Feature**: Kanban columns with drag & drop

### List View  
- **Purpose**: Detailed task analysis
- **Best For**: Scanning many tasks, bulk operations, data review
- **Key Feature**: Rich table with 6 columns of data

### Task Detail
- **Purpose**: Full task management
- **Best For**: Editing all task properties, viewing activity
- **Key Feature**: Split-screen with activity sidebar

## Quick Actions

### Board View
- **Drag Task**: Click and drag to new column
- **Open Task**: Click on card
- **Add Task**: Click "+ Add Task" in column
- **Switch View**: Click "List" button in header

### List View
- **Complete Task**: Click checkbox
- **Open Task**: Click on row
- **Expand Group**: Click group header
- **Add Task**: Click "+ Add task to [STATUS]"
- **Switch View**: Click "Board" button in header

### Task Detail Modal
- **Edit Title**: Click on title
- **Change Status**: Select from dropdown
- **Set Priority**: Select from dropdown
- **Add Subtask**: Type in input, press Enter
- **Add Comment**: Type in sidebar, press Enter
- **Close**: Click X or click outside

## Keyboard Shortcuts

### General
- `Escape`: Close modal/cancel edit
- `Enter`: Save/submit
- `Tab`: Navigate fields

### Task Detail
- `Enter`: Save title edit
- `Escape`: Cancel title edit
- `Enter`: Submit comment
- `Enter`: Add subtask

## Status Colors

| Status | Color | Badge |
|--------|-------|-------|
| TO DO | Gray | bg-gray-100 |
| IN PROGRESS | Purple | bg-purple-100 |
| REVIEW | Blue | bg-blue-100 |
| BLOCKED | Red | bg-red-100 |
| COMPLETE | Green | bg-green-100 |

## Priority Colors

| Priority | Color | Badge |
|----------|-------|-------|
| Low | Gray | bg-gray-100 |
| Medium | Blue | bg-blue-100 |
| High | Orange | bg-orange-100 |
| Urgent | Red | bg-red-100 |

## Common Tasks

### Create a Task
1. Click "+ Task" button
2. Fill in details
3. Click "Create"

### Update Task Status
**Board**: Drag to new column
**List**: Open detail, change status
**Detail**: Select from dropdown

### Add Subtask
1. Open task detail
2. Scroll to Subtasks
3. Type in input field
4. Press Enter

### Add Comment
1. Open task detail
2. Type in comment field (sidebar)
3. Press Enter

### Assign Task
1. Open task detail
2. Click Assignees field
3. Select user

### Set Due Date
1. Open task detail
2. Click date picker
3. Select date

## Tips & Tricks

### Board View
- Hold Shift while dragging for smooth movement
- Double-click card for quick open
- Use "Add Task" in specific columns for pre-set status

### List View
- Collapse completed groups to focus on active work
- Use stats bar to monitor progress
- Click group header to expand/collapse all

### Task Detail
- Click title to edit inline
- All fields auto-save on blur
- Activity sidebar shows real-time updates
- Use @ mentions in comments

## Troubleshooting

### Task not updating?
- Check internet connection
- Refresh page
- Check browser console for errors

### Drag & drop not working?
- Ensure you're clicking on the card, not a button
- Try refreshing the page
- Check if browser supports drag & drop

### Modal not closing?
- Click the X button
- Click outside the modal
- Press Escape key

## Best Practices

### Organization
- Use consistent naming conventions
- Set due dates for time-sensitive tasks
- Assign tasks to specific people
- Use tags for categorization

### Workflow
- Move tasks through statuses regularly
- Add comments for context
- Break large tasks into subtasks
- Review blocked tasks frequently

### Collaboration
- Mention team members in comments
- Update status when starting work
- Add time estimates for planning
- Document decisions in comments

## Support

### Documentation
- `WORK_MANAGEMENT_COMPLETE.md`: Full system overview
- `TASK_DETAIL_MODAL_REDESIGN.md`: Modal details
- `LIST_VIEW_PRO_FEATURES.md`: List view features
- `KANBAN_MINIMAL_DESIGN.md`: Board view design

### Getting Help
- Check documentation first
- Review error messages
- Contact system administrator
- Submit feedback for improvements
