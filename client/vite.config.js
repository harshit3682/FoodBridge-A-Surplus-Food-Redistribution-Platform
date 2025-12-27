import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react-router-dom',
      '@emotion/react',
      '@emotion/styled',
      '@mui/material',
      '@mui/icons-material',
      'socket.io-client',
      'qrcode.react'
    ]
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true, // Listen on all network interfaces
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})



