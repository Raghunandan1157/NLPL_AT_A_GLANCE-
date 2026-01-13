import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 'base' is crucial for GitHub Pages. 
  // './' ensures assets are loaded relative to the index.html location, 
  // preventing 404s when deployed to a subdirectory (e.g. user.github.io/repo/).
  base: './', 
})