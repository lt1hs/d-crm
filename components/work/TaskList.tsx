import React, { useState } from 'react';
import { useWork } from '../../context/WorkContext';
import { useAuth } from '../../context/AuthContext';
import { Plus, Search, Filter, Calendar, User, AlertCircle } from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../../types/work';
import { TaskForm } from './TaskForm';
import { TaskDetailModal } from './TaskDetailModal';
import { filterTasks, sortTasks, getTaskPriorityColor, getTaskStatusColor, isTaskOverdue } from '../../utils/workHelpers';

export const TaskList: React.FC = () => {
  const { tasks, projects } = useWork();
  const { currentUser } = useAuth();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem('users') || '[]').map((u: any) => ({
    id: u.id,
    name: u.fullName || u.username
  }));
  
  const [filters, setFilters] = useState({
    search: '',
    projectId: 'all',
    assigneeId: 'all',
    priority: 'all' as TaskPriority | 'all',
    status: 'all' as TaskStatus | 'all',
    tags: []
  });
  
  const [sortBy, setSortBy] = useState('createdAt');

  const filteredTasks = sortTasks(filterTasks(tasks, filters), sortBy);

  const openTaskDetail = (task: Task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Task List</h2>
          <p className="text-gray-600 mt-1">{filteredTasks.length} tasks</p>
        </div>
        <button
          onClick={() => setShowTaskForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filters.projectId}
            onChange={(e) => setFilters(prev => ({ ...prev, projectId: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>

          <select
            value={filters.assigneeId}
            onChange={(e) => setFilters(prev => ({ ...prev, assigneeId: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Assignees</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value as any }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="blocked">Blocked</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="createdAt">Created Date</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p>No tasks found matching your filters</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTasks.map(task => {
              const project = projects.find(p => p.id === task.projectId);
              const assignee = users.find(u => u.id === task.assigneeId);
              const overdue = isTaskOverdue(task);

              return (
                <div
                  key={task.id}
                  onClick={() => openTaskDetail(task)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{task.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                          {task.status.replace('-', ' ')}
                        </span>
                        {overdue && (
                          <span className="flex items-center gap-1 text-red-600 text-xs">
                            <AlertCircle className="w-3 h-3" />
                            Overdue
                          </span>
                        )}
                      </div>

                      {task.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-1">{task.description}</p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {project && (
                          <span className="flex items-center gap-1">
                            <div className={`w-3 h-3 rounded-full ${project.color}`} />
                            {project.name}
                          </span>
                        )}
                        {assignee && (
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {assignee.name}
                          </span>
                        )}
                        {task.dueDate && (
                          <span className={`flex items-center gap-1 ${overdue ? 'text-red-600' : ''}`}>
                            <Calendar className="w-4 h-4" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        {task.subtasks.length > 0 && (
                          <span>
                            {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtasks
                          </span>
                        )}
                        {task.comments.length > 0 && (
                          <span>{task.comments.length} comments</span>
                        )}
                      </div>

                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {task.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
