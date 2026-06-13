import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Configuration Vite, tout tourne cote client.
// viteSingleFile embarque le JS et le CSS dans un seul fichier index.html,
// ouvrable directement dans un navigateur, sans serveur.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
})
