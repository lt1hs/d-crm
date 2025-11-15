// Central export for all API functions
export * from './auth';
export * from './users';
export * from './projects';
export * from './tasks';
export * from './chat';
export * from './notifications';

// Re-export supabase client for direct access when needed
export { supabase, uploadFile, deleteFile } from '../../config/supabase';
