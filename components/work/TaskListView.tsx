import React, { useState } from 'react';
import { Task, TaskStatus } from '../../types/work';
import { useWork } from '../../context/WorkContext';
import { ChevronDown, ChevronRight, Plus, Calendar, Flag, User, Clock, CheckCircle2 } from 'lucide-react';
import { TaskForm } from './TaskForm';
import { TaskDetailModal } from './TaskDetailModal';
import { isTaskOverdue } from '../../utils/workHelpers';

const STATUS_GROUPS: { 
  status: TaskStatus; 
  title: string;
  color: string;
  bgColor: string;
}[] = [
  { 
    status: 'todo', 
    title: 'TO DO',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50'
  },
  { 
    status: 'in-progress', 
    title: 'IN PROGRESS',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50'
  },
  { 
    status: 'review', 
    title: 'REVIEW',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50'
  },
  { 
    status: 'blocked', 
    title: 'BLOCKED',
    color: 'text-red-700',
    bgColor: 'bg-red-50'
  },
  { 
    status: 'completed', 
    title: 'COMPLETE',
    color: 'text-green-700',
    bgColor: 'bg-green-50'
  }
];

const PRIORITY_CONFIG: Record<string, { color: string; bgColor: string; label: string }> = {
  low: { 
    color: 'text-gray-600', 
    bgColor: 'bg-gray-100',
    label: 'Low'
  },
  medium: { 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-100',
    label: 'Medium'
  },
  high: { 
    color: 'text-orange-600', 
    bgColor: 'bg-orange-100',
    label: 'High'
  },
  urgent: { 
    color: 'text-red-600', 
    bgColor: 'bg-red-100',
    label: 'Urgent'
  }
};

