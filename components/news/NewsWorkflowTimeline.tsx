import React from 'react';
import { NewsPost } from '../../types/news';
import { CheckCircle, Clock, AlertCircle } from '../Icons';
import { getStatusLabel } from '../../utils/newsHelpers';

interface NewsWorkflowTimelineProps {
  post: NewsPost;
}

const NewsWorkflowTimeline: React.FC<NewsWorkflowTimelineProps> = ({ post }) => {
  const stages = [
    { status: 'draft', label: 'Draft Created', timestamp: post.createdAt, user: post.authorName },
    { status: 'awaiting_design', label: 'Submitted for Design', timestamp: post.submittedForDesignAt, user: post.authorName },
    { status: 'in_design', label: 'Design Started', timestamp: post.submittedForDesignAt, user: post.designerName },
    { status: 'pending_review', label: 'Submitted for Review', timestamp: post.submittedForReviewAt, user: post.designerName },
    { status: 'approved', label: 'Approved', timestamp: post.approvedAt, user: post.reviewerName },
    { status: 'published', label: 'Published', timestamp: post.publishedAt, user: post.reviewerName },
  ];

  const completedStages = stages.filter(stage => stage.timestamp);
  const currentStageIndex = completedStages.length - 1;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStageIcon = (index: number) => {
    if (index < currentStageIndex) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    } else if (index === currentStageIndex) {
      return <Clock className="w-5 h-5 text-blue-600" />;
    } else {
      return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Workflow Timeline</h3>
      
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-gray-200" />
        
        {/* Timeline items */}
        <div className="space-y-6">
          {stages.map((stage, index) => {
            const isCompleted = index < currentStageIndex;
            const isCurrent = index === currentStageIndex;
            const hasPassed = stage.timestamp;
            
            return (
              <div key={stage.status} className="relative flex items-start gap-4">
                {/* Icon */}
                <div className="relative z-10 bg-white">
                  {getStageIcon(index)}
                </div>
                
                {/* Content */}
                <div className={`flex-1 ${!hasPassed ? 'opacity-50' : ''}`}>
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${isCurrent ? 'text-blue-600' : 'text-gray-900'}`}>
                      {stage.label}
                    </h4>
                    {hasPassed && (
                      <span className="text-sm text-gray-500">
                        {formatDate(stage.timestamp)}
                      </span>
                    )}
                  </div>
                  {stage.user && hasPassed && (
                    <p className="text-sm text-gray-600 mt-1">
                      by {stage.user}
                    </p>
                  )}
                  {isCurrent && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                      <Clock className="w-4 h-4" />
                      <span>Current stage</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Revision indicator */}
      {post.status === 'needs_revision' && (
        <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          <div>
            <p className="text-sm font-medium text-orange-900">Revision Requested</p>
            <p className="text-sm text-orange-700">Changes needed before proceeding</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsWorkflowTimeline;
