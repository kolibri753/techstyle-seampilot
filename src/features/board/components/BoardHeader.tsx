import { Link } from 'react-router-dom'
import { fmtDateTime } from '@/lib/date'

type Props = {
  backTo: string
  title: string
  status: string
  version: number
  updated?: Date
  right?: React.ReactNode // actions (e.g., AddBlockBar)
}

export function BoardHeader({ backTo, title, status, version, updated, right }: Props) {
  return (
    <div className="mb-2 md:mb-3">
      <div className="text-sm">
        <Link className="underline text-slate-700 hover:text-slate-900" to={backTo}>
          ← Back
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">{title || '(untitled)'}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-slate-300 bg-white px-2 py-0.5 text-xs font-medium text-slate-800">
              Status: {status}
            </span>
            <span className="inline-flex items-center rounded-full border border-slate-300 bg-white px-2 py-0.5 text-xs font-medium text-slate-800">
              v{version}
            </span>
            <span className="text-xs text-slate-300">
              Updated: <b className="font-medium">{fmtDateTime(updated)}</b>
            </span>
          </div>
        </div>

        {right && <div className="shrink-0">{right}</div>}
      </div>
    </div>
  )
}
