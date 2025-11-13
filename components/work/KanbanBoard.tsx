import React, { useState } from 'react';
import { Task, TaskStatus } from '../../types/work';
import { useWork } from '../../context/WorkContext';
import { Plus, MoreVertical, Clock, AlertCircle, CheckCircle2, LayoutGrid, List } from 'lucide-react';
import { TaskForm } from './TaskForm';
import { TaskDetailModal } from './TaskDetailModal';
import { TaskListView } from './TaskListView';
import { getTaskPriorityColor, isTaskOverdue } from '../../utils/workHelpers';

type ViewMode = 'board' | 'list';

const COLUMNS: { 
  status: TaskStatus; 
  title: string; 
  badgeColor: string;
}[] = [
  { 
    status: 'todo', 
    title: 'TO DO', 
    badgeColor: 'bg-gray-100 text-gray-700'
  },
  { 
    status: 'in-progress', 
    title: 'IN PROGRESS', 
    badgeColor: 'bg-purple-100 text-purple-700'
  },
  { 
    status: 'review', 
    title: 'REVIEW', 
    badgeColor: 'bg-blue-100 text-blue-700'
  },
  { 
    status: 'blocked', 
    title: 'BLOCKED', 
    badgeColor: 'bg-red-100 text-red-700'
  },
  { 
    status: 'completed', 
    title: 'COMPLETE', 
    badgeColor: 'bg-green-100 text-green-700'
  }
];

export const KanbanBoard: React.FC = () => {
  const { tasks, updateTask, projects } = useWork();
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('taskId', task.id);
    setDraggedTask(task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (status: TaskStatus) => {
    setDragOverColumn(status);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (
      e.clientX <= rect.left ||
      e.clientX >= rect.right ||
      e.clientY <= rect.top ||
      e.clientY >= rect.bottom
    ) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t.id === taskId);
    
    if (task && task.status !== status) {
      updateTask(taskId, { 
        status,
        ...(status === 'completed' && { completedDate: new Date().toISOString() })
      });
    }
    
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(t => t.status === status);
  };

  const openTaskDetail = (task: Task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;

  // If list view is selected, render the list view component
  if (viewMode === 'list') {
    return (
      <div className="h-full flex flex-col bg-white">
        {/* View Switcher Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode('board')}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Board</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-900 rounded-lg"
            >
              <List className="w-4 h-4" />
              <span>List</span>
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowTaskForm(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Task</span>
          </button>
        </div>
        <TaskListView />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* View Switcher Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('board')}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-900 rounded-lg"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Board</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <List className="w-4 h-4" />
            <span>List</span>
          </button>
        </div>
        <button
          type="button"
          onClick={() => setShowTaskForm(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Task</span>
        </button>
      </div>

      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4 h-full">
          {COLUMNS.map(column => {
            const columnTasks = getTasksByStatus(column.status);
            const isDropTarget = dragOverColumn === column.status;
            
            return (
              <div
                key={column.status}
                className={`flex-shrink-0 w-72 flex flex-col ${
                  isDropTarget ? 'bg-gray-50' : ''
                }`}
                onDragOver={handleDragOver}
                onDragEnter={() => handleDragEnter(column.status)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.status)}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded text-xs font-semibold ${column.badgeColor}`}>
                      {column.title}
                    </span>
                    <span className="text-gray-500 text-sm font-medium">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                {/* Column Content */}
                <div className="flex-1 space-y-2 overflow-y-auto kanban-scrollbar pr-1">
                  {columnTasks.map(task => {
                    const isDragging = draggedTask === task.id;
                    const completedSubtasks = task.subtasks.filter(st => st.completed).length;
                    const totalSubtasks = task.subtasks.length;
                    
                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragEnd={handleDragEnd}
                        onClick={() => openTaskDetail(task)}
                        className={`bg-white rounded-lg p-3 border border-gray-200 cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all ${
                          isDragging ? 'opacity-50' : ''
                        }`}
                      >
                        {/* Task Title */}
                        <div className="flex items-start gap-2 mb-2">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900 leading-snug mb-1">
                              {task.title}
                            </h4>
                          </div>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openTaskDetail(task);
                            }}
                            className="text-gray-400 hover:text-gray-600"
                            aria-label="Task options"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Subtasks Progress */}
                        {totalSubtasks > 0 && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{completedSubtasks}/{totalSubtasks} subtasks</span>
                          </div>
                        )}

                        {/* Task Footer */}
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          {task.dueDate && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Add Task Button */}
                  <button
                    type="button"
                    onClick={() => setShowTaskForm(true)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg border border-dashed border-gray-300 hover:border-gray-400 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Task</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showTaskForm && (
        <TaskForm onClose={() => setShowTaskForm(false)} />
      )}

      {showDetailModal && selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
};
