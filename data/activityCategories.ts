import { ActivityCategory } from '../types/activity';

export const ACTIVITY_CATEGORIES: ActivityCategory[] = [
  {
    id: 'corporate',
    name: 'Corporate',
    nameAr: 'الشركات',
    nameFa: 'شرکتی',
    slug: 'corporate',
    description: 'Corporate events and meetings',
    icon: '🏢',
    color: '#3b82f6',
  },
  {
    id: 'team-building',
    name: 'Team Building',
    nameAr: 'بناء الفريق',
    nameFa: 'تیم سازی',
    slug: 'team-building',
    description: 'Team building activities',
    icon: '🤝',
    color: '#10b981',
  },
  {
    id: 'training',
    name: 'Training & Development',
    nameAr: 'التدريب والتطوير',
    nameFa: 'آموزش و توسعه',
    slug: 'training',
    description: 'Training and development programs',
    icon: '📖',
    color: '#8b5cf6',
  },
  {
    id: 'social',
    name: 'Social',
    nameAr: 'اجتماعي',
    nameFa: 'اجتماعی',
    slug: 'social',
    description: 'Social gatherings and celebrations',
    icon: '🎊',
    color: '#ec4899',
  },
  {
    id: 'professional',
    name: 'Professional',
    nameAr: 'مهني',
    nameFa: 'حرفه ای',
    slug: 'professional',
    description: 'Professional development events',
    icon: '💼',
    color: '#f59e0b',
  },
  {
    id: 'community',
    name: 'Community',
    nameAr: 'المجتمع',
    nameFa: 'جامعه',
    slug: 'community',
    description: 'Community outreach and CSR',
    icon: '🌍',
    color: '#06b6d4',
  },
  {
    id: 'wellness',
    name: 'Health & Wellness',
    nameAr: 'الصحة والعافية',
    nameFa: 'سلامت و تندرستی',
    slug: 'wellness',
    description: 'Health and wellness activities',
    icon: '🏃',
    color: '#14b8a6',
  },
  {
    id: 'innovation',
    name: 'Innovation',
    nameAr: 'الابتكار',
    nameFa: 'نوآوری',
    slug: 'innovation',
    description: 'Innovation and hackathons',
    icon: '💡',
    color: '#f97316',
  },
];

export const ACTIVITY_TYPES = [
  { value: 'meeting', label: 'Meeting', icon: '👥' },
  { value: 'event', label: 'Event', icon: '🎉' },
  { value: 'workshop', label: 'Workshop', icon: '🛠️' },
  { value: 'conference', label: 'Conference', icon: '🎤' },
  { value: 'training', label: 'Training', icon: '📚' },
  { value: 'celebration', label: 'Celebration', icon: '🎊' },
  { value: 'announcement', label: 'Announcement', icon: '📢' },
  { value: 'other', label: 'Other', icon: '📌' },
] as const;

export const ACTIVITY_STATUSES = [
  { value: 'upcoming', label: 'Upcoming', icon: '🔜' },
  { value: 'ongoing', label: 'Ongoing', icon: '▶️' },
  { value: 'completed', label: 'Completed', icon: '✅' },
  { value: 'cancelled', label: 'Cancelled', icon: '❌' },
] as const;

export const MEDIA_TYPES = [
  { value: 'image', label: 'Image', icon: '🖼️' },
  { value: 'video', label: 'Video', icon: '🎥' },
  { value: 'article', label: 'Article', icon: '📄' },
  { value: 'document', label: 'Document', icon: '📎' },
] as const;
