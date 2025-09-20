import { useParams } from 'react-router-dom'
import { env } from '@/lib/env'
import { useSample } from '@/features/samples/hooks/useSample'
import { fmtDateTime } from '@/lib/date'

export function SampleBoard() {
  const { wsId = env.DEFAULT_WS_ID, sid } = useParams()
  const { data, loading } = useSample(wsId, sid)

  if (loading) return <div>Loading…</div>
  if (!data) return <div>Sample not found.</div>

  const updated = data.updatedAt?.toDate() ?? data.createdAt?.toDate()

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-xl font-semibold">{data.title || '(untitled)'}</h2>
        <p className="opacity-70 text-sm">
          Status: {data.status} · v{data.version} · Updated: {fmtDateTime(updated)}
        </p>
      </div>

      <div className="rounded border p-4">
        <p className="opacity-80">TODO: steps (left), active step (center), comments (right).</p>
      </div>
    </section>
  )
}
