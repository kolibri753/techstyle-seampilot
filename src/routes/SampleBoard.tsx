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
import type { Block } from '@/features/blocks/types'
import { ExportButton } from '@/features/export/ExportButton'
import { PrintableBlocks } from '@/features/export/PrintableBlocks'

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

  // ensure we only render ids that still exist in blocks (prevents undefined .data crash)
  const presentIds = useMemo(
    () => ids.filter((id) => blocks.some((b) => b.id === id)),
    [ids, blocks],
  )

  // transient highlight
  const [focusId, setFocusId] = useState<string | null>(null)
  const jumpToBlock = (bid: string) => {
    const el = document.getElementById(`block-${bid}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setFocusId(bid)
      window.setTimeout(() => setFocusId((cur) => (cur === bid ? null : cur)), 1600)
    }
  }

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

    if (newOrder == null) {
      await reorderBlocks(wsId, sid!)
      await setBlockOrder(wsId, sid!, movedId, idx * 1000)
    } else {
      await setBlockOrder(wsId, sid!, movedId, newOrder)
    }
  }

  // ordered block data for printing (matches on-screen order)
  const orderedBlocks: Block[] = presentIds
    .map((id) => blocks.find((b) => b.id === id)?.data)
    .filter(Boolean) as Block[]

  return (
    <section className="space-y-6">
      <BoardHeader
        backTo={`/w/${wsId}${canEdit ? '/editor' : ''}`}
        title={sample.title}
        status={sample.status}
        version={sample.version}
        updated={updated}
        right={
          <div className="flex items-center gap-2">
            <ExportButton />
            {canEdit && sid ? <AddBlockBar wsId={wsId} sid={sid} /> : null}
          </div>
        }
      />

      <BoardShell
        sidebar={
          <CommentsPanel wsId={wsId} sid={sid} blocks={blockOptions} onJumpToBlock={jumpToBlock} />
        }
      >
        {bLoading ? (
          <div className="rounded-lg border border-app bg-surface p-4">Loading content…</div>
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
              if (!canEdit || !over) return
              const a = String(active.id)
              const o = String(over.id)
              setIds((prev) => {
                if (a === o || !prev.includes(a) || !prev.includes(o)) return prev
                return arrayMove(prev, prev.indexOf(a), prev.indexOf(o))
              })
            }}
            onDragEnd={async ({ active, over }) => {
              if (!canEdit || !over) return
              const a = String(active.id)
              const o = String(over.id)
              if (a === o) return
              if (!ids.includes(a) || !ids.includes(o)) return
              await commitNewOrder(a)
            }}
          >
            <SortableContext items={presentIds} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {presentIds.map((id) => {
                  const rec = blocks.find((b) => b.id === id)
                  if (!rec) return null
                  const data = rec.data
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
                          domId={`block-${id}`}
                          highlighted={focusId === id}
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

      <PrintableBlocks sample={sample} blocks={orderedBlocks} />
    </section>
  )
}
