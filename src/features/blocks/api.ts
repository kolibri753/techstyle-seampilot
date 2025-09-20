import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { db, storage } from '@/lib/firebase'
import type { Block, BlockKind } from './types'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export async function createBlock(
  wsId: string,
  sid: string,
  uid: string,
  kind: BlockKind,
  data?: Partial<Block>,
): Promise<string> {
  // put at the end (Date.now() is stable enough for MVP, then we reindex on reorder)
  const res = await addDoc(collection(db, `workspaces/${wsId}/samples/${sid}/blocks`), {
    kind,
    order: Date.now(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: uid,
    updatedBy: uid,
    ...(data ?? {}),
  })
  return res.id
}

export async function updateBlock(
  wsId: string,
  sid: string,
  bid: string,
  patch: Partial<Block>,
  uid?: string,
) {
  const ref = doc(db, `workspaces/${wsId}/samples/${sid}/blocks/${bid}`)
  await updateDoc(ref, { ...patch, updatedBy: uid, updatedAt: serverTimestamp() })
}

export async function deleteBlock(wsId: string, sid: string, bid: string) {
  await deleteDoc(doc(db, `workspaces/${wsId}/samples/${sid}/blocks/${bid}`))
}

export async function reorderBlocks(wsId: string, sid: string) {
  // Reindex 0..N by current order asc
  const q = query(
    collection(db, `workspaces/${wsId}/samples/${sid}/blocks`),
    orderBy('order', 'asc'),
  )
  const snap = await getDocs(q)
  const batch = writeBatch(db)
  snap.docs.forEach((d, i) => batch.update(d.ref, { order: i }))
  await batch.commit()
}

export async function uploadToStorage(path: string, file: File) {
  const r = ref(storage, path)
  await uploadBytes(r, file)
  return getDownloadURL(r)
}

export async function setBlockOrder(
  wsId: string,
  sid: string,
  bid: string,
  order: number,
  uid?: string,
) {
  await updateBlock(wsId, sid, bid, { order }, uid)
}
