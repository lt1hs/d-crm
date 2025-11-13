export const TESTIMONIAL_CATEGORIES = [
  { id: 'customer', name: 'Customer Reviews', icon: '👤', color: '#3b82f6' },
  { id: 'client', name: 'Client Feedback', icon: '💼', color: '#10b981' },
  { id: 'employee', name: 'Employee Testimonials', icon: '👥', color: '#8b5cf6' },
  { id: 'partner', name: 'Partner Reviews', icon: '🤝', color: '#f59e0b' },
  { id: 'student', name: 'Student Feedback', icon: '🎓', color: '#06b6d4' },
  { id: 'expert', name: 'Expert Opinions', icon: '⭐', color: '#ec4899' },
  { id: 'media', name: 'Media & Press', icon: '📰', color: '#ef4444' },
  { id: 'community', name: 'Community', icon: '🌟', color: '#059669' },
];

export const TESTIMONIAL_TYPES = [
  { value: 'text', label: 'Text', icon: '📝', description: 'Written testimonials' },
  { value: 'video', label: 'Video', icon: '🎥', description: 'Video testimonials' },
  { value: 'audio', label: 'Audio', icon: '🎙️', description: 'Audio testimonials' },
];

export const TESTIMONIAL_STATUSES = [
  { value: 'draft', label: 'Draft', icon: '✏️', color: '#6b7280' },
  { value: 'published', label: 'Published', icon: '✅', color: '#10b981' },
  { value: 'archived', label: 'Archived', icon: '📦', color: '#ef4444' },
];

export const TESTIMONIAL_RATINGS = [
  { value: 5, label: '5 Stars', icon: '⭐⭐⭐⭐⭐' },
  { value: 4, label: '4 Stars', icon: '⭐⭐⭐⭐' },
  { value: 3, label: '3 Stars', icon: '⭐⭐⭐' },
  { value: 2, label: '2 Stars', icon: '⭐⭐' },
  { value: 1, label: '1 Star', icon: '⭐' },
];
