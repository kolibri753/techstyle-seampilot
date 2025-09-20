import { useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { env } from '@/lib/env'
import { useSample } from '@/features/samples/hooks/useSample'
import { useMember } from '@/routes/useMember'
import { AddBlockBar } from '@/features/blocks/components/AddBlockBar'
import { useBlocks } from '@/features/blocks/hooks/useBlocks'
import { EditableBlock } from '@/features/blocks/components/EditableBlock'
import { CommentsPanel } from '@/features/comments/components/CommentsPanel'
import { reorderBlocks, updateBlock } from '@/features/blocks/api'
import { BoardShell as BlockShell } from '@/features/board/components/BoardShell'
import { BoardHeader } from '@/features/board/components/BoardHeader'
import { EmptyState } from '@/features/board/components/EmptyState'
import { blockLabel } from '@/features/blocks/utils/labels'

// alias name matches file export
const BoardShell = BlockShell

export function SampleBoard() {
  const { wsId = env.DEFAULT_WS_ID, sid } = useParams()
  const { data: sample, loading } = useSample(wsId, sid)
  const { member } = useMember(wsId)
  const { items: blocks, loading: bLoading } = useBlocks(wsId, sid)
  const canEdit = member?.role === 'editor'

  const draggingId = useRef<string | null>(null)
  const [, /*localOrder*/ setLocalOrder] = useState<string[]>([])

  const blockOptions = useMemo(
    () => blocks.map(({ id, data }, i) => ({ id, label: blockLabel(data, i) })),
    [blocks],
  )

  if (loading || !sid) return <div>Loading…</div>
  if (!sample) return <div>Sample not found.</div>

  const updated = sample.updatedAt?.toDate() ?? sample.createdAt?.toDate()

  const applyReorder = async (fromId: string, overId: string) => {
    if (!canEdit || fromId === overId) return
    const from = blocks.find((b) => b.id === fromId)
    const over = blocks.find((b) => b.id === overId)
    if (!from || !over) return
    setLocalOrder((o) => (o.length === 0 ? blocks.map((b) => b.id) : o))
    try {
      await updateBlock(wsId, sid, fromId, { order: over.data.order })
      await updateBlock(wsId, sid, overId, { order: from.data.order })
      await reorderBlocks(wsId, sid)
    } catch {
      // no-op; snapshot will reconcile
    }
  }

  return (
    <section className="space-y-6">
      <BoardHeader
        backTo={`/w/${wsId}${canEdit ? '/editor' : ''}`}
        title={sample.title}
        status={sample.status}
        version={sample.version}
        updated={updated}
        right={canEdit && sid ? <AddBlockBar wsId={wsId} sid={sid} /> : null}
      />

      <BoardShell sidebar={<CommentsPanel wsId={wsId} sid={sid} blocks={blockOptions} />}>
        {bLoading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-4">Loading content…</div>
        ) : blocks.length === 0 ? (
          <EmptyState
            title="No content yet"
            hint={
              canEdit
                ? 'Add text, images, voice notes, or a table.'
                : 'The editor has not added content yet.'
            }
            action={canEdit ? <AddBlockBar wsId={wsId} sid={sid} /> : null}
          />
        ) : (
          <div className="space-y-3">
            {blocks.map(({ id, data }) => (
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
            ))}
          </div>
        )}
      </BoardShell>
    </section>
  )
}
