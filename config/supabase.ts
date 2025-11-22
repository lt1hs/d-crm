import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.ts';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Admin client with service role for admin operations
export const supabaseAdmin = supabaseServiceKey 
  ? createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  return {
    error: error.message || 'An unexpected error occurred',
    details: error
  };
};

// Helper function to upload files to Supabase Storage
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File
): Promise<{ url: string | null; error: string | null }> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { url: publicUrl, error: null };
  } catch (error: any) {
    return { url: null, error: error.message };
  }
};

// Helper function to delete files from Supabase Storage
export const deleteFile = async (
  bucket: string,
  path: string
): Promise<{ success: boolean; error: string | null }> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
