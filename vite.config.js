import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://ophim1.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/v1/api'),
      },
      '/img': {
        target: 'https://img.ophim.live',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/img/, ''),
      },
    },
  },
})
