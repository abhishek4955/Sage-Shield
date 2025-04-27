// Environment configuration
export const ENV = {
  NODE_ENV: import.meta.env.MODE || 'development',
  IS_DEV: import.meta.env.MODE === 'development'
} as const; 