import { useState } from 'react'
import { useComments } from '@/features/comments/hooks/useComments'
import { addComment } from '@/features/comments/api'
import { auth } from '@/lib/firebase'

type BlockOption = { id: string; label: string }
type Props = { wsId: string; sid: string; blocks?: BlockOption[] }

export function CommentsPanel({ wsId, sid, blocks = [] }: Props) {
  const { items } = useComments(wsId, sid)
  const [text, setText] = useState('')
  const [blockId, setBlockId] = useState<string>('')
  const uid = auth.currentUser?.uid

  const onSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uid || !text.trim()) return
    await addComment(wsId, sid, {
      text: text.trim(),
      blockId: blockId || undefined,
      createdBy: uid,
      displayName: auth.currentUser?.email || auth.currentUser?.uid || 'user',
    })
    setText('')
  }

  return (
    <div className="h-full">
      <h3 className="font-semibold text-slate-900 mb-3">Comments</h3>

      <form onSubmit={onSend} className="space-y-2 mb-4">
        {blocks.length > 0 && (
          <select
            className="w-full border border-slate-300 rounded px-2 py-1 text-sm text-slate-900"
            value={blockId}
            onChange={(e) => setBlockId(e.target.value)}
          >
            <option value="">General</option>
            {blocks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
        )}
        <textarea
          className="w-full border border-slate-300 rounded p-2 text-sm text-slate-900"
          rows={3}
          placeholder="Write a comment…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="border rounded px-3 py-1 text-sm font-medium bg-slate-900 text-white disabled:opacity-50"
          disabled={!uid || !text.trim()}
        >
          Send
        </button>
      </form>

      <ul className="space-y-3">
        {items.map(({ id, data }) => (
          <li key={id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs text-slate-700 mb-1">
              {data.displayName || data.createdBy}
              {data.blockId && <span className="ml-2 italic text-slate-600">(on block)</span>}
            </div>
            <div className="text-sm text-slate-900 whitespace-pre-wrap">{data.text}</div>
          </li>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-slate-700">No comments yet. Be the first to leave one.</p>
        )}
      </ul>
    </div>
  )
}
