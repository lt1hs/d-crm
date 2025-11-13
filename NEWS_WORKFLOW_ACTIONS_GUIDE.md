# News Workflow Actions - Complete Guide

## Overview

The news workflow system now features enhanced action modals that provide a comprehensive, user-friendly interface for all workflow transitions.

## Improved Action System

### What's New

✨ **Dedicated Action Modals** - Each workflow action now has its own detailed modal  
✨ **Priority Setting** - Set or update priority during transitions  
✨ **Deadline Management** - Add deadlines for each stage  
✨ **User Assignment** - Assign specific team members  
✨ **Rich Comments** - Add detailed notes and instructions  
✨ **Validation** - Smart validation prevents errors  
✨ **Notifications** - Optional team notifications  
✨ **Calendar Integration** - Add deadlines to team calendar  

## Workflow Actions

### 1. Submit for Design

**When**: Author has finished writing content  
**Purpose**: Send post to design team for visual elements  

**Modal Features**:
- ✅ Set priority level (Urgent/High/Normal/Low)
- ✅ Set deadline for design completion
- ✅ Assign to specific designer
- ✅ Add instructions for designer
- ✅ Notify design team
- ✅ Add to calendar

**Example Use Case**:
```
Priority: High
Deadline: Tomorrow 5 PM
Assign to: John Designer
Comment: "Please add hero image and 2-3 supporting images. 
         Focus on modern, clean aesthetic."
Notify: Yes
Calendar: Yes
```

**Best Practices**:
- Set realistic deadlines (2-4 hours for design work)
- Be specific about image requirements
- Mention any brand guidelines
- Assign to designer with relevant expertise

---

### 2. Start Design Work

**When**: Designer picks up a post awaiting design  
**Purpose**: Claim ownership and begin adding visuals  

**Modal Features**:
- ✅ Set deadline for completion
- ✅ Add notes about approach
- ✅ Notify author of progress
- ✅ Add to calendar

**Example Use Case**:
```
Deadline: Today 4 PM
Comment: "Starting design work. Will focus on infographic-style 
         images to match the data-heavy content."
Notify: Yes
Calendar: Yes
```

**Best Practices**:
- Set realistic completion time
- Communicate your design approach
- Ask questions if requirements unclear
- Update if you need more time

---

### 3. Submit for Review

**When**: Designer has completed visual elements  
**Purpose**: Send to management for final approval  

**Modal Features**:
- ✅ Update priority if needed
- ✅ Set review deadline
- ✅ Assign to specific reviewer
- ✅ Add design notes
- ✅ Notify reviewer
- ✅ Add to calendar

**Example Use Case**:
```
Priority: High (if urgent)
Deadline: Tomorrow 2 PM
Assign to: Boss Manager
Comment: "Design complete. Added 4 custom images and updated 
         color scheme to match brand guidelines."
Notify: Yes
Calendar: Yes
```

**Best Practices**:
- Highlight key design decisions
- Mention any deviations from brief
- Note if urgent review needed
- Provide context for reviewer

---

### 4. Approve Post

**When**: Reviewer is satisfied with content and design  
**Purpose**: Approve post for publication  

**Modal Features**:
- ✅ Add approval notes
- ✅ Notify team of approval
- ✅ Optional feedback

**Example Use Case**:
```
Comment: "Excellent work! Content is clear and images are 
         perfect. Approved for immediate publication."
Notify: Yes
```

**Best Practices**:
- Acknowledge good work
- Provide positive feedback
- Mention what worked well
- Clear for next steps

---

### 5. Request Revision

**When**: Reviewer needs changes before approval  
**Purpose**: Send back with specific feedback  

**Modal Features**:
- ✅ **Required**: Detailed feedback
- ✅ Update priority if urgent
- ✅ Set revision deadline
- ✅ Notify author and designer
- ✅ Add to calendar

**Example Use Case**:
```
Priority: High (if time-sensitive)
Deadline: Tomorrow 10 AM
Comment: "Please make the following changes:
         1. Update headline to be more engaging
         2. Replace second image - too generic
         3. Add statistics in paragraph 3
         4. Fix typo in conclusion"
Notify: Yes
Calendar: Yes
```

**Best Practices**:
- ✅ **Be specific** - List exact changes needed
- ✅ **Be constructive** - Explain why changes needed
- ✅ **Prioritize** - Number changes by importance
- ✅ **Be clear** - Avoid vague feedback like "make it better"
- ✅ **Set deadline** - Give realistic time for revisions

**What NOT to do**:
- ❌ "Needs work" (too vague)
- ❌ "I don't like it" (not actionable)
- ❌ "Fix the images" (which ones? how?)
- ❌ No deadline (creates uncertainty)

---

### 6. Publish Now

**When**: Post is approved and ready  
**Purpose**: Make post live immediately  

**Modal Features**:
- ✅ Add publication notes
- ✅ Notify team
- ✅ Confirm publication

**Example Use Case**:
```
Comment: "Publishing breaking news story. Shared on social 
         media channels."
Notify: Yes
```

**Best Practices**:
- Double-check everything is ready
- Note any special distribution
- Confirm timing is appropriate
- Notify relevant stakeholders

---

### 7. Schedule Post

**When**: Post is approved but should publish later  
**Purpose**: Set automatic publication time  

**Modal Features**:
- ✅ **Required**: Publication date/time
- ✅ Add scheduling notes
- ✅ Notify team
- ✅ Add to calendar
- ✅ Validation (must be future time)

