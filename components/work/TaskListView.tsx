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
    title: 'To Do',
    color: 'text-gray-700 dark:text-gray-300',
    bgColor: 'bg-gray-50/50 dark:bg-gray-800/50'
  },
  { 
    status: 'in-progress', 
    title: 'In Progress',
    color: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-50/50 dark:bg-blue-900/20'
  },
  { 
    status: 'completed', 
    title: 'Completed',
    color: 'text-green-700 dark:text-green-400',
    bgColor: 'bg-green-50/50 dark:bg-green-900/20'
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
    new Set(['todo', 'in-progress'])
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
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Sleeker Stats Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200/60 dark:border-gray-700/60 px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500 dark:text-gray-400">Total:</span>
            <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">{totalTasks}</span>
          </div>
          <div className="w-px h-3 bg-gray-300 dark:bg-gray-600" />
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500 dark:text-gray-400">Completed:</span>
            <span className="text-xs font-semibold text-green-600 dark:text-green-400">{completedTasks}</span>
          </div>
          <div className="w-px h-3 bg-gray-300 dark:bg-gray-600" />
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500 dark:text-gray-400">In Progress:</span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              {tasks.filter(t => t.status === 'in-progress').length}
            </span>
          </div>
          {overdueTasks > 0 && (
            <>
              <div className="w-px h-3 bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500 dark:text-gray-400">Overdue:</span>
                <span className="text-xs font-semibold text-red-600 dark:text-red-400">{overdueTasks}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-4">
          {/* Sleeker Header Row */}
          <div className="bg-white dark:bg-gray-800 rounded-t-xl border border-gray-200/60 dark:border-gray-700/60 sticky top-0 z-10">
            <div className="grid grid-cols-[40px_minmax(300px,1fr)_140px_120px_140px_100px] gap-4 px-5 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
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
          <div className="bg-white dark:bg-gray-800 border-x border-b border-gray-200/60 dark:border-gray-700/60 rounded-b-xl">
            {STATUS_GROUPS.map((group, groupIndex) => {
              const groupTasks = getTasksByStatus(group.status);
              const isExpanded = expandedGroups.has(group.status);

              return (
                <div key={group.status} className={groupIndex > 0 ? 'border-t border-gray-100 dark:border-gray-700/50' : ''}>
                  {/* Sleeker Group Header */}
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.status)}
                    className={`w-full flex items-center gap-3 px-5 py-2.5 ${group.bgColor} hover:bg-opacity-80 transition-all`}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {isExpanded ? (
                        <ChevronDown className={`w-3.5 h-3.5 ${group.color}`} />
                      ) : (
                        <ChevronRight className={`w-3.5 h-3.5 ${group.color}`} />
                      )}
                      <span className={`text-xs font-semibold ${group.color} tracking-wide`}>
                        {group.title}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300`}>
                        {groupTasks.length}
                      </span>
                    </div>
                    {groupTasks.length > 0 && (
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span>{groupTasks.filter(t => t.dueDate).length} due dates</span>
                        <span>{groupTasks.filter(t => t.subtasks.length > 0).length} subtasks</span>
                      </div>
                    )}
                  </button>

                  {/* Group Tasks */}
                  {isExpanded && (
                    <div>
                      {groupTasks.length === 0 ? (
                        <div className="px-5 py-6 text-center">
                          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 mb-2">
                            <CheckCircle2 className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">No tasks in this group</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">Add a task to get started</p>
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
                            className={`grid grid-cols-[40px_minmax(300px,1fr)_140px_120px_140px_100px] gap-4 px-5 py-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 cursor-pointer transition-all group border-b border-gray-100 dark:border-gray-700/50 last:border-b-0 ${
                              task.status === 'completed' ? 'opacity-50' : ''
                            }`}
                          >
                            {/* Checkbox */}
                            <div className="flex items-center">
                              <button
                                type="button"
                                onClick={(e) => toggleTaskComplete(task, e)}
                                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                                  task.status === 'completed'
                                    ? 'bg-green-500 border-green-500'
                                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                                aria-label={task.status === 'completed' ? 'Mark incomplete' : 'Mark complete'}
                              >
                                {task.status === 'completed' && (
                                  <CheckCircle2 className="w-3 h-3 text-white" />
                                )}
                              </button>
                            </div>

                            {/* Task Name */}
                            <div className="flex flex-col justify-center min-w-0">
                              <div className={`text-sm font-medium mb-1 ${
                                task.status === 'completed' ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400'
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
                      <div className="px-5 py-2.5 border-b border-gray-100 dark:border-gray-700/50 last:border-b-0">
                        <button
                          type="button"
                          onClick={() => setShowTaskForm(true)}
                          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to {group.title}</span>
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
