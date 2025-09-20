import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="border-b sticky top-0 bg-white/80 backdrop-blur z-10">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold">
          4fit
        </Link>
      </div>
    </header>
  )
}
