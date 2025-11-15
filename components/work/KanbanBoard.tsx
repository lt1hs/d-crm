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
    status: 'completed', 
    title: 'COMPLETED', 
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
      <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Sleeker Header */}
        <div className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-800 border-b border-gray-200/60 dark:border-gray-700/60">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setViewMode('board')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg"
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowTaskForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        </div>
        <TaskListView />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Sleeker Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-800 border-b border-gray-200/60 dark:border-gray-700/60">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setViewMode('board')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Board</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <List className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
        </div>
        <button
          type="button"
          onClick={() => setShowTaskForm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Task</span>
        </button>
      </div>

      <div className="flex-1 overflow-x-auto p-4">
        <div className="flex gap-3 h-full">
          {COLUMNS.map(column => {
            const columnTasks = getTasksByStatus(column.status);
            const isDropTarget = dragOverColumn === column.status;
            
            return (
              <div
                key={column.status}
                className={`flex-shrink-0 w-80 flex flex-col bg-white dark:bg-gray-800 rounded-xl border border-gray-200/60 dark:border-gray-700/60 p-3 transition-all ${
                  isDropTarget ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                }`}
                onDragOver={handleDragOver}
                onDragEnter={() => handleDragEnter(column.status)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.status)}
              >
                {/* Sleeker Column Header */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100 dark:border-gray-700/50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      {column.title}
                    </span>
                    <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-md">
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
                    const project = projects.find(p => p.id === task.projectId);
                    const isOverdue = isTaskOverdue(task);
                    
                    const priorityColors: Record<string, string> = {
                      urgent: 'bg-red-500',
                      high: 'bg-orange-500',
                      medium: 'bg-yellow-500',
                      low: 'bg-gray-400'
                    };
                    
                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragEnd={handleDragEnd}
                        onClick={() => openTaskDetail(task)}
                        className={`group bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200/60 dark:border-gray-700/60 cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all ${
                          isDragging ? 'opacity-50 scale-95' : ''
                        }`}
                      >
                        {/* Priority Indicator Bar */}
                        <div className={`h-0.5 w-8 ${priorityColors[task.priority]} rounded-full mb-2.5`} />
                        
                        {/* Task Title */}
                        <div className="flex items-start gap-2 mb-2">
                          <h4 className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug line-clamp-2">
                            {task.title}
                          </h4>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openTaskDetail(task);
                            }}
                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-opacity"
                            aria-label="Task options"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Task Meta Info */}
                        <div className="space-y-2">
                          {/* Subtasks Progress */}
                          {totalSubtasks > 0 && (
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                {completedSubtasks}/{totalSubtasks}
                              </span>
                              <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-500 rounded-full transition-all"
                                  style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Task Footer */}
                          <div className="flex items-center justify-between text-xs">
                            {task.dueDate && (
                              <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                                <Clock className="w-3 h-3" />
                                <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                              </div>
                            )}
                            {project && (
                              <span className="text-gray-400 dark:text-gray-500 text-xs truncate max-w-[100px]">
                                {project.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add Task Button */}
                  <button
                    type="button"
                    onClick={() => setShowTaskForm(true)}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
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
