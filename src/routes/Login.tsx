import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailPass, resetPassword } from '@/lib/firebase'
import { env } from '@/lib/env'

function normalizeIdentifier(id: string) {
  const trimmed = id.trim()
  if (!trimmed) return ''
  return trimmed.includes('@') ? trimmed : `${trimmed}@${env.LOCAL_LOGIN_DOMAIN}`
}

export function Login() {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    const email = normalizeIdentifier(id)
    if (!email || !password) return setErr('Enter login and password')
    try {
      setLoading(true)
      await signInWithEmailPass(email, password)
      nav('/app', { replace: true })
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  const onReset = async () => {
    const email = normalizeIdentifier(id)
    if (!email) return setErr('Enter your login/email to reset')
    try {
      await resetPassword(email)
      setErr('Password reset email sent (if the account exists).')
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <section className="mx-auto max-w-sm w-full">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block">
          <div className="mb-1">Login or email</div>
          <input
            className="w-full border rounded px-3 py-2"
            value={id}
            onChange={(e) => setId(e.target.value)}
            autoComplete="username"
            placeholder={`e.g. oksana or oksana@${env.LOCAL_LOGIN_DOMAIN}`}
          />
        </label>
        <label className="block">
          <div className="mb-1">Password</div>
          <input
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </label>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button
          type="submit"
          className="w-full border rounded px-3 py-2 font-medium"
          disabled={loading}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="w-full text-sm opacity-80 underline mt-1"
        >
          Forgot password?
        </button>
        <p className="text-xs opacity-70 mt-2">
          Accounts are created by the admin in Firebase. Short login is supported.
        </p>
      </form>
    </section>
  )
}
