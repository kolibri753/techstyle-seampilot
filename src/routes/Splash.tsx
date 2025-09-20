import { useState, type ChangeEvent } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { AuthButtons } from '@/components/AuthButtons'
import { db, storage } from '@/lib/firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export function Splash() {
  const { user, loading } = useAuth()
  const [status, setStatus] = useState('')

  const writePing = async () => {
    if (!user) return setStatus('Sign in first')
    await setDoc(doc(db, 'test', user.uid), { ping: 'ok', at: serverTimestamp() })
    setStatus('Firestore write: OK')
  }

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return setStatus('Need file + signed-in user')
    const path = `uploads/${user.uid}/${Date.now()}-${file.name}`
    const r = ref(storage, path)
    await uploadBytes(r, file)
    const url = await getDownloadURL(r)
    setStatus(`Storage upload: OK → ${url}`)
  }

  if (loading) return <div>Loading…</div>

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Welcome to 4fit</h1>
      <p className="opacity-80">Sign in to try Firestore & Storage demo actions.</p>

      <AuthButtons user={user} setStatus={setStatus} />

      <div className="flex gap-3">
        <button onClick={writePing} disabled={!user}>
          Write Firestore “ping”
        </button>
        <label className={user ? '' : 'opacity-50 pointer-events-none'}>
          Upload photo to Storage{' '}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={onFile}
            disabled={!user}
          />
        </label>
      </div>

      <p>{status}</p>
    </section>
  )
}
