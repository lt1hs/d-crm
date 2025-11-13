import React, { useState } from 'react';
import { NewsPost } from '../../types/news';
import { useAuth } from '../../context/AuthContext';
import { X, Send, CheckCircle, XCircle, Calendar, Upload, MessageSquare } from '../Icons';
import { getStatusColor, getStatusLabel, getAvailableActions, addComment, createRevision } from '../../utils/newsHelpers';
import NewsWorkflowTimeline from './NewsWorkflowTimeline';
import NewsActionModal, { ActionData } from './NewsActionModal';

interface NewsWorkflowModalProps {
  post: NewsPost;
  onClose: () => void;
  onAction: (post: NewsPost) => void;
}

const NewsWorkflowModal: React.FC<NewsWorkflowModalProps> = ({ post, onClose, onAction }) => {
  const { currentUser } = useAuth();
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState<'workflow' | 'comments' | 'history' | 'timeline'>('workflow');
  const [showActionModal, setShowActionModal] = useState<string | null>(null);

  if (!currentUser) return null;

  const availableActions = getAvailableActions(post, currentUser.role, currentUser.id);

  const handleActionClick = (action: string) => {
    setShowActionModal(action);
  };

  const handleActionConfirm = (action: string, data: ActionData) => {
    let updatedPost = { ...post };
    const now = new Date().toISOString();

    // Update priority if changed
    if (data.priority) {
      updatedPost.priority = data.priority;
    }

    // Update deadline if set
    if (data.deadline) {
      updatedPost.overallDeadline = data.deadline;
    }

    // Update assignment if set
    if (data.assignedUserId) {
      if (action === 'submit_for_design') {
        updatedPost.assignedDesignerId = data.assignedUserId;
        updatedPost.assignedDesignerName = data.assignedUserName;
      } else if (action === 'submit_for_review') {
        updatedPost.assignedReviewerId = data.assignedUserId;
        updatedPost.assignedReviewerName = data.assignedUserName;
      }
    }

    switch (action) {
      case 'submit_for_design':
        updatedPost.status = 'awaiting_design';
        updatedPost.submittedForDesignAt = now;
        updatedPost = addComment(
          updatedPost,
          currentUser.id,
          currentUser.username,
          currentUser.role,
          data.comment || 'Post submitted for design',
          'general'
        );
        break;

      case 'start_design':
        updatedPost.status = 'in_design';
        updatedPost.designerId = currentUser.id;
        updatedPost.designerName = currentUser.username;
        updatedPost = addComment(
          updatedPost,
          currentUser.id,
          currentUser.username,
          currentUser.role,
          data.comment || 'Started working on design',
          'general'
        );
        break;

      case 'submit_for_review':
        updatedPost.status = 'pending_review';
        updatedPost.submittedForReviewAt = now;
        updatedPost = addComment(
          updatedPost,
          currentUser.id,
          currentUser.username,
          currentUser.role,
          data.comment || 'Post submitted for review',
          'general'
        );
        break;

      case 'approve':
        updatedPost.status = 'approved';
        updatedPost.approvedAt = now;
        updatedPost.reviewerId = currentUser.id;
        updatedPost.reviewerName = currentUser.username;
        updatedPost = addComment(
          updatedPost,
          currentUser.id,
          currentUser.username,
          currentUser.role,
          data.comment || 'Post approved',
          'approval'
        );
        break;

      case 'request_revision':
        updatedPost.status = 'needs_revision';
        updatedPost.reviewerId = currentUser.id;
        updatedPost.reviewerName = currentUser.username;
        updatedPost = addComment(
          updatedPost,
          currentUser.id,
          currentUser.username,
          currentUser.role,
          data.comment || 'Revision requested',
          'revision_request'
        );
        updatedPost = createRevision(updatedPost, currentUser.id, currentUser.username, 'Revision requested');
        break;

      case 'publish':
        updatedPost.status = 'published';
        updatedPost.publishedAt = now;
        updatedPost = addComment(
          updatedPost,
          currentUser.id,
          currentUser.username,
          currentUser.role,
          data.comment || 'Post published',
          'general'
        );
        break;

      case 'schedule':
        updatedPost.status = 'scheduled';
        updatedPost.scheduledFor = data.scheduledDate;
        updatedPost = addComment(
          updatedPost,
          currentUser.id,
          currentUser.username,
          currentUser.role,
          data.comment || `Post scheduled for ${new Date(data.scheduledDate!).toLocaleString()}`,
          'general'
        );
        break;
    }

    updatedPost.updatedAt = now;
    onAction(updatedPost);
    setShowActionModal(null);
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;

    const updatedPost = addComment(
      post,
      currentUser.id,
      currentUser.username,
      currentUser.role,
      comment,
      'general'
    );
    onAction(updatedPost);
    setComment('');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                {getStatusLabel(post.status)}
              </span>
              <span className="text-sm text-gray-500">Version {post.currentVersion}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('workflow')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'workflow'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Workflow
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'comments'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Comments ({post.comments.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'history'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              History
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('timeline')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'timeline'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Timeline
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'workflow' && (
            <div className="space-y-6">
              {/* Post Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Author:</span>
                    <span className="ml-2 font-medium">{post.authorName}</span>
                  </div>
                  {post.designerName && (
                    <div>
                      <span className="text-gray-600">Designer:</span>
                      <span className="ml-2 font-medium">{post.designerName}</span>
                    </div>
                  )}
                  {post.reviewerName && (
                    <div>
                      <span className="text-gray-600">Reviewer:</span>
                      <span className="ml-2 font-medium">{post.reviewerName}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <span className="ml-2">{formatDate(post.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Updated:</span>
                    <span className="ml-2">{formatDate(post.updatedAt)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Images:</span>
                    <span className="ml-2">{post.images.length}</span>
                  </div>
                </div>
              </div>

              {/* Images Preview */}
              {post.images.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Images</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {post.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Available Actions */}
              {availableActions.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Available Actions</h3>
                  <div className="space-y-3">
                    {availableActions.includes('submit_for_design') && (
                      <button
                        type="button"
                        onClick={() => handleActionClick('submit_for_design')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Send className="w-5 h-5" />
                        Submit for Design
                      </button>
                    )}

                    {availableActions.includes('start_design') && (
                      <button
                        type="button"
                        onClick={() => handleActionClick('start_design')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        <Upload className="w-5 h-5" />
                        Start Design Work
                      </button>
                    )}

                    {availableActions.includes('submit_for_review') && (
                      <button
                        type="button"
                        onClick={() => handleActionClick('submit_for_review')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        <Send className="w-5 h-5" />
                        Submit for Review
                      </button>
                    )}

                    {availableActions.includes('approve') && (
                      <button
                        type="button"
                        onClick={() => handleActionClick('approve')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Approve Post
                      </button>
                    )}

                    {availableActions.includes('request_revision') && (
                      <button
                        type="button"
                        onClick={() => handleActionClick('request_revision')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                      >
                        <XCircle className="w-5 h-5" />
                        Request Revision
                      </button>
                    )}

                    {availableActions.includes('publish') && (
                      <button
                        type="button"
                        onClick={() => handleActionClick('publish')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Publish Now
                      </button>
                    )}

                    {availableActions.includes('schedule') && (
                      <button
                        type="button"
                        onClick={() => handleActionClick('schedule')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        <Calendar className="w-5 h-5" />
                        Schedule Post
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-4">
              {/* Add Comment */}
              <div className="space-y-2">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <button
                  onClick={handleAddComment}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <MessageSquare className="w-5 h-5" />
                  Add Comment
                </button>
              </div>

              {/* Comments List */}
              <div className="space-y-3">
                {post.comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No comments yet</p>
                ) : (
                  post.comments.map((c) => (
                    <div
                      key={c.id}
                      className={`p-4 rounded-lg ${
                        c.type === 'revision_request'
                          ? 'bg-orange-50 border-l-4 border-orange-400'
                          : c.type === 'approval'
                          ? 'bg-green-50 border-l-4 border-green-400'
                          : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="font-medium text-gray-900">{c.username}</span>
                          <span className="text-sm text-gray-500 ml-2">({c.userRole})</span>
                        </div>
                        <span className="text-sm text-gray-500">{formatDate(c.timestamp)}</span>
                      </div>
                      <p className="text-gray-700">{c.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              {post.revisions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No revision history</p>
              ) : (
                post.revisions.map((revision) => (
                  <div key={revision.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="font-medium text-gray-900">Version {revision.version}</span>
                        <span className="text-sm text-gray-500 ml-2">by {revision.modifiedBy}</span>
                      </div>
                      <span className="text-sm text-gray-500">{formatDate(revision.modifiedAt)}</span>
                    </div>
                    <p className="text-gray-700">{revision.changes}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <NewsWorkflowTimeline post={post} />
          )}
        </div>
      </div>

      {/* Action Modal */}
      {showActionModal && (
        <NewsActionModal
          post={post}
          action={showActionModal as any}
          onConfirm={(data) => handleActionConfirm(showActionModal, data)}
          onCancel={() => setShowActionModal(null)}
        />
      )}
    </div>
  );
};

export default NewsWorkflowModal;
