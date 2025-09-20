import { useRef, useState } from 'react'
import { auth } from '@/lib/firebase'
import { env } from '@/lib/env'
import { createBlock, reorderBlocks, uploadToStorage } from '@/features/blocks/api'
import type { BlockKind } from '@/features/blocks/types'

type Props = { wsId?: string; sid: string; onAdded?: () => void }

export function AddBlockBar({ wsId = env.DEFAULT_WS_ID, sid, onAdded }: Props) {
  const uid = auth.currentUser?.uid
  const imgInput = useRef<HTMLInputElement>(null)
  const audInput = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const mustSignIn = !uid

  const addSimple = async (kind: BlockKind) => {
    if (mustSignIn) return
    setBusy(true)
    try {
      if (kind === 'text') await createBlock(wsId, sid, uid!, 'text', { text: '' })
      if (kind === 'table')
        await createBlock(wsId, sid, uid!, 'table', {
          rows: [
            ['', ''],
            ['', ''],
          ],
        })
      await reorderBlocks(wsId, sid)
      onAdded?.()
    } finally {
      setBusy(false)
    }
  }

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>, kind: 'image' | 'audio') => {
    if (mustSignIn) return
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    try {
      const prefix = kind === 'image' ? 'images' : 'audio'
      const url = await uploadToStorage(`uploads/${uid}/${prefix}/${Date.now()}-${file.name}`, file)
      if (kind === 'image') await createBlock(wsId, sid, uid!, 'image', { url })
      if (kind === 'audio') await createBlock(wsId, sid, uid!, 'audio', { url })
      await reorderBlocks(wsId, sid)
      onAdded?.()
    } finally {
      setBusy(false)
      e.currentTarget.value = ''
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        className="border rounded px-2 py-1 text-sm"
        onClick={() => addSimple('text')}
        disabled={busy || mustSignIn}
      >
        + Text
      </button>
      <button
        className="border rounded px-2 py-1 text-sm"
        onClick={() => imgInput.current?.click()}
        disabled={busy || mustSignIn}
      >
        + Image
      </button>
      <button
        className="border rounded px-2 py-1 text-sm"
        onClick={() => audInput.current?.click()}
        disabled={busy || mustSignIn}
      >
        + Voice
      </button>
      <button
        className="border rounded px-2 py-1 text-sm"
        onClick={() => addSimple('table')}
        disabled={busy || mustSignIn}
      >
        + Table
      </button>

      <input
        ref={imgInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onPick(e, 'image')}
      />
      <input
        ref={audInput}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(e) => onPick(e, 'audio')}
      />
    </div>
  )
}