**Example Use Case**:
```
Scheduled: 2025-11-15 09:00 AM
Comment: "Scheduling for Monday morning launch. Coordinated 
         with marketing campaign."
Notify: Yes
Calendar: Yes
```

**Best Practices**:
- Choose optimal publishing time
- Coordinate with other campaigns
- Consider audience timezone
- Set reminders for promotion
- Verify date/time is correct

---

## Priority Levels Guide

### 🔴 Urgent
- **Use for**: Breaking news, time-critical content
- **Deadline**: Within hours
- **Response**: Immediate attention required
- **Example**: "Breaking: Major announcement"

### 🟠 High
- **Use for**: Important updates, featured content
- **Deadline**: Within 1-2 days
- **Response**: Prioritize over normal work
- **Example**: "Weekly newsletter feature"

### 🔵 Normal
- **Use for**: Regular articles, standard content
- **Deadline**: Within 3-5 days
- **Response**: Standard workflow
- **Example**: "Blog post about industry trends"

### ⚪ Low
- **Use for**: Evergreen content, background pieces
- **Deadline**: Flexible
- **Response**: Complete when time allows
- **Example**: "Company history article"

---

## Deadline Setting Guide

### Design Stage
- **Simple post** (text + 1-2 images): 2-4 hours
- **Standard post** (text + 3-5 images): 4-8 hours
- **Complex post** (custom graphics, infographics): 1-2 days

### Review Stage
- **Quick review**: 1-2 hours
- **Standard review**: 4-8 hours
- **Detailed review**: 1 day

### Revision Stage
- **Minor changes**: 1-2 hours
- **Moderate changes**: 4-8 hours
- **Major rewrite**: 1-2 days

---

## Assignment Best Practices

### When to Assign

✅ **Do assign when**:
- Specific expertise needed
- Workload balancing required
- Urgent/high priority posts
- Complex requirements
- Specific style needed

❌ **Don't assign when**:
- Standard routine work
- Team is equally capable
- Auto-assignment works well
- No specific requirements

### How to Choose

1. **Check availability** - Is person available?
2. **Check expertise** - Do they have relevant skills?
3. **Check workload** - Are they overloaded?
4. **Check history** - Have they worked on similar content?

---

## Notification Strategy

### Always Notify For:
- ✅ Urgent/high priority posts
- ✅ Revision requests
- ✅ Deadline changes
- ✅ Direct assignments
- ✅ Approvals

### Optional Notify For:
- 🤔 Normal priority posts
- 🤔 Standard workflow transitions
- 🤔 Auto-assignments
- 🤔 Scheduled publications

---

## Calendar Integration

### Add to Calendar When:
- ✅ Deadlines are set
- ✅ Scheduled publications
- ✅ Important reviews
- ✅ Team coordination needed
- ✅ External dependencies

### Skip Calendar When:
- ❌ Flexible deadlines
- ❌ Internal tracking only
- ❌ Routine work
- ❌ No time constraints

---

## Validation Rules

### Automatic Validation

1. **Required Fields**
   - Revision requests must have comments
   - Schedule must have future date/time
   - Assignments must select valid user

2. **Date Validation**
   - Deadlines must be in future
   - Scheduled dates must be in future
   - Deadlines must be after current time

3. **Logic Validation**
   - Can't schedule past dates
   - Can't set deadline before now
   - Can't submit without required fields

---

## Error Messages

### Common Errors

**"Comment is required for this action"**
- Solution: Add detailed feedback in comment field

**"Scheduled time must be in the future"**
- Solution: Select a date/time after current time

**"Deadline must be in the future"**
- Solution: Choose a future deadline

**"Please select a date and time"**
- Solution: Fill in the date/time field

---

## Tips & Tricks

### For Authors
1. Set priority when submitting for design
2. Provide clear instructions for designers
3. Set realistic deadlines
4. Assign to designer if you know who's best

### For Designers
1. Claim posts quickly with "Start Design"
2. Set completion deadline
3. Communicate if you need more time
4. Add notes about your design approach

### For Reviewers
1. Review promptly to avoid bottlenecks
2. Be specific in revision requests
3. Acknowledge good work in approvals
4. Set clear revision deadlines

### For Everyone
1. Use notifications wisely
2. Add to calendar for important deadlines
3. Update priority if urgency changes
4. Communicate proactively

---

## Keyboard Shortcuts

- **Enter** - Submit action (when in modal)
- **Escape** - Cancel action
- **Tab** - Navigate between fields
- **Space** - Toggle checkboxes

---

## Mobile Usage

All action modals are fully responsive:
- ✅ Touch-friendly buttons
- ✅ Mobile-optimized forms
- ✅ Swipe to dismiss
- ✅ Auto-focus on important fields

---

## Accessibility

- ✅ Full keyboard navigation
- ✅ Screen reader support
- ✅ ARIA labels on all fields
- ✅ Clear error messages
- ✅ Focus management

---

## Troubleshooting

### Modal Won't Open
1. Check permissions for action
2. Verify post is in correct status
3. Refresh the page
4. Check browser console

### Can't Submit Action
1. Check all required fields filled
2. Verify dates are in future
3. Check for validation errors
4. Try again with valid data

### Assignment Not Working
1. Verify user exists
2. Check user has correct role
3. Ensure user is active
4. Try auto-assign instead

---

## Future Enhancements

Coming soon:
- 📧 Email notifications
- 💬 Slack integration
- 📱 Mobile app
- 🤖 AI suggestions
- 📊 Action analytics
- ⏰ Smart deadline suggestions
- 👥 Team availability checking

---

**Version**: 2.0  
**Last Updated**: November 12, 2025  
**Status**: Production Ready
