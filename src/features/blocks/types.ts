import type { Timestamp } from 'firebase/firestore'

export type BlockKind = 'text' | 'image' | 'audio' | 'table'

type Base = {
  kind: BlockKind
  order: number
  createdAt?: Timestamp
  updatedAt?: Timestamp
  createdBy?: string
  updatedBy?: string
}

export type TextBlock = Base & { kind: 'text'; text: string }
export type ImageBlock = Base & { kind: 'image'; url: string; caption?: string }
export type AudioBlock = Base & { kind: 'audio'; url: string; note?: string }
export type TableBlock = Base & { kind: 'table'; rows: string[][] }

export type Block = TextBlock | ImageBlock | AudioBlock | TableBlock
