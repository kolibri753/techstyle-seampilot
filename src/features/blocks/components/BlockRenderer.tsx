import type { Block } from '@/features/blocks/types'

export function BlockRenderer({ block }: { block: Block }) {
  if (block.kind === 'text') {
    return (
      <div className="whitespace-pre-wrap break-words leading-7 text-[15px]">
        {block.text || <span className="italic">Empty text</span>}
      </div>
    )
  }

  if (block.kind === 'image') {
    return (
      <figure className="space-y-2">
        <img
          src={block.url}
          alt={block.caption ?? ''}
          className="rounded-md border border-app bg-surface max-h-[480px] w-full object-contain"
        />
        {block.caption && <figcaption className="text-sm">{block.caption}</figcaption>}
      </figure>
    )
  }

  if (block.kind === 'audio') {
    return (
      <div className="space-y-2">
        {block.url ? (
          <audio controls src={block.url} className="w-full" />
        ) : (
          <div className="text-slate-500 dark:text-slate-400">No audio uploaded</div>
        )}
        {block.note && <div className="text-sm">{block.note}</div>}
      </div>
    )
  }

  if (block.kind === 'table') {
    return (
      <div className="overflow-x-auto">
        <table className="border-collapse">
          <tbody>
            {(block.rows ?? []).map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className="border border-slate-300 dark:border-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return <div className="text-slate-500">Unsupported block</div>
}
