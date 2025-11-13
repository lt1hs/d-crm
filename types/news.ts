// News Post Workflow Types

export type NewsLanguage = 'en' | 'ar' | 'fr' | 'es' | 'de';

export type NewsStatus = 
  | 'draft'           // Author is writing
  | 'awaiting_design' // Text ready, waiting for designer
  | 'in_design'       // Designer is adding images
  | 'pending_review'  // Submitted to boss for review
  | 'needs_revision'  // Boss requested changes
  | 'approved'        // Boss approved, ready to publish
  | 'published'       // Published on website
  | 'scheduled';      // Scheduled for future publication

export type NewsPriority = 'urgent' | 'high' | 'normal' | 'low';

export interface NewsDeadline {
  stage: NewsStatus;
  deadline: string;
  notified: boolean;
}

export interface NewsComment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  userRole: string;
  comment: string;
  timestamp: string;
  type: 'feedback' | 'revision_request' | 'approval' | 'general';
}

export interface NewsRevision {
  id: string;
  postId: string;
  version: number;
  content: string;
  images: string[];
  modifiedBy: string;
  modifiedAt: string;
  changes: string;
}

export interface NewsPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  language: NewsLanguage;
  images: string[];
  category: string;
  tags: string[];
  status: NewsStatus;
  priority: NewsPriority;
  
  // Workflow tracking
  authorId: string;
  authorName: string;
  designerId?: string;
  designerName?: string;
  reviewerId?: string;
  reviewerName?: string;
  assignedDesignerId?: string;
  assignedDesignerName?: string;
  assignedReviewerId?: string;
  assignedReviewerName?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  submittedForDesignAt?: string;
  submittedForReviewAt?: string;
  approvedAt?: string;
  publishedAt?: string;
  scheduledFor?: string;
  
  // Deadlines
  deadlines: NewsDeadline[];
  overallDeadline?: string;
  
  // Workflow data
  comments: NewsComment[];
  revisions: NewsRevision[];
  currentVersion: number;
  
  // Publishing options
  featured?: boolean;
  allowComments?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  
  // Analytics
  views?: number;
  readTime?: number; // in minutes
  
  // Template
  templateId?: string;
}

export interface NewsWorkflowAction {
  action: 'submit_for_design' | 'start_design' | 'submit_for_review' | 'approve' | 'request_revision' | 'publish' | 'schedule';
  comment?: string;
  scheduledDate?: string;
}

export const newsCategories = [
  'Breaking News',
  'Technology',
  'Business',
  'Health',
  'Education',
  'Sports',
  'Entertainment',
  'Politics',
  'Science',
  'Culture',
  'Other'
];

export const newsTags = [
  'Featured',
  'Trending',
  'Exclusive',
  'Interview',
  'Analysis',
  'Opinion',
  'Report',
  'Update',
  'Announcement',
  'Event',
  'Breaking',
  'Investigation',
  'Review',
  'Tutorial',
  'Guide'
];

export const newsLanguages: Record<NewsLanguage, string> = {
  en: 'English',
  ar: 'العربية (Arabic)',
  fr: 'Français (French)',
  es: 'Español (Spanish)',
  de: 'Deutsch (German)',
};


export interface NewsTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  contentStructure: string;
  defaultPriority: NewsPriority;
  estimatedReadTime: number;
  createdBy: string;
  createdAt: string;
}

export interface NewsWorkflowTimeline {
  stage: NewsStatus;
  timestamp: string;
  userId: string;
  username: string;
  duration?: number; // time spent in this stage (minutes)
}

export interface NewsAnalytics {
  postId: string;
  totalTimeInWorkflow: number; // minutes
  timePerStage: Record<NewsStatus, number>;
  revisionCount: number;
  commentCount: number;
  averageResponseTime: number; // minutes
}
