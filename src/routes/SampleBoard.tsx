import { useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { env } from '@/lib/env'
import { useSample } from '@/features/samples/hooks/useSample'
import { fmtDateTime } from '@/lib/date'
import { useMember } from '@/routes/useMember'
import { AddBlockBar } from '@/features/blocks/components/AddBlockBar'
import { useBlocks } from '@/features/blocks/hooks/useBlocks'
import { EditableBlock } from '@/features/blocks/components/EditableBlock'
import { CommentsPanel } from '@/features/comments/components/CommentsPanel'
import { reorderBlocks, updateBlock } from '@/features/blocks/api'

export function SampleBoard() {
  const { wsId = env.DEFAULT_WS_ID, sid } = useParams()
  const { data: sample, loading } = useSample(wsId, sid)
  const { member } = useMember(wsId)
  const { items: blocks, loading: bLoading } = useBlocks(wsId, sid)
  const canEdit = member?.role === 'editor'

  // drag state (very light)
  const draggingId = useRef<string | null>(null)
  const [localOrder, setLocalOrder] = useState<string[]>([])

  // compute labels for comment dropdown
  const blockOptions = useMemo(
    () =>
      blocks.map(({ id, data }, i) => ({
        id,
        label:
          data.kind === 'text'
            ? `Text #${i + 1}`
            : data.kind === 'image'
              ? `Image #${i + 1}`
              : data.kind === 'audio'
                ? `Audio #${i + 1}`
                : `Table #${i + 1}`,
      })),
    [blocks],
  )

  if (loading || !sid) return <div>Loading…</div>
  if (!sample) return <div>Sample not found.</div>

  const updated = sample.updatedAt?.toDate() ?? sample.createdAt?.toDate()

  const applyReorder = async (fromId: string, overId: string) => {
    if (!canEdit || fromId === overId) return
    // optimistic reorder by swapping 'order' values
    const from = blocks.find((b) => b.id === fromId)
    const over = blocks.find((b) => b.id === overId)
    if (!from || !over) return
    setLocalOrder((o) => {
      if (o.length === 0) return blocks.map((b) => b.id)
      return o
    })
    try {
      await updateBlock(wsId, sid, fromId, { order: over.data.order })
      await updateBlock(wsId, sid, overId, { order: from.data.order })
      await reorderBlocks(wsId, sid)
    } catch {
      // ignore; server snapshot will recover
    }
  }

  const visibleBlocks = blocks // server-ordered; localOrder could be used for finer UX if needed

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm">
            <Link className="underline" to={`/w/${wsId}${canEdit ? '/editor' : ''}`}>
              ← Back
            </Link>
          </div>
          <h2 className="text-xl font-semibold">{sample.title || '(untitled)'}</h2>
          <p className="text-sm text-gray-600">
            Status: {sample.status} · v{sample.version} · Updated: {fmtDateTime(updated)}
          </p>
        </div>
        {canEdit && sid && <AddBlockBar wsId={wsId} sid={sid} />}
      </div>

      {/* Content + Comments */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-4">
        {/* Canvas */}
        <div className="space-y-3">
          {bLoading ? (
            <div>Loading content…</div>
          ) : visibleBlocks.length === 0 ? (
            <div className="rounded border p-4 text-gray-600">No content yet.</div>
          ) : (
            visibleBlocks.map(({ id, data }) => (
              <EditableBlock
                key={id}
                wsId={wsId}
                sid={sid}
                id={id}
                block={data}
                canEdit={canEdit}
                onDragStart={(dragId) => (draggingId.current = dragId)}
                onDropOver={(overId) => {
                  if (draggingId.current) {
                    void applyReorder(draggingId.current, overId)
                    draggingId.current = null
                  }
                }}
              />
            ))
          )}
        </div>

        {/* Comments */}
        <CommentsPanel wsId={wsId} sid={sid} blocks={blockOptions} />
      </div>
    </section>
  )
}
