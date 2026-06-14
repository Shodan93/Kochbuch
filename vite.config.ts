import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base ("./") makes the build work on any GitHub Pages sub-path
// (e.g. /Kochbuch/) and inside a Median/WebView wrapper without changes.
export default defineConfig({
  base: './',
  plugins: [react()],
})
