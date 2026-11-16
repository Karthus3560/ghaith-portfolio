import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Four pages: index.html is the professional edition, story.html the first-person particle story, game.html the driving game, tree.html the 3D life tree.
export default defineConfig({
  // GitHub Pages serves a project from /<repo>/; set BASE when building for it.
  base: process.env.BASE ?? '/',
  plugins: [react()],
  build: { rollupOptions: { input: { main: 'index.html', story: 'story.html', game: 'game.html', tree: 'tree.html' } } },
})
