import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Point d'entree, montage de l'application React. Tout l'etat reste en memoire.
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
