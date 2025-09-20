type Props = { title?: string; hint?: string; action?: React.ReactNode }

export function EmptyState({ title = 'Nothing here yet', hint, action }: Props) {
  return (
    <div className="rounded-lg border text-app p-6 text-center">
      <div className="text-3xl mb-2">📝</div>
      <p className="font-medium">{title}</p>
      {hint && <p className="text-sm mt-1">{hint}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
