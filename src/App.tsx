import { useState, type ChangeEvent } from 'react'
import { db, storage } from './lib/firebase'
import { useAuth } from './hooks/useAuth'
import { AuthButtons } from './components/AuthButtons'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

function App() {
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

  if (loading) return <div className="p-6">Loading…</div>

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl mb-4">Auth ready ✅</h1>

      <AuthButtons user={user} setStatus={setStatus} />

      <div className="flex gap-3 mb-4">
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
      <p className="opacity-60">Tip: Firebase Console → Auth/Firestore/Storage to verify.</p>
    </div>
  )
}
export default App
