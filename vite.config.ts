import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/ryan-medlin-design/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
  plugins: [react()],
})