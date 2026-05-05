import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '.',
    emptyOutDir: false,
    lib: {
      entry: 'src/index.jsx',
      name: 'MyWidget',
      fileName: 'my-widget',
      formats: ['es'],
    },
  },
})
