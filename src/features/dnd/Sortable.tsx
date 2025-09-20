import type { CSSProperties, ReactNode } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type Render = (p: {
  setNodeRef: (el: HTMLElement | null) => void
  attributes: any
  listeners: any
  style: CSSProperties
}) => ReactNode

export function Sortable({
  id,
  disabled,
  children,
}: {
  id: string
  disabled?: boolean
  children: Render
}) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id,
    disabled,
  })
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : undefined,
  }
  return <>{children({ setNodeRef, attributes, listeners, style })}</>
}
