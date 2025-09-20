import { useState } from 'react'
import { auth } from '@/lib/firebase'
import { env } from '@/lib/env'
import { createSample } from '@/features/samples/api'

type Props = {
  wsId?: string // defaults to env.DEFAULT_WS_ID
  onCreated?: (p: { sid: string; title: string }) => void
}

export function NewSampleButton({ wsId = env.DEFAULT_WS_ID, onCreated }: Props) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string>('')

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    const uid = auth.currentUser?.uid
    if (!uid) return setErr('Not signed in')
    try {
      setBusy(true)
      const trimmed = title.trim() || 'Untitled sample'
      const sid = await createSample(wsId, uid, { title: trimmed })
      setOpen(false)
      setTitle('')
      onCreated?.({ sid, title: trimmed })
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button className="border rounded px-3 py-2 font-medium" onClick={() => setOpen(true)}>
        + New Sample
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
          onClick={() => !busy && setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded shadow-lg w-full max-w-sm p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Create sample</h3>
            <form onSubmit={onCreate} className="space-y-3">
              <label className="block">
                <div className="mb-1 text-sm">Title</div>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Jacket #204 / 42 size"
                  autoFocus
                />
              </label>
              {err && <p className="text-sm text-red-600">{err}</p>}
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  className="px-3 py-2 border rounded"
                  onClick={() => setOpen(false)}
                  disabled={busy}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 border rounded font-medium"
                  disabled={busy}
                >
                  {busy ? 'Creating…' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
