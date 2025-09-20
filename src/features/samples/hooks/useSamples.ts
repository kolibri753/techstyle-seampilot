import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Sample } from '@/features/samples/types'

export function useSamples(wsId: string) {
  const [items, setItems] = useState<Array<{ id: string; data: Sample }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const col = collection(db, `workspaces/${wsId}/samples`)
    const q = query(col, orderBy('updatedAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, data: d.data() as Sample })))
      setLoading(false)
    })
    return unsub
  }, [wsId])

  return { items, loading }
}
