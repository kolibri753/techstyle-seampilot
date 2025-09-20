type Props = { title?: string; hint?: string; action?: React.ReactNode }

export function EmptyState({ title = 'Nothing here yet', hint, action }: Props) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 text-center dark:border-slate-700 dark:bg-slate-900">
      <div className="text-3xl mb-2">📝</div>
      <p className="font-medium">{title}</p>
      {hint && <p className="text-sm mt-1">{hint}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
