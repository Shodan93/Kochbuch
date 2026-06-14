import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import { App } from './App'
import { AppProvider } from './context/AppContext'

// HashRouter: robustes Routing auf GitHub Pages (Sub-Pfad) und in einer
// Median/WebView-Verpackung – ohne Server-seitige Rewrite-Regeln.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </HashRouter>
  </StrictMode>,
)
