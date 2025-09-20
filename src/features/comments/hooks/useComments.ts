import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { CommentDoc } from '@/features/comments/types'

export function useComments(wsId: string, sid: string | undefined) {
  const [items, setItems] = useState<Array<{ id: string; data: CommentDoc }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sid) return
    const col = collection(db, `workspaces/${wsId}/samples/${sid}/comments`)
    const q = query(col, orderBy('createdAt', 'asc'))
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, data: d.data() as CommentDoc })))
      setLoading(false)
    })
    return unsub
  }, [wsId, sid])

  return { items, loading }
}
