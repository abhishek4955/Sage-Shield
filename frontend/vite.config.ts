import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
      emptyOutDir: true,
    },
    server: {
      port: 5173,
      host: true,
      proxy: command === 'serve' ? {
        '/api': {
          target: 'http://localhost:5173',
          changeOrigin: true,
          secure: false,
        }
      } : undefined
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'Assets': path.resolve(__dirname, './Assets')   
      }
    },
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg']
  }
});