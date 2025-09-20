import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Block } from '@/features/blocks/types'

export function useBlocks(wsId: string, sid: string | undefined) {
  const [items, setItems] = useState<Array<{ id: string; data: Block }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sid) return
    const col = collection(db, `workspaces/${wsId}/samples/${sid}/blocks`)
    const q = query(col, orderBy('order', 'asc'))
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, data: d.data() as Block })))
      setLoading(false)
    })
    return unsub
  }, [wsId, sid])

  return { items, loading }
}
