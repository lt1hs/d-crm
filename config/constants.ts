// Environment variables
export const ENV = {
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || '',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'AL-DALEEL-CRM',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;

// App constants
export const CONSTANTS = {
  STORAGE_KEYS: {
    THEME: 'theme',
    LANGUAGE: 'language',
  },
  LANGUAGES: ['en', 'ar', 'fa'] as const,
  THEMES: ['light', 'dark'] as const,
  DEBOUNCE_DELAY: 300,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

// API endpoints (if needed in future)
export const API_ENDPOINTS = {
  GEMINI: 'https://generativelanguage.googleapis.com/v1beta',
} as const;

// Validation helpers
export const validateEnv = () => {
  if (ENV.IS_PROD && !ENV.GEMINI_API_KEY) {
    console.warn('⚠️ GEMINI_API_KEY is not set. Some features may not work.');
  }
};
