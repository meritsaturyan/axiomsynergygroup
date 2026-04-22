import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// - Dev: "/" (http://localhost:5173/)
// - Vercel / most hosts: "/" (apex or *.vercel.app)
// - GitHub Pages project site: set BASE_PATH in CI (e.g. /axiomsynergygroup/)
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? (process.env.BASE_PATH?.trim() || '/') : '/',
}))
