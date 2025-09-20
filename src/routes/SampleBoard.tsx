import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'

import { env } from '@/lib/env'
import { useSample } from '@/features/samples/hooks/useSample'
import { useMember } from '@/routes/useMember'
import { AddBlockBar } from '@/features/blocks/components/AddBlockBar'
import { useBlocks } from '@/features/blocks/hooks/useBlocks'
import { EditableBlock } from '@/features/blocks/components/EditableBlock'
import { CommentsPanel } from '@/features/comments/components/CommentsPanel'
import { reorderBlocks, setBlockOrder } from '@/features/blocks/api'
import { BoardShell as BlockShell } from '@/features/board/components/BoardShell'
import { BoardHeader } from '@/features/board/components/BoardHeader'
import { EmptyState } from '@/features/board/components/EmptyState'
import { blockLabel } from '@/features/blocks/utils/labels'
import { Sortable } from '@/features/dnd/Sortable'
import { between } from '@/features/blocks/utils/order'

// alias name matches file export
const BoardShell = BlockShell

export function SampleBoard() {
  const { wsId = env.DEFAULT_WS_ID, sid } = useParams()
  const { data: sample, loading } = useSample(wsId, sid)
  const { member } = useMember(wsId)
  const { items: blocks, loading: bLoading } = useBlocks(wsId, sid)
  const canEdit = member?.role === 'editor'

  // optimistic list of ids for live resorting
  const [ids, setIds] = useState<string[]>([])
  useEffect(() => setIds(blocks.map((b) => b.id)), [blocks])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  )

  const blockOptions = useMemo(
    () => blocks.map(({ id, data }, i) => ({ id, label: blockLabel(data, i) })),
    [blocks],
  )

  if (loading || !sid) return <div>Loading…</div>
  if (!sample) return <div>Sample not found.</div>

  const updated = sample.updatedAt?.toDate() ?? sample.createdAt?.toDate()
  const findOrder = (bid: string) => blocks.find((b) => b.id === bid)?.data.order

  const commitNewOrder = async (movedId: string) => {
    const idx = ids.indexOf(movedId)
    const prevId = idx > 0 ? ids[idx - 1] : undefined
    const nextId = idx < ids.length - 1 ? ids[idx + 1] : undefined
    const newOrder = between(
      prevId ? findOrder(prevId) : undefined,
      nextId ? findOrder(nextId) : undefined,
    )

    // If neighbors too tight, normalize then set explicit index-based order
    if (newOrder == null) {
      await reorderBlocks(wsId, sid!)
      await setBlockOrder(wsId, sid!, movedId, idx * 1000)
    } else {
      await setBlockOrder(wsId, sid!, movedId, newOrder)
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragOver={({ active, over }) => {
              if (!canEdit || !over || active.id === over.id) return
              setIds((prev) =>
                arrayMove(prev, prev.indexOf(String(active.id)), prev.indexOf(String(over.id))),
              )
            }}
            onDragEnd={async ({ active, over }) => {
              if (!canEdit || !over || active.id === over.id) return
              await commitNewOrder(String(active.id))
            }}
          >
            <SortableContext items={ids} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {ids.map((id) => {
                  const data = blocks.find((b) => b.id === id)!.data
                  return (
                    <Sortable key={id} id={id} disabled={!canEdit}>
                      {({ setNodeRef, attributes, listeners, style }) => (
                        <EditableBlock
                          wsId={wsId}
                          sid={sid!}
                          id={id}
                          block={data}
                          canEdit={canEdit}
                          containerRef={setNodeRef}
                          dndStyle={style}
                          handleProps={{ ...attributes, ...listeners }}
                        />
                      )}
                    </Sortable>
                  )
                })}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </BoardShell>
    </section>
  )
}
