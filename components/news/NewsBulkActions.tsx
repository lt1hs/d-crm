import React, { useState } from 'react';
import { NewsPost } from '../../types/news';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, XCircle, Trash2, Calendar } from '../Icons';
import { canBulkApprove, canBulkPublish } from '../../utils/newsHelpers';

interface NewsBulkActionsProps {
  selectedPosts: NewsPost[];
  onBulkAction: (action: string, posts: NewsPost[]) => void;
  onClearSelection: () => void;
}

const NewsBulkActions: React.FC<NewsBulkActionsProps> = ({
  selectedPosts,
  onBulkAction,
  onClearSelection,
}) => {
  const { currentUser } = useAuth();
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');

  if (!currentUser || selectedPosts.length === 0) return null;

  const canApprove = canBulkApprove(selectedPosts, currentUser.role);
  const canPublish = canBulkPublish(selectedPosts, currentUser.role);
  const canDelete = currentUser.role === 'super_admin' || currentUser.role === 'admin';

  const handleBulkApprove = () => {
    if (confirm(`Approve ${selectedPosts.length} posts?`)) {
      onBulkAction('approve', selectedPosts);
    }
  };

  const handleBulkPublish = () => {
    if (confirm(`Publish ${selectedPosts.length} posts immediately?`)) {
      onBulkAction('publish', selectedPosts);
    }
  };

  const handleBulkSchedule = () => {
    if (!scheduledDate) {
      alert('Please select a date and time');
      return;
    }
    if (confirm(`Schedule ${selectedPosts.length} posts for ${new Date(scheduledDate).toLocaleString()}?`)) {
      onBulkAction('schedule', selectedPosts);
      setShowSchedule(false);
      setScheduledDate('');
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedPosts.length} posts? This action cannot be undone.`)) {
      onBulkAction('delete', selectedPosts);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          {/* Selection count */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{selectedPosts.length} selected</span>
            <button
              type="button"
              onClick={onClearSelection}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear
            </button>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-300" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            {canApprove && (
              <button
                type="button"
                onClick={handleBulkApprove}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                <CheckCircle className="w-4 h-4" />
                Approve All
              </button>
            )}

            {canPublish && (
              <>
                <button
                  type="button"
                  onClick={handleBulkPublish}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Publish All
                </button>

                <button
                  type="button"
                  onClick={() => setShowSchedule(!showSchedule)}
                  className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule All
                </button>
              </>
            )}

            {canDelete && (
              <button
                type="button"
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete All
              </button>
            )}
          </div>
        </div>

        {/* Schedule input */}
        {showSchedule && (
          <div className="mt-4 pt-4 border-t flex items-center gap-3">
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
              aria-label="Schedule date and time"
            />
            <button
              type="button"
              onClick={handleBulkSchedule}
              className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
            >
              Confirm Schedule
            </button>
            <button
              type="button"
              onClick={() => setShowSchedule(false)}
              className="px-3 py-2 text-gray-600 hover:text-gray-900 text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsBulkActions;
