import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Production: GitHub Pages serves at https://<user>.github.io/<repo>/
// Dev: keep "/" so http://localhost:5173/ works without a subpath
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/axiomsynergygroup/' : '/',
}))
