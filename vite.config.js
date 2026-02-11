import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/v1/api': {
        target: 'https://ophim1.com',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'https://ophim1.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
