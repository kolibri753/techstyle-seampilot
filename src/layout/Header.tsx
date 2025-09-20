import { Link } from 'react-router-dom'
import { Globe, Moon, Sun } from 'lucide-react'
import logoImage from '@/assets/logo-cropped.png'
import { useTheme } from '@/theme/ThemeProvider'

export function Header() {
  const { resolved, toggle } = useTheme()

  return (
    <header className="sticky top-0 backdrop-blur z-10 border-b border-app bg-header">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-24 h-12 rounded-lg overflow-hidden border border-slate-800 bg-white">
            <img src={logoImage} alt="4fit logo" className="w-full h-full object-contain" />
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <button title="Change language" aria-label="Change language">
            <Globe className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer mx-1 transition-colors" />
          </button>

          <button
            title={`Toggle theme (${resolved === 'dark' ? 'Dark' : 'Light'})`}
            aria-label={`Switch to ${resolved === 'dark' ? 'light' : 'dark'} mode`}
            onClick={toggle}
          >
            {resolved === 'dark' ? (
              <Sun className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer mx-1 transition-colors" />
            ) : (
              <Moon className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer mx-1 transition-colors" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
