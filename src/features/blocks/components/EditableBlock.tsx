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

  return (
    <div
      className={[
        'relative group rounded-xl border border-slate-200 bg-white p-4 shadow-sm',
        'focus-within:ring-2 focus-within:ring-blue-500',
        editing ? 'pt-12' : '', // reserve space for the editing toolbar
      ].join(' ')}
      draggable={canEdit && !editing}
      onDragStart={() => !editing && onDragStart?.(id)}
      onDragOver={(e) => {
        if (!canEdit || editing) return
        e.preventDefault()
        onDropOver?.(id)
      }}
    >
      {/* EDITING TOOLBAR (docked, non-overlapping) */}
      {canEdit && editing && (
        <div className="absolute inset-x-0 top-0 z-10 flex justify-end gap-2 rounded-t-xl border-b bg-white/85 px-2 py-2 backdrop-blur-sm">
          <button
            className="px-3 py-1.5 rounded-md bg-emerald-600 text-white shadow-sm hover:bg-emerald-500"
            onClick={save}
          >
            Save
          </button>
          <button
            className="px-3 py-1.5 rounded-md border bg-white text-slate-800 shadow-sm hover:bg-slate-50"
            onClick={() => setEditing(false)}
          >
            Cancel
          </button>
        </div>
      )}

      {/* VIEW TOOLBAR (floats, shows on hover) */}
      {canEdit && !editing && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <span
            className="cursor-grab select-none rounded-md border border-slate-300 bg-white px-2 py-1 text-slate-700 shadow-sm"
            title="Drag to reorder"
            aria-label="Drag to reorder"
          >
            ⇅
          </span>
          <button
            className="rounded-md bg-slate-900 px-3 py-1.5 text-white shadow-sm hover:bg-slate-800"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
          <button
            className="rounded-md bg-red-600 px-3 py-1.5 text-white shadow-sm hover:bg-red-500"
            onClick={async () => {
              await deleteBlock(wsId, sid, id)
              await reorderBlocks(wsId, sid)
            }}
          >
            Delete
          </button>
        </div>
      )}

      {/* VIEW */}
      {!editing && (
        <div className="text-slate-800 [&_*]:text-slate-800 [&_a]:text-slate-900">
          <BlockRenderer block={block} />
        </div>
      )}

      {/* EDITORS */}
      {editing && block.kind === 'text' && (
        <textarea
          className="w-full min-h-[180px] rounded-lg bg-slate-900 p-3 text-slate-50 ring-2 ring-blue-500 focus:outline-none"
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
          placeholder="Write text…"
        />
      )}

      {editing && block.kind === 'image' && (
        <input
          className="w-full rounded-lg border border-slate-300 p-2 text-slate-900"
          value={localCaption}
          onChange={(e) => setLocalCaption(e.target.value)}
          placeholder="Caption…"
        />
      )}

      {editing && block.kind === 'audio' && (
        <input
          className="w-full rounded-lg border border-slate-300 p-2 text-slate-900"
          value={localNote}
          onChange={(e) => setLocalNote(e.target.value)}
          placeholder="Note…"
        />
      )}

      {editing && block.kind === 'table' && (
        <div className="space-y-2">
          <div className="text-sm text-slate-700">Click a cell to edit</div>
          <div className="overflow-x-auto">
            <table className="border-separate border-spacing-0">
              <tbody>
                {localTable.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className="px-0 py-0 border border-slate-300">
                        <input
                          className="min-w-[96px] px-2 py-1 text-slate-900 outline-none"
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
              className="rounded border px-2 py-1 text-sm"
              onClick={() => setLocalTable((t) => [...t, Array(t[0]?.length || 2).fill('')])}
            >
              + Row
            </button>
            <button
              className="rounded border px-2 py-1 text-sm"
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
