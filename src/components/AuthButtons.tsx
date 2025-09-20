import type { FC } from 'react'
import {
  signInAnon,
  signInWithGoogle,
  upgradeAnonymousWithGoogle,
  signOutUser,
} from '@/lib/firebase'
import type { User } from 'firebase/auth'

type Props = { user: User | null; setStatus: (s: string) => void }

export const AuthButtons: FC<Props> = ({ user, setStatus }) => {
  const wrap = (fn: () => Promise<unknown>) => async () => {
    try {
      setStatus('')
      await fn()
    } catch (e) {
      setStatus(e instanceof Error ? e.message : String(e))
    }
  }

  if (!user) {
    return (
      <div className="flex gap-2 items-center mb-3">
        <button onClick={wrap(signInAnon)}>Sign in (Anonymous)</button>
        <button onClick={wrap(signInWithGoogle)}>Sign in with Google</button>
      </div>
    )
  }

  return (
    <div className="flex gap-2 items-center mb-3">
      <span>
        Signed in as <b>{user.email ?? user.uid}</b>
        {user.isAnonymous && <em className="ml-2 opacity-70">(anonymous)</em>}
      </span>
      {user.isAnonymous && (
        <button onClick={wrap(upgradeAnonymousWithGoogle)}>Upgrade (link Google)</button>
      )}
      <button onClick={wrap(signOutUser)}>Sign out</button>
    </div>
  )
}
