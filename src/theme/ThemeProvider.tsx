import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type ThemeMode = 'light' | 'dark' | 'system'
type Resolved = 'light' | 'dark'
type Ctx = {
  mode: ThemeMode
  resolved: Resolved
  setMode: (m: ThemeMode) => void
  toggle: () => void
}

const ThemeCtx = createContext<Ctx | undefined>(undefined)
const STORAGE_KEY = 'ui:theme'

function getInitialMode(): ThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved
  } catch {}
  return 'system'
}

function prefersDark() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

function apply(mode: ThemeMode) {
  const dark = mode === 'dark' || (mode === 'system' && prefersDark())
  document.documentElement.classList.toggle('dark', dark)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => getInitialMode())

  // apply + persist
  useEffect(() => {
    apply(mode)
    try {
      localStorage.setItem(STORAGE_KEY, mode)
    } catch {}
  }, [mode])

  // react to system changes when in 'system'
  useEffect(() => {
    if (mode !== 'system') return
    const mql = window.matchMedia?.('(prefers-color-scheme: dark)')
    const onChange = () => apply('system')
    mql?.addEventListener?.('change', onChange)
    return () => mql?.removeEventListener?.('change', onChange)
  }, [mode])

  const value = useMemo<Ctx>(() => {
    const resolved: Resolved = mode === 'dark' || (mode === 'system' && prefersDark())
      ? 'dark'
      : 'light'
    const toggle = () => setMode(resolved === 'dark' ? 'light' : 'dark')
    return { mode, resolved, setMode, toggle }
  }, [mode])

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeCtx)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
