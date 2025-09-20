import { useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import { listenAuth } from '@/lib/firebase'

type AuthState = { user: User | null; loading: boolean }

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ user: null, loading: true })

  useEffect(() => {
    return listenAuth((u) => setState({ user: u, loading: false }))
  }, [])

  return state
}
