import { Link } from 'react-router-dom'
import type { Sample } from '@/features/samples/types'
import { fmtDateTime } from '@/lib/date'
import { DeleteSampleButton } from '@/features/samples/components/DeleteSampleButton'

type Item = { id: string; data: Sample }
type Props = {
  wsId: string
  items: Item[]
  onDeleted?: (p: { sid: string; title?: string }) => void
}

export function SampleList({ wsId, items, onDeleted }: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded border p-4">
        <p className="mb-1 font-medium">No samples yet</p>
        <p className="opacity-70 text-sm">Create one from editor tools.</p>
      </div>
    )
  }

  return (
    <ul className="divide-y rounded border">
      {items.map(({ id, data }) => {
        const updated = data.updatedAt?.toDate() ?? data.createdAt?.toDate()
        return (
          <li key={id} className="p-3 hover:bg-gray-50">
            {/* row content: title/metadata + actions */}
            <div className="flex items-center justify-between gap-3">
              <Link to={`/w/${wsId}/s/${id}`} className="flex-1">
                <div className="font-medium">{data.title || '(untitled)'}</div>
                <div className="text-sm">
                  Status: {data.status} · v{data.version} · Updated: {fmtDateTime(updated)}
                </div>
              </Link>

              <div className="shrink-0 flex items-center gap-3">
                <Link to={`/w/${wsId}/s/${id}`} className="text-sm underline">
                  Open
                </Link>
                <DeleteSampleButton wsId={wsId} sid={id} title={data.title} onDeleted={onDeleted} />
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
