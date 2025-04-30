import { defineConfig } from 'vite'

export default defineConfig({
    server: {
      port: 5173,
      proxy: {
        // Proxy API requests to the backend server
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
          // Optional: rewrite path
          // rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  })