import React, { useState } from 'react';
import { NewsPost, NewsPriority } from '../../types/news';
import { useAuth } from '../../context/AuthContext';
import { X, Send, CheckCircle, XCircle, Calendar, AlertCircle, User } from '../Icons';

interface NewsActionModalProps {
  post: NewsPost;
  action: 'submit_for_design' | 'start_design' | 'submit_for_review' | 'approve' | 'request_revision' | 'publish' | 'schedule';
  onConfirm: (data: ActionData) => void;
  onCancel: () => void;
}

export interface ActionData {
  comment?: string;
  priority?: NewsPriority;
  deadline?: string;
  assignedUserId?: string;
  assignedUserName?: string;
  scheduledDate?: string;
  notifyUsers?: boolean;
  addToCalendar?: boolean;
}

const NewsActionModal: React.FC<NewsActionModalProps> = ({ post, action, onConfirm, onCancel }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState<ActionData>({
    comment: '',
    priority: post.priority,
    deadline: '',
    assignedUserId: '',
    assignedUserName: '',
    scheduledDate: '',
    notifyUsers: true,
    addToCalendar: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const actionConfig = {
    submit_for_design: {
      title: 'Submit for Design',
      description: 'Submit this post to the design team for visual elements',
      icon: Send,
      color: 'blue',
      requiresComment: false,
      showPriority: true,
      showDeadline: true,
      showAssignment: true,
      assignmentRole: 'designer',
      confirmText: 'Submit for Design',
    },
    start_design: {
      title: 'Start Design Work',
      description: 'Begin adding images and visual elements to this post',
      icon: User,
      color: 'purple',
      requiresComment: false,
      showPriority: false,
      showDeadline: true,
      showAssignment: false,
      confirmText: 'Start Working',
    },
    submit_for_review: {
      title: 'Submit for Review',
      description: 'Submit this post to management for final review',
      icon: Send,
      color: 'indigo',
      requiresComment: false,
      showPriority: true,
      showDeadline: true,
      showAssignment: true,
      assignmentRole: 'reviewer',
      confirmText: 'Submit for Review',
    },
    approve: {
      title: 'Approve Post',
      description: 'Approve this post for publication',
      icon: CheckCircle,
      color: 'green',
      requiresComment: false,
      showPriority: false,
      showDeadline: false,
      showAssignment: false,
      confirmText: 'Approve Post',
    },
    request_revision: {
      title: 'Request Revision',
      description: 'Request changes to this post before approval',
      icon: XCircle,
      color: 'orange',
      requiresComment: true,
      showPriority: true,
      showDeadline: true,
      showAssignment: false,
      confirmText: 'Request Revision',
    },
    publish: {
      title: 'Publish Post',
      description: 'Publish this post immediately to the website',
      icon: CheckCircle,
      color: 'emerald',
      requiresComment: false,
      showPriority: false,
      showDeadline: false,
      showAssignment: false,
      confirmText: 'Publish Now',
    },
    schedule: {
      title: 'Schedule Post',
      description: 'Schedule this post for future publication',
      icon: Calendar,
      color: 'indigo',
      requiresComment: false,
      showPriority: false,
      showDeadline: false,
      showAssignment: false,
      confirmText: 'Schedule Post',
    },
  };

  const config = actionConfig[action];
  const Icon = config.icon;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (config.requiresComment && !formData.comment?.trim()) {
      newErrors.comment = 'Comment is required for this action';
    }

    if (action === 'schedule' && !formData.scheduledDate) {
      newErrors.scheduledDate = 'Please select a date and time';
    }

    if (action === 'schedule' && formData.scheduledDate) {
      const scheduledTime = new Date(formData.scheduledDate).getTime();
      const now = new Date().getTime();
      if (scheduledTime <= now) {
        newErrors.scheduledDate = 'Scheduled time must be in the future';
      }
    }

    if (config.showDeadline && formData.deadline) {
      const deadlineTime = new Date(formData.deadline).getTime();
      const now = new Date().getTime();
      if (deadlineTime <= now) {
        newErrors.deadline = 'Deadline must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onConfirm(formData);
    }
  };

  // Mock users for assignment (replace with actual user list)
  const availableUsers = [
    { id: '1', name: 'John Designer', role: 'designer' },
    { id: '2', name: 'Jane Designer', role: 'designer' },
    { id: '3', name: 'Boss Manager', role: 'boss' },
    { id: '4', name: 'Admin User', role: 'admin' },
  ];

  const filteredUsers = config.assignmentRole
    ? availableUsers.filter(u => u.role === config.assignmentRole || u.role === 'admin')
    : availableUsers;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`p-6 border-b bg-${config.color}-50`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 bg-${config.color}-100 rounded-lg`}>
                <Icon className={`w-6 h-6 text-${config.color}-600`} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{config.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{config.description}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Post Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">{post.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Author: {post.authorName}</span>
              <span>•</span>
              <span>Category: {post.category}</span>
              {post.images.length > 0 && (
                <>
                  <span>•</span>
                  <span>{post.images.length} image(s)</span>
                </>
              )}
            </div>
          </div>

          {/* Priority Selection */}
          {config.showPriority && (
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level
              </label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as NewsPriority })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">⚪ Low - Can wait</option>
                <option value="normal">🔵 Normal - Standard priority</option>
                <option value="high">🟠 High - Important</option>
                <option value="urgent">🔴 Urgent - Time-critical</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Set priority to help the team focus on what matters most
              </p>
            </div>
          )}

          {/* Deadline */}
          {config.showDeadline && (
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                Deadline (Optional)
              </label>
              <input
                id="deadline"
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.deadline ? 'border-red-500' : ''
                }`}
              />
              {errors.deadline && (
                <p className="text-sm text-red-600 mt-1">{errors.deadline}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Set a deadline for this stage to ensure timely completion
              </p>
            </div>
          )}

          {/* Assignment */}
          {config.showAssignment && (
            <div>
              <label htmlFor="assignment" className="block text-sm font-medium text-gray-700 mb-2">
                Assign to {config.assignmentRole === 'designer' ? 'Designer' : 'Reviewer'} (Optional)
              </label>
              <select
                id="assignment"
                value={formData.assignedUserId}
                onChange={(e) => {
                  const user = filteredUsers.find(u => u.id === e.target.value);
                  setFormData({
                    ...formData,
                    assignedUserId: e.target.value,
                    assignedUserName: user?.name || '',
                  });
                }}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Auto-assign (first available)</option>
                {filteredUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Assign to a specific person or let the system auto-assign
              </p>
            </div>
          )}

          {/* Schedule Date */}
          {action === 'schedule' && (
            <div>
              <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-2">
                Publication Date & Time *
              </label>
              <input
                id="scheduledDate"
                type="datetime-local"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.scheduledDate ? 'border-red-500' : ''
                }`}
                required
              />
              {errors.scheduledDate && (
                <p className="text-sm text-red-600 mt-1">{errors.scheduledDate}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                The post will be automatically published at this time
              </p>
            </div>
          )}

          {/* Comment */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              {config.requiresComment ? 'Comment *' : 'Comment (Optional)'}
            </label>
            <textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.comment ? 'border-red-500' : ''
              }`}
              placeholder={
                action === 'request_revision'
                  ? 'Explain what needs to be changed...'
                  : action === 'approve'
                  ? 'Add approval notes (optional)...'
                  : 'Add any notes or instructions...'
              }
              required={config.requiresComment}
            />
            {errors.comment && (
              <p className="text-sm text-red-600 mt-1">{errors.comment}</p>
            )}
            {action === 'request_revision' && (
              <div className="mt-2 flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-orange-800">
                  <p className="font-medium">Be specific about what needs to change</p>
                  <p className="mt-1">Clear feedback helps the team make the right revisions quickly</p>
                </div>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3 pt-4 border-t">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.notifyUsers}
                onChange={(e) => setFormData({ ...formData, notifyUsers: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm text-gray-700">
                Send notification to relevant team members
              </span>
            </label>
            {(action === 'schedule' || config.showDeadline) && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.addToCalendar}
                  onChange={(e) => setFormData({ ...formData, addToCalendar: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">
                  Add to team calendar
                </span>
              </label>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className={`flex items-center gap-2 px-4 py-2 bg-${config.color}-600 text-white rounded-lg hover:bg-${config.color}-700`}
          >
            <Icon className="w-5 h-5" />
            {config.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsActionModal;
