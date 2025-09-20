import type { Timestamp } from 'firebase/firestore'

export type CommentDoc = {
  text: string
  blockId?: string
  createdAt?: Timestamp
  createdBy: string
  displayName?: string
}
