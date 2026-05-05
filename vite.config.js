import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.jsx',
      name: 'MyWidget',
      fileName: 'my-widget',
      formats: ['iife'],
    },
  },
})
