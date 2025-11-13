import React, { useState } from 'react';
import { Task, TaskStatus } from '../../types/work';
import { useWork } from '../../context/WorkContext';
import { useAuth } from '../../context/AuthContext';
import { 
  X, Trash2, Clock, Calendar, User, 
  Plus, Flag, Tag, Link2, MoreHorizontal, CheckCircle2, Circle
} from 'lucide-react';
import { calculateTaskProgress } from '../../utils/workHelpers';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'TO DO' },
  { value: 'in-progress', label: 'IN PROGRESS' },
  { value: 'review', label: 'REVIEW' },
  { value: 'blocked', label: 'BLOCKED' },
  { value: 'completed', label: 'COMPLETE' }
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'text-gray-600' },
  { value: 'medium', label: 'Medium', color: 'text-blue-600' },
  { value: 'high', label: 'High', color: 'text-orange-600' },
  { value: 'urgent', label: 'Urgent', color: 'text-red-600' }
];

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose }) => {
  const { updateTask, deleteTask, projects, addComment, addSubtask, toggleSubtask } = useWork();
  const { currentUser } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [newSubtask, setNewSubtask] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  
  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  const project = projects.find(p => p.id === task.projectId);
  const assignee = users.find((u: any) => u.id === task.assigneeId);
  const progress = calculateTaskProgress(task);

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
      onClose();
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(task.id, {
        userId: currentUser?.id || '',
        content: newComment,
        mentions: []
      });
      setNewComment('');
    }
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      addSubtask(task.id, {
        title: newSubtask,
        assigneeId: currentUser?.id
      });
      setNewSubtask('');
    }
  };

  const handleTitleSave = () => {
    if (editedTitle.trim() && editedTitle !== task.title) {
      updateTask(task.id, { title: editedTitle });
    }
    setIsEditingTitle(false);
  };

  const handleDescriptionBlur = () => {
    if (description !== task.description) {
      updateTask(task.id, { description });
    }
  };

  const handleStatusChange = (status: TaskStatus) => {
    updateTask(task.id, { 
      status,
      ...(status === 'completed' && { completedDate: new Date().toISOString() })
    });
  };

  const handlePriorityChange = (priority: string) => {
    updateTask(task.id, { priority: priority as any });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex">
      {/* Main Content Area */}
      <div className="flex-1 flex items-start justify-center p-8 overflow-auto" onClick={onClose}>
        <div 
          className="bg-white rounded-lg shadow-2xl w-full max-w-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateTask(task.id, { 
                  status: task.status === 'completed' ? 'todo' : 'completed',
                  ...(task.status !== 'completed' && { completedDate: new Date().toISOString() })
                })}
                className="text-gray-400 hover:text-green-600 transition-colors"
                aria-label={task.status === 'completed' ? 'Mark incomplete' : 'Mark complete'}
              >
                {task.status === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </button>
              <span className="text-sm text-gray-500">Task</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDelete}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Task Title */}
            <div>
              {isEditingTitle ? (
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleTitleSave();
                    if (e.key === 'Escape') {
                      setEditedTitle(task.title);
                      setIsEditingTitle(false);
                    }
                  }}
                  className="text-2xl font-bold text-gray-900 w-full border-none outline-none focus:ring-0 p-0"
                  autoFocus
                />
              ) : (
                <h1
                  onClick={() => setIsEditingTitle(true)}
                  className="text-2xl font-bold text-gray-900 cursor-text hover:bg-gray-50 rounded px-1 -mx-1"
                >
                  {task.title}
                </h1>
              )}
            </div>

            {/* AI Suggestions */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="text-purple-600">✨ Ask Brain</span>
              <span>to write a description, create a summary or find similar tasks</span>
            </div>

            {/* Properties Grid */}
            <div className="space-y-3">
              {/* Status */}
              <div className="flex items-center gap-3">
                <div className="w-32 flex items-center gap-2 text-sm text-gray-600">
                  <Circle className="w-4 h-4" />
                  <span>Status</span>
                </div>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  aria-label="Task status"
                >
                  {STATUS_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assignees */}
              <div className="flex items-center gap-3">
                <div className="w-32 flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>Assignees</span>
                </div>
                <div className="flex-1">
                  {assignee ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                        {(assignee.fullName || assignee.username)?.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-900">
                        {assignee.fullName || assignee.username}
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50 rounded-lg border border-dashed border-gray-300"
                    >
                      Empty
                    </button>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-center gap-3">
                <div className="w-32 flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Dates</span>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="date"
                    value={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => updateTask(task.id, { dueDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    aria-label="Due date"
                  />
                  <span className="text-sm text-gray-400">→</span>
                  <span className="text-sm text-gray-500">Due</span>
                </div>
              </div>

              {/* Priority */}
              <div className="flex items-center gap-3">
                <div className="w-32 flex items-center gap-2 text-sm text-gray-600">
                  <Flag className="w-4 h-4" />
                  <span>Priority</span>
                </div>
                <select
                  value={task.priority || ''}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  aria-label="Task priority"
                >
                  <option value="">Empty</option>
                  {PRIORITY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Estimate */}
              <div className="flex items-center gap-3">
                <div className="w-32 flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Time Estimate</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={task.estimatedHours || ''}
                  onChange={(e) => updateTask(task.id, { estimatedHours: parseFloat(e.target.value) || 0 })}
                  placeholder="Empty"
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  aria-label="Time estimate in hours"
                />
              </div>

              {/* Tags */}
              <div className="flex items-center gap-3">
                <div className="w-32 flex items-center gap-2 text-sm text-gray-600">
                  <Tag className="w-4 h-4" />
                  <span>Tags</span>
                </div>
                <div className="flex-1">
                  {task.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {task.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50 rounded-lg border border-dashed border-gray-300"
                    >
                      Empty
                    </button>
                  )}
                </div>
              </div>

              {/* Relationships */}
              <div className="flex items-center gap-3">
                <div className="w-32 flex items-center gap-2 text-sm text-gray-600">
                  <Link2 className="w-4 h-4" />
                  <span>Relationships</span>
                </div>
                <button
                  type="button"
                  className="flex-1 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50 rounded-lg border border-dashed border-gray-300 text-left"
                >
                  Empty
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <button
                type="button"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <Plus className="w-4 h-4" />
                <span>Add description</span>
              </button>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleDescriptionBlur}
                placeholder="Add a description..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                rows={3}
              />
            </div>

            {/* Custom Fields */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="button"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <Plus className="w-4 h-4" />
                <span>Create a field on this location</span>
              </button>
            </div>

            {/* Subtasks */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">
                  Subtasks
                  <span className="ml-2 text-gray-500 font-normal">
                    {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
                  </span>
                </h3>
                {task.subtasks.length > 0 && (
                  <span className="text-xs text-gray-500">
                    {task.subtasks.filter(st => st.assigneeId).length} Assigned to me
                  </span>
                )}
              </div>

              {/* Subtasks Table Header */}
              {task.subtasks.length > 0 && (
                <div className="grid grid-cols-[1fr_120px_100px_120px] gap-4 px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-200">
                  <div>Name</div>
                  <div>Assignee</div>
                  <div>Priority</div>
                  <div>Due date</div>
                </div>
              )}

              {/* Subtasks List */}
              <div className="space-y-1">
                {task.subtasks.map(subtask => {
                  const subtaskAssignee = users.find((u: any) => u.id === subtask.assigneeId);
                  return (
                    <div
                      key={subtask.id}
                      className="grid grid-cols-[1fr_120px_100px_120px] gap-4 px-3 py-2 hover:bg-gray-50 rounded-lg group"
                    >
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleSubtask(task.id, subtask.id)}
                          className="flex-shrink-0"
                          aria-label={subtask.completed ? 'Mark incomplete' : 'Mark complete'}
                        >
                          {subtask.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                        <span className={`text-sm ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {subtask.title}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        {subtaskAssignee ? (
                          <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs">
                              {(subtaskAssignee.fullName || subtaskAssignee.username)?.charAt(0)}
                            </div>
                            <span className="text-xs truncate">
                              {subtaskAssignee.fullName || subtaskAssignee.username}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-gray-400">-</div>
                      <div className="flex items-center text-xs text-gray-400">-</div>
                    </div>
                  );
                })}
              </div>

              {/* Add Subtask */}
              <div className="mt-2">
                <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg">
                  <Plus className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newSubtask.trim()) {
                        handleAddSubtask();
                      }
                    }}
                    placeholder="Add task"
                    className="flex-1 text-sm border-none outline-none focus:ring-0 p-0 bg-transparent"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Activity Sidebar */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Activity</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                aria-label="Search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button
                type="button"
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                aria-label="Filter"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
              <button
                type="button"
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                aria-label="More options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Show more
          </button>
        </div>

        {/* Activity Timeline */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Creation Event */}
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <User className="w-3 h-3 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">You</span> created subtask: create the about
              </p>
              <p className="text-xs text-gray-500 mt-1">Yesterday at 9:45 am</p>
            </div>
          </div>

          {/* Comments */}
          {task.comments.map(comment => {
            const user = users.find((u: any) => u.id === comment.userId);
            return (
              <div key={comment.id} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                  {(user?.fullName || user?.username)?.charAt(0) || '?'}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{comment.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comment Input */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-semibold">
              {currentUser?.username?.charAt(0) || '?'}
            </div>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newComment.trim()) {
                  handleAddComment();
                }
              }}
              placeholder="Mention @Brain to create, find, ask anything..."
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
              aria-label="Add comment"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
              aria-label="Mention"
            >
              <span className="text-sm">@</span>
            </button>
            <button
              type="button"
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
              aria-label="Emoji"
            >
              <span className="text-sm">😊</span>
            </button>
            <button
              type="button"
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
              aria-label="Attach"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <button
              type="button"
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded ml-auto"
              aria-label="More options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
