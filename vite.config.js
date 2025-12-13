import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/LAMBDA_edupro_360_UI/',
  build: {
    outDir: 'dist2'
  }
})
