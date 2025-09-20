import { Link } from 'react-router-dom'
import { Globe, Moon } from 'lucide-react'
import logoImage from '@/assets/logo-cropped.png'

export function Header() {
  return (
    <header className="border-b border-slate-800 sticky top-0 bg-black/90 backdrop-blur z-10">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-24 h-12 rounded-lg overflow-hidden border border-slate-800 bg-white">
            <img src={logoImage} alt="4fit logo" className="w-full h-full object-contain" />
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <button title="Change language">
            <Globe className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer mx-1 transition-colors" />
          </button>
          <button title="Toggle theme">
            <Moon className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer mx-1 transition-colors" />
          </button>
        </div>
      </div>
    </header>
  )
}
