import { useState } from 'react'
import { deleteSample } from '@/features/samples/api'
import { env } from '@/lib/env'

type Props = {
  wsId?: string
  sid: string
  title?: string
  onDeleted?: (p: { sid: string; title?: string }) => void
}

export function DeleteSampleButton({ wsId = env.DEFAULT_WS_ID, sid, title, onDeleted }: Props) {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string>('')

  const onConfirm = async () => {
    setErr('')
    try {
      setBusy(true)
      await deleteSample(wsId, sid)
      setOpen(false)
      onDeleted?.({ sid, title })
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button
        className="text-red-600 hover:underline text-sm"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen(true)
        }}
        aria-label="Delete sample"
        title="Delete sample"
      >
        Delete
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
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Delete sample?</h3>
            <p className="text-sm opacity-80 text-gray-700">
              This will permanently delete <b>{title || sid}</b> and its steps/comments.
            </p>
            {err && <p className="text-sm text-red-600 mt-2">{err}</p>}
            <div className="flex gap-2 justify-end mt-4">
              <button
                className="px-3 py-2 border rounded"
                onClick={() => setOpen(false)}
                disabled={busy}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 border rounded font-medium text-white bg-red-600"
                onClick={onConfirm}
                disabled={busy}
              >
                {busy ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
