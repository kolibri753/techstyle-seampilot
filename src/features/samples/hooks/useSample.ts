import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Sample } from '@/features/samples/types'

export function useSample(wsId: string, sid: string | undefined) {
  const [data, setData] = useState<Sample | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!wsId || !sid) return
    const ref = doc(db, `workspaces/${wsId}/samples/${sid}`)
    const unsub = onSnapshot(ref, (snap) => {
      setData(snap.exists() ? (snap.data() as Sample) : null)
      setLoading(false)
    })
    return unsub
  }, [wsId, sid])

  return { data, loading }
}
