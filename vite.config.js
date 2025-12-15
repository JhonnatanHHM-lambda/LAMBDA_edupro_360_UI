import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',  // Cambia esto (o elimínalo, ya que '/' es el default)
  build: {
    outDir: 'dist'
  }
})