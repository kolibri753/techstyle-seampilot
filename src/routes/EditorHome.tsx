import { useState } from 'react'
import { Link } from 'react-router-dom'
import { env } from '@/lib/env'
import { useSamples } from '@/features/samples/hooks/useSamples'
import { SampleList } from '@/features/samples/components/SampleList'
import { NewSampleButton } from '@/features/samples/components/NewSampleButton'

export function EditorHome() {
  const wsId = env.DEFAULT_WS_ID
  const { items, loading } = useSamples(wsId)
  const [recent, setRecent] = useState<{ sid: string; title: string } | null>(null)
  const [deleted, setDeleted] = useState<{ sid: string; title?: string } | null>(null)

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Samples (Editor)</h2>
          <p className="opacity-70">Workspace: {wsId}</p>
        </div>
        <NewSampleButton wsId={wsId} onCreated={(p) => setRecent(p)} />
      </div>

      {recent && (
        <div className="rounded border p-3 bg-green-50 text-sm flex items-center justify-between text-gray-600">
          <div>
            Sample <b>{recent.title}</b> created.{' '}
            <Link className="underline" to={`/w/${wsId}/s/${recent.sid}`}>
              Open
            </Link>
          </div>
          <button className="underline" onClick={() => setRecent(null)}>
            Dismiss
          </button>
        </div>
      )}

      {deleted && (
        <div className="rounded border p-3 bg-amber-50 text-sm flex items-center justify-between text-gray-600">
          <div>
            Sample <b>{deleted.title || deleted.sid}</b> deleted.
          </div>
          <button className="underline" onClick={() => setDeleted(null)}>
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <p>Loading samples…</p>
      ) : (
        <SampleList wsId={wsId} items={items} onDeleted={(p) => setDeleted(p)} />
      )}
    </section>
  )
}
