import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Backend API target (Laravel artisan serve default is :8000)
const API_TARGET = process.env.VITE_PROXY_TARGET || 'http://127.0.0.1:8000'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    host: 'localhost',
    proxy: {
      // Forward /api/* requests to Laravel backend
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
        secure: false,
      },
      // Sanctum CSRF cookie (only needed for stateful SPA mode)
      '/sanctum': {
        target: API_TARGET,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
