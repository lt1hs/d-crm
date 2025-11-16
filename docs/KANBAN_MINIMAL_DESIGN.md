# Kanban Board - Minimal Design

## Overview
The kanban board has been redesigned with a clean, minimal aesthetic inspired by modern project management tools like Linear and Height.

## Key Features

### Layout
- **Fixed Column Width**: 288px (w-72) for consistency
- **White Background**: Clean, distraction-free workspace
- **Simple Spacing**: 16px gaps between columns, 24px padding

### Column Design
- **Status Badges**: Color-coded pills showing status
  - TO DO (Gray)
  - IN PROGRESS (Purple)
  - REVIEW (Blue)
  - BLOCKED (Red)
  - COMPLETE (Green)
- **Task Count**: Simple number next to badge
- **No Icons**: Clean, text-focused headers

### Task Cards
Minimal cards showing only essential information:
- **Title**: Medium weight, 14px font
- **Subtasks**: Count with checkmark icon (if any)
- **Due Date**: Date with clock icon (if set)
- **Options**: Three-dot menu for actions

Cards have:
- White background
- Gray border (border-gray-200)
- Rounded corners (rounded-lg)
- Subtle hover effect (darker border + shadow)
- 50% opacity when dragging

### Add Task Button
- Dashed border style
- Plus icon with "Add Task" text
- Located at bottom of each column
- Hover state for feedback

### Drag & Drop
- Simple opacity change (50%) when dragging
- Drop target gets light gray background
- Smooth transitions
- No rotation or scaling effects

## Design Principles

1. **Content First**: Focus on task information, not decoration
2. **Scannable**: Easy to quickly scan all columns
3. **Minimal**: Remove unnecessary visual elements
4. **Consistent**: Fixed widths and uniform spacing
5. **Clean**: White background, simple borders

## Comparison to Previous Design

### Removed
- Gradient backgrounds
- Column icons
- Priority badges on cards
- Tag displays on cards
- Project indicators on cards
- Progress bars on cards
- Complex hover animations
- Header stats section
- Colored column backgrounds

### Kept
- Drag and drop functionality
- Task detail modal
- Subtasks count
- Due date display
- Options menu
- Smooth transitions

### Added
- "Add Task" button in each column
- Simpler, cleaner card layout
- Fixed column widths
- More compact design

## Benefits

1. **Faster Scanning**: Less visual noise makes it easier to find tasks
2. **More Space**: Compact design fits more tasks on screen
3. **Cleaner Look**: Professional, modern appearance
4. **Better Focus**: Emphasis on task content, not decoration
5. **Consistent Width**: Columns don't vary in size
6. **Easier to Use**: Simpler interface is more intuitive

## Technical Implementation

### Column Width
```tsx
className="flex-shrink-0 w-72 flex flex-col"
```

### Status Badges
```tsx
const COLUMNS = [
  { status: 'todo', title: 'TO DO', badgeColor: 'bg-gray-100 text-gray-700' },
  { status: 'in-progress', title: 'IN PROGRESS', badgeColor: 'bg-purple-100 text-purple-700' },
  // ...
];
```

### Card Structure
```tsx
<div className="bg-white rounded-lg p-3 border border-gray-200 cursor-pointer hover:border-gray-300 hover:shadow-sm">
  <h4>{task.title}</h4>
  {subtasks && <div>{count} subtasks</div>}
  {dueDate && <div>{date}</div>}
</div>
```

### Add Task Button
```tsx
<button className="w-full flex items-center gap-2 px-3 py-2 text-sm border border-dashed border-gray-300">
  <Plus /> Add Task
</button>
```

## Usage

The kanban board is now optimized for:
- Quick task scanning
- Efficient task management
- Clean, professional appearance
- Daily workflow use

All detailed task information (priority, tags, project, description, etc.) is available in the task detail modal, keeping the board view clean and focused.
