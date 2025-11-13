import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://elegant-project.onrender.com',
        changeOrigin: true,
        secure: false,
        // Rewrite path if needed
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      }
    }
  }
  
})
