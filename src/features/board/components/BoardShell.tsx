import type { PropsWithChildren, ReactNode } from 'react'

type Props = PropsWithChildren<{
  sidebar?: ReactNode
}>

/**
 * Provides a consistent, high-contrast canvas + sidebar container.
 * - Content on white cards
 * - Subtle background and borders to avoid “white on white”
 */
export function BoardShell({ children, sidebar }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_360px] gap-0">
        <div className="p-4 md:p-6 bg-slate-50">
          <div className="space-y-4">{children}</div>
        </div>

        {/* Sidebar panel */}
        <aside className="border-t md:border-t-0 md:border-l border-slate-200 p-4 md:p-6 bg-white">
          {sidebar}
        </aside>
      </div>
    </div>
  )
}
