import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, writeBatch } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export type CreateSampleInput = {
  title: string
}

export async function createSample(
  wsId: string,
  uid: string,
  input: CreateSampleInput,
): Promise<string> {
  const title = input.title.trim() || 'Untitled sample'
  const ref = await addDoc(collection(db, `workspaces/${wsId}/samples`), {
    title,
    status: 'draft',
    version: 1,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: uid,
    updatedBy: uid,
  })
  return ref.id
}

async function deleteCollection(path: string) {
  const snap = await getDocs(collection(db, path))
  if (snap.empty) return
  const batch = writeBatch(db)
  snap.forEach((d) => batch.delete(d.ref))
  await batch.commit()
}

export async function deleteSample(wsId: string, sid: string): Promise<void> {
  await deleteCollection(`workspaces/${wsId}/samples/${sid}/steps`)
  await deleteCollection(`workspaces/${wsId}/samples/${sid}/comments`)
  await deleteDoc(doc(db, `workspaces/${wsId}/samples/${sid}`))
}
