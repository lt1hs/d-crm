import { useEffect, useRef } from 'react';
import { NewsPost } from '../types/news';
import { savePostDraft } from '../utils/newsHelpers';

interface UseNewsAutoSaveOptions {
  enabled: boolean;
  interval?: number; // milliseconds
  onSave?: () => void;
}

export const useNewsAutoSave = (
  post: Partial<NewsPost>,
  options: UseNewsAutoSaveOptions = { enabled: true, interval: 30000 }
) => {
  const { enabled, interval = 30000, onSave } = options;
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef<string>('');

  useEffect(() => {
    if (!enabled || !post.id) return;

    const currentData = JSON.stringify(post);
    
    // Only save if data has changed
    if (currentData === lastSavedRef.current) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      savePostDraft(post);
      lastSavedRef.current = currentData;
      onSave?.();
    }, interval);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [post, enabled, interval, onSave]);

  return {
    lastSaved: lastSavedRef.current ? new Date() : null,
  };
};
