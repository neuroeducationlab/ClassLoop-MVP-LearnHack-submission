import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Apply dark mode class synchronously to prevent FOUC (flash of unstyled content)
try {
  const stored = localStorage.getItem('classloop-dark')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (stored === 'true' || (stored === null && prefersDark)) {
    document.documentElement.classList.add('dark')
  }
} catch {}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
