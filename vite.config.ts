import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Configuration Vite, tout tourne cote client.
// base relative pour fonctionner aussi bien en local qu sous un sous chemin
// (par exemple un site de projet GitHub Pages, /Nexivo/).
// viteSingleFile embarque le JS et le CSS dans un seul fichier index.html,
// ouvrable directement dans un navigateur, sans serveur.
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
})
