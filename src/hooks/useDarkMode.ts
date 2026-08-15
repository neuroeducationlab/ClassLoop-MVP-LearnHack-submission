import { useEffect, useState } from 'react'

function getInitial(): boolean {
  try {
    const stored = localStorage.getItem('classloop-dark')
    if (stored !== null) return stored === 'true'
  } catch {}
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function useDarkMode() {
  const [dark, setDark] = useState<boolean>(getInitial)

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    try {
      localStorage.setItem('classloop-dark', String(dark))
    } catch {}
  }, [dark])

  const toggle = () => setDark((d) => !d)

  return { dark, toggle }
}
