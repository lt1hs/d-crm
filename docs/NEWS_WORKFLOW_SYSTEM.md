# News Post Workflow System

A comprehensive workflow management system for news posts with multi-stage approval process.

## Overview

The news workflow system enables a structured content creation and approval process with three main roles:
- **Author**: Creates and writes news content
- **Designer**: Adds images and visual elements
- **Boss/Reviewer**: Reviews and approves posts for publication

## Workflow Stages

### 1. Draft
- Author creates the initial post with text content
- Can edit freely before submission
- **Action**: Submit for Design

### 2. Awaiting Design
- Post is waiting for a designer to pick it up
- Text is locked, waiting for visual elements
- **Action**: Designer starts design work

### 3. In Design
- Designer is actively adding images and visual elements
- Designer can upload multiple images
- **Action**: Submit for Review

### 4. Pending Review
- Post is submitted to boss/reviewer for approval
- Boss can either approve or request revisions
- **Actions**: 
  - Approve (moves to Approved)
  - Request Revision (moves to Needs Revision)

### 5. Needs Revision
- Boss has requested changes with specific feedback
- Both author and designer can see the feedback
- Author/Designer makes changes and resubmits
- **Action**: Resubmit through the workflow

### 6. Approved
- Boss has approved the post
- Ready for publication
- **Actions**:
  - Publish Now
  - Schedule for Later

### 7. Published
- Post is live on the website
- No further edits without creating a new version

### 8. Scheduled
- Post is scheduled for future publication
- Will be automatically published at the scheduled time

## User Roles & Permissions

### Author
- Create new posts
- Edit own posts in Draft or Needs Revision status
- Submit posts for design
- View comments and feedback
- Cannot add images (designer's job)

### Designer
- View posts awaiting design
- Add/remove images to posts
- Submit posts for review
- View comments and feedback
- Cannot edit text content

### Boss/Reviewer
- View all posts pending review
- Approve posts
- Request revisions with detailed feedback
- Publish or schedule approved posts
- Full visibility of all workflow stages

### Admin/Super Admin
- Full access to all workflow stages
- Can perform any action
- Can override workflow if needed
- Manage all posts regardless of status

## Features

### Comments & Feedback
- All users can add comments to posts
- Special comment types:
  - **General**: Regular discussion
  - **Revision Request**: Boss's feedback for changes
  - **Approval**: Boss's approval message
  - **Feedback**: General feedback from any user

### Revision History
- Every workflow action creates a revision
- Track all changes and who made them
- Version numbering for each revision
- Audit trail of all modifications

### Filtering & Search
- **View Modes**:
  - All Posts: See everything
  - My Posts: Only posts you're involved with
  - Pending My Action: Posts waiting for your action
  
- **Status Filters**: Filter by any workflow status
- **Search**: Search by title, content, category, or tags
- **Sort**: By newest, oldest, title, or status

### Statistics Dashboard
- Total posts count
- Pending review count
- Approved posts count
- Posts needing revision count

## Usage Guide

### For Authors

1. **Create a Post**:
   - Click "Create Post"
   - Fill in title, content, excerpt
   - Select category and tags
   - Add SEO information
   - Save as draft

2. **Submit for Design**:
   - Open your draft post
   - Click "Submit for Design"
   - Designer will be notified

3. **Handle Revisions**:
   - If boss requests revisions, you'll see feedback
   - Make necessary changes
   - Resubmit through the workflow

### For Designers

1. **Pick Up Work**:
   - View posts "Awaiting Design"
   - Click "Start Design Work"
   - Post status changes to "In Design"

2. **Add Images**:
   - Upload images using the image uploader
   - Arrange images as needed
   - Preview the post

3. **Submit for Review**:
   - When design is complete
   - Click "Submit for Review"
   - Boss will be notified

### For Boss/Reviewers

1. **Review Posts**:
   - View "Pending Review" posts
   - Check content and design
   - Review all details

2. **Approve**:
   - If satisfied, click "Approve Post"
   - Optionally add approval comment
   - Post moves to Approved status

3. **Request Revisions**:
   - If changes needed, click "Request Revision"
   - **Must provide detailed feedback**
   - Specify what needs to be changed
   - Post returns to author/designer

4. **Publish**:
   - Approved posts can be published immediately
   - Or scheduled for future publication
   - Select date/time for scheduled posts

## Technical Implementation

### Components

- **NewsManagement**: Main container component
- **NewsForm**: Create/edit post form
- **NewsList**: Display list of posts
- **NewsCard**: Individual post card
- **NewsWorkflowModal**: Workflow actions and history
- **NewsStats**: Statistics dashboard
- **NewsFilters**: Filtering and sorting controls

### Types

```typescript
type NewsStatus = 
  | 'draft'
  | 'awaiting_design'
  | 'in_design'
  | 'pending_review'
  | 'needs_revision'
  | 'approved'
  | 'published'
  | 'scheduled';
```

### Helper Functions

- `getStatusColor()`: Get color for status badge
- `getStatusLabel()`: Get human-readable status label
- `canPerformAction()`: Check if user can perform action
- `getAvailableActions()`: Get list of available actions
- `addComment()`: Add comment to post
- `createRevision()`: Create new revision
- `filterNewsByStatus()`: Filter posts by status
- `searchNews()`: Search posts
- `sortNews()`: Sort posts

## Integration

The news workflow system integrates with:
- **User Management**: Role-based permissions
- **Activity Logs**: All actions are logged
- **Notifications**: Users notified of workflow changes
- **Calendar**: Schedule posts for future publication

## Best Practices

1. **Always provide feedback** when requesting revisions
2. **Use comments** to communicate with team members
3. **Check revision history** before making changes
4. **Use tags** to categorize posts effectively
5. **Add SEO information** for better search visibility
6. **Preview images** before submitting for review
7. **Schedule posts** during optimal publishing times

## Future Enhancements

- Email notifications for workflow changes
- Bulk actions (approve multiple posts)
- Post templates for common formats
- Analytics integration
- Social media auto-posting
- Draft auto-save
- Collaborative editing
- Image editing tools
- Content suggestions
- SEO score calculator
