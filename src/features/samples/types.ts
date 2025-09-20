import type { Timestamp } from 'firebase/firestore'

export type SampleStatus = 'draft' | 'open-for-comments' | 'approved' | 'closed'

export type Sample = {
  title: string
  status: SampleStatus
  version: number
  updatedAt?: Timestamp
  createdAt?: Timestamp
}
