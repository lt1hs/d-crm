
import React from 'react';

// Translation keys type
export type TranslationKey = 
  | 'sidebar.viewAs'
  | 'sidebar.dashboard'
  | 'sidebar.calendar'
  | 'sidebar.chat'
  | 'sidebar.menu'
  | 'sidebar.slider'
  | 'sidebar.books'
  | 'sidebar.news'
  | 'sidebar.activities'
  | 'sidebar.magazine'
  | 'sidebar.articles'
  | 'sidebar.courses'
  | 'sidebar.publications'
  | 'sidebar.infographics'
  | 'sidebar.videos'
  | 'sidebar.testimonials'
  | 'sidebar.partners'
  | 'sidebar.footer'
  | 'sidebar.about'
  | 'sidebar.users'
  | 'sidebar.logs'
  | 'sidebar.light'
  | 'sidebar.dark'
  | 'header.searchPlaceholder'
  | 'Main'
  | 'Content'
  | 'Media'
  | 'Site'
  | 'Admin'
  | 'menu.management'
  | 'menu.create'
  | 'menu.edit';

export interface User {
  name: string;
  location: string;
  avatar: string;
  time?: string;
  status?: 'online' | 'offline';
}

export interface TimeOffRequest {
  user: User;
  date: string;
}

export interface Holiday {
  name: string;
  date: string;
  flag: string;
}

export interface Birthday {
  name: string;
  date: string;
  avatar: string;
}

export interface Shortcut {
  nameKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface ActionItem {
  titleKey: string;
  descriptionKey: string;
  buttonTextKey: string;
}

// Admin Panel Types
export interface ContentStats {
  label: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  change?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  status: 'published' | 'draft' | 'pending';
  lastModified: string;
  author?: string;
}

export interface AdminSection {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
  route: string;
}