export const TaskListView: React.FC = () => {
  const { tasks, updateTask } = useWork();
  const [expandedGroups, setExpandedGroups] = useState<Set<TaskStatus>>(
    new Set(['todo', 'in-progress', 'review', 'blocked'])
  );
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const toggleGroup = (status: TaskStatus) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(status)) {
      newExpanded.delete(status);
    } else {
      newExpanded.add(status);
    }
    setExpandedGroups(newExpanded);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(t => t.status === status);
  };

  const toggleTaskComplete = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus: TaskStatus = task.status === 'completed' ? 'todo' : 'completed';
    updateTask(task.id, {
      status: newStatus,
      ...(newStatus === 'completed' && { completedDate: new Date().toISOString() })
    });
  };

  const openTaskDetail = (task: Task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const overdueTasks = tasks.filter(t => isTaskOverdue(t)).length;
  const tasksWithDueDates = tasks.filter(t => t.dueDate).length;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Total Tasks:</span>
            <span className="text-sm font-bold text-gray-900">{totalTasks}</span>
          </div>
          <div className="w-px h-4 bg-gray-300" />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Completed:</span>
            <span className="text-sm font-bold text-green-600">{completedTasks}</span>
          </div>
          <div className="w-px h-4 bg-gray-300" />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">In Progress:</span>
            <span className="text-sm font-bold text-purple-600">
              {tasks.filter(t => t.status === 'in-progress').length}
            </span>
          </div>
          {overdueTasks > 0 && (
            <>
              <div className="w-px h-4 bg-gray-300" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Overdue:</span>
                <span className="text-sm font-bold text-red-600">{overdueTasks}</span>
              </div>
            </>
          )}
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{tasksWithDueDates} tasks with due dates</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header Row */}
          <div className="bg-white rounded-t-lg border border-gray-200 sticky top-0 z-10 shadow-sm">
            <div className="grid grid-cols-[40px_minmax(300px,1fr)_140px_120px_140px_100px] gap-4 px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">
              <div></div>
              <div>Task Name</div>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Assignee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Due Date</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5" />
                <span>Priority</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Time</span>
              </div>
            </div>
          </div>

          {/* Task Groups */}
          <div className="bg-white border-x border-b border-gray-200 rounded-b-lg">
            {STATUS_GROUPS.map((group, groupIndex) => {
              const groupTasks = getTasksByStatus(group.status);
              const isExpanded = expandedGroups.has(group.status);

              return (
                <div key={group.status} className={groupIndex > 0 ? 'border-t border-gray-200' : ''}>
                  {/* Group Header */}
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.status)}
                    className={`w-full flex items-center gap-3 px-6 py-3 ${group.bgColor} hover:opacity-80 transition-all`}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {isExpanded ? (
                        <ChevronDown className={`w-4 h-4 ${group.color}`} />
                      ) : (
                        <ChevronRight className={`w-4 h-4 ${group.color}`} />
                      )}
                      <span className={`text-sm font-bold ${group.color} uppercase tracking-wide`}>
                        {group.title}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${group.color} bg-white/60`}>
                        {groupTasks.length}
                      </span>
                    </div>
                    {groupTasks.length > 0 && (
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span>{groupTasks.filter(t => t.dueDate).length} with due dates</span>
                        <span>{groupTasks.filter(t => t.subtasks.length > 0).length} with subtasks</span>
                      </div>
                    )}
                  </button>

                  {/* Group Tasks */}
                  {isExpanded && (
                    <div>
                      {groupTasks.length === 0 ? (
                        <div className="px-6 py-8 text-center">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                            <CheckCircle2 className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-500 mb-1">No tasks in this group</p>
                          <p className="text-xs text-gray-400">Add a task to get started</p>
                        </div>
                      ) : (
                        groupTasks.map((task, taskIndex) => {
                        const completedSubtasks = task.subtasks.filter(st => st.completed).length;
                        const totalSubtasks = task.subtasks.length;
                        const overdue = isTaskOverdue(task);
                        const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
                        
                        // Get users from localStorage for assignee display
                        const users = JSON.parse(localStorage.getItem('users') || '[]');
                        const assignee = users.find((u: any) => u.id === task.assigneeId);

                        return (
                          <div
                            key={task.id}
                            onClick={() => openTaskDetail(task)}
                            className={`grid grid-cols-[40px_minmax(300px,1fr)_140px_120px_140px_100px] gap-4 px-6 py-3.5 hover:bg-gray-50 cursor-pointer transition-all group border-b border-gray-100 last:border-b-0 ${
                              task.status === 'completed' ? 'opacity-60' : ''
                            }`}
                          >
                            {/* Checkbox */}
                            <div className="flex items-center">
                              <button
                                type="button"
                                onClick={(e) => toggleTaskComplete(task, e)}
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                  task.status === 'completed'
                                    ? 'bg-green-500 border-green-500'
                                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                }`}
                                aria-label={task.status === 'completed' ? 'Mark incomplete' : 'Mark complete'}
                              >
                                {task.status === 'completed' && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                )}
                              </button>
                            </div>

                            {/* Task Name */}
                            <div className="flex flex-col justify-center min-w-0">
                              <div className={`text-sm font-medium mb-1 ${
                                task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900 group-hover:text-blue-600'
                              }`}>
                                {task.title}
                              </div>
                              <div className="flex items-center gap-3">
                                {totalSubtasks > 0 && (
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>{completedSubtasks}/{totalSubtasks}</span>
                                    </div>
                                    <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-blue-500 transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                      />
                                    </div>
                                  </div>
                                )}
                                {task.tags.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    {task.tags.slice(0, 2).map(tag => (
                                      <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                        {tag}
                                      </span>
                                    ))}
                                    {task.tags.length > 2 && (
                                      <span className="text-xs text-gray-400">+{task.tags.length - 2}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Assignee */}
                            <div className="flex items-center">
                              {assignee ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                                    {assignee.fullName?.charAt(0) || assignee.username?.charAt(0) || '?'}
                                  </div>
                                  <span className="text-sm text-gray-700 truncate">
                                    {assignee.fullName || assignee.username}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400">Unassigned</span>
                              )}
                            </div>

                            {/* Due Date */}
                            <div className="flex items-center">
                              {task.dueDate ? (
                                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${
                                  overdue 
                                    ? 'bg-red-50 text-red-700' 
                                    : 'bg-gray-50 text-gray-700'
                                }`}>
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span className="text-xs font-medium">
                                    {new Date(task.dueDate).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400">No date</span>
                              )}
                            </div>

                            {/* Priority */}
                            <div className="flex items-center">
                              {task.priority && PRIORITY_CONFIG[task.priority] ? (
                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md ${PRIORITY_CONFIG[task.priority].bgColor}`}>
                                  <Flag className={`w-3.5 h-3.5 ${PRIORITY_CONFIG[task.priority].color}`} />
                                  <span className={`text-xs font-semibold ${PRIORITY_CONFIG[task.priority].color}`}>
                                    {PRIORITY_CONFIG[task.priority].label}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400">-</span>
                              )}
                            </div>

                            {/* Time */}
                            <div className="flex items-center">
                              {(task.estimatedHours || task.actualHours) ? (
                                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span className="font-medium">
                                    {task.actualHours || 0}h / {task.estimatedHours || 0}h
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400">-</span>
                              )}
                            </div>
                          </div>
                        );
                      }))}

                      {/* Add Task Button */}
                      <div className="px-6 py-3 border-b border-gray-100 last:border-b-0">
                        <button
                          type="button"
                          onClick={() => setShowTaskForm(true)}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="font-medium">Add task to {group.title}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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
