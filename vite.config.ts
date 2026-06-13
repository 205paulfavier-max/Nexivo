import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuration Vite minimale, tout tourne cote client.
export default defineConfig({
  plugins: [react()],
})
