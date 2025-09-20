import type { Block } from '@/features/blocks/types'

export function blockLabel(data: Block, index: number) {
  const n = index + 1
  switch (data.kind) {
    case 'text':
      return `Text #${n}`
    case 'image':
      return `Image #${n}`
    case 'audio':
      return `Audio #${n}`
    case 'table':
      return `Table #${n}`
    default:
      return `Block #${n}`
  }
}
