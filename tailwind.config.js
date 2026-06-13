/** @type {import('tailwindcss').Config} */
// Palette founderie sombre et futuriste, definie une seule fois ici.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Fonds et surfaces
        fond: '#0A0C0F',
        surface: '#12161C',
        bordure: '#1E2630',
        // Accents
        ambre: '#F2A33C', // energie et production
        acier: '#3FB6C9', // donnee et pilotage
        recup: '#4FB477', // boucle circulaire
        // Textes
        texte: '#E6EAEF',
        attenue: '#8A95A3',
      },
      fontFamily: {
        // Corps technique sans serif, donnees en monospace
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        panneau: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px rgba(0,0,0,0.45)',
      },
      keyframes: {
        pulseur: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        pulseur: 'pulseur 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
