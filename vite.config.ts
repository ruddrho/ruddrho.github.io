import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative asset paths work on both username.github.io and project GitHub Pages URLs.
export default defineConfig({
  plugins: [react()],
  base: './',
})
