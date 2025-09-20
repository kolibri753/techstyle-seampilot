import { useState } from 'react'
import { useComments } from '@/features/comments/hooks/useComments'
import { addComment } from '@/features/comments/api'
import { auth } from '@/lib/firebase'

type BlockOption = { id: string; label: string }

type Props = {
  wsId: string
  sid: string
  blocks?: BlockOption[]
}

export function CommentsPanel({ wsId, sid, blocks = [] }: Props) {
  const { items } = useComments(wsId, sid)
  const [text, setText] = useState('')
  const [blockId, setBlockId] = useState<string>('') // optional
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
    <aside className="w-full md:w-80 shrink-0 md:pl-4 border-t md:border-t-0 md:border-l pt-4 md:pt-0">
      <h3 className="font-semibold mb-2">Comments</h3>

      <form onSubmit={onSend} className="space-y-2 mb-4">
        {blocks.length > 0 && (
          <select
            className="w-full border rounded px-2 py-1 text-sm"
            value={blockId}
            onChange={(e) => setBlockId(e.target.value)}
          >
            <option value="">General</option>
            {blocks.map((b) => (
              <option key={b.id} value={b.id}>
                Block: {b.label}
              </option>
            ))}
          </select>
        )}
        <textarea
          className="w-full border rounded p-2 text-sm"
          rows={3}
          placeholder="Write a comment…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="border rounded px-3 py-1 text-sm font-medium"
          disabled={!uid || !text.trim()}
        >
          Send
        </button>
      </form>

      <ul className="space-y-3">
        {items.map(({ id, data }) => (
          <li key={id} className="rounded border p-2">
            <div className="text-xs text-gray-600 mb-1">
              {data.displayName || data.createdBy}
              {data.blockId && <span className="ml-2 italic">(on block)</span>}
            </div>
            <div className="text-sm whitespace-pre-wrap">{data.text}</div>
          </li>
        ))}
        {items.length === 0 && <p className="text-sm text-gray-600">No comments yet.</p>}
      </ul>
    </aside>
  )
}
