import { useState } from 'react'
import type { Block } from '@/features/blocks/types'
import { updateBlock, deleteBlock, reorderBlocks } from '@/features/blocks/api'
import { env } from '@/lib/env'
import { auth } from '@/lib/firebase'
import { BlockRenderer } from './BlockRenderer'

type Props = {
  wsId?: string
  sid: string
  id: string
  block: Block
  canEdit: boolean
  onDragStart?: (id: string) => void
  onDropOver?: (id: string) => void
}

export function EditableBlock({
  wsId = env.DEFAULT_WS_ID,
  sid,
  id,
  block,
  canEdit,
  onDragStart,
  onDropOver,
}: Props) {
  const [editing, setEditing] = useState(false)
  const [localText, setLocalText] = useState(block.kind === 'text' ? block.text : '')
  const [localCaption, setLocalCaption] = useState(
    block.kind === 'image' ? (block.caption ?? '') : '',
  )
  const [localNote, setLocalNote] = useState(block.kind === 'audio' ? (block.note ?? '') : '')
  const [localTable, setLocalTable] = useState(
    block.kind === 'table'
      ? (block.rows ?? [
          ['', ''],
          ['', ''],
        ])
      : [['', '']],
  )

  const uid = auth.currentUser?.uid

  const save = async () => {
    if (!uid) return
    if (block.kind === 'text') await updateBlock(wsId, sid, id, { text: localText }, uid)
    if (block.kind === 'image') await updateBlock(wsId, sid, id, { caption: localCaption }, uid)
    if (block.kind === 'audio') await updateBlock(wsId, sid, id, { note: localNote }, uid)
    if (block.kind === 'table') await updateBlock(wsId, sid, id, { rows: localTable }, uid)
    setEditing(false)
  }

  // Very light drag & drop: dragging wrapper only (HTML5)
  const draggable = canEdit

  return (
    <div
      className="rounded border p-3 bg-white"
      draggable={draggable}
      onDragStart={() => onDragStart?.(id)}
      onDragOver={(e) => {
        if (!draggable) return
        e.preventDefault()
        onDropOver?.(id)
      }}
    >
      {/* Toolbar (editor only) */}
      {canEdit && (
        <div className="flex items-center gap-2 justify-end mb-2 text-sm">
          <span className="cursor-grab select-none px-1 border rounded">⇅</span>
          {!editing && (
            <button className="underline" onClick={() => setEditing(true)} aria-label="Edit block">
              Edit
            </button>
          )}
          {editing && (
            <>
              <button className="underline" onClick={save}>
                Save
              </button>
              <button className="underline" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </>
          )}
          <button
            className="text-red-600 underline"
            onClick={async () => {
              await deleteBlock(wsId, sid, id)
              await reorderBlocks(wsId, sid)
            }}
          >
            Delete
          </button>
        </div>
      )}

      {/* Content / Editors */}
      {!editing && <BlockRenderer block={block} />}

      {editing && block.kind === 'text' && (
        <textarea
          className="w-full border rounded p-2 min-h-[120px]"
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
          placeholder="Write text…"
        />
      )}
      {editing && block.kind === 'image' && (
        <input
          className="w-full border rounded p-2"
          value={localCaption}
          onChange={(e) => setLocalCaption(e.target.value)}
          placeholder="Caption…"
        />
      )}
      {editing && block.kind === 'audio' && (
        <input
          className="w-full border rounded p-2"
          value={localNote}
          onChange={(e) => setLocalNote(e.target.value)}
          placeholder="Note…"
        />
      )}
      {editing && block.kind === 'table' && (
        <div className="space-y-2">
          <div className="text-sm text-gray-600">Click a cell to edit</div>
          <div className="overflow-x-auto">
            <table className="border-separate border-spacing-0">
              <tbody>
                {localTable.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className="border px-0 py-0">
                        <input
                          className="px-2 py-1 min-w-[80px] outline-none"
                          value={cell}
                          onChange={(e) => {
                            const next = localTable.map((r) => r.slice())
                            next[i][j] = e.target.value
                            setLocalTable(next)
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-2">
            <button
              className="border rounded px-2 py-1 text-sm"
              onClick={() => setLocalTable((t) => [...t, Array(t[0]?.length || 2).fill('')])}
            >
              + Row
            </button>
            <button
              className="border rounded px-2 py-1 text-sm"
              onClick={() => setLocalTable((t) => t.map((r) => [...r, '']))}
            >
              + Column
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
