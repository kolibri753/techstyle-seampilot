import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { CommentDoc } from './types'

export async function addComment(wsId: string, sid: string, data: Omit<CommentDoc, 'createdAt'>) {
  await addDoc(collection(db, `workspaces/${wsId}/samples/${sid}/comments`), {
    ...data,
    createdAt: serverTimestamp(),
  })
}
