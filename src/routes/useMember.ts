import { useEffect, useState } from 'react'
import { auth, db } from '@/lib/firebase'
import { doc, onSnapshot } from 'firebase/firestore'

export type MemberDoc = { role: 'editor' | 'commentator'; displayName?: string } | null

export function useMember(wsId: string) {
  const [member, setMember] = useState<MemberDoc>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const uid = auth.currentUser?.uid
    if (!uid) {
      setMember(null)
      setLoading(false)
      return
    }
    const ref = doc(db, `workspaces/${wsId}/members/${uid}`)
    const unsub = onSnapshot(ref, (snap) => {
      setMember(snap.exists() ? (snap.data() as MemberDoc) : null)
      setLoading(false)
    })
    return unsub
  }, [wsId])

  return { member, loading }
}
