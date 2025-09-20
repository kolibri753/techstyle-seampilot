import type { Block } from '@/features/blocks/types'

type Props = { block: Block }

export function BlockRenderer({ block }: Props) {
  switch (block.kind) {
    case 'text':
      return <p className="whitespace-pre-wrap leading-relaxed">{block.text || '—'}</p>
    case 'image':
      return (
        <figure className="space-y-1">
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img src={block.url} className="max-w-full rounded border" />
          {block.caption && (
            <figcaption className="text-sm text-gray-600">{block.caption}</figcaption>
          )}
        </figure>
      )
    case 'audio':
      return (
        <div className="space-y-1">
          <audio controls src={block.url} className="w-full" />
          {block.note && <div className="text-sm text-gray-600">{block.note}</div>}
        </div>
      )
    case 'table':
      return (
        <div className="overflow-x-auto">
          <table className="border-separate border-spacing-0 w-full">
            <tbody>
              {block.rows?.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="border px-2 py-1 align-top">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    default:
      return <div className="text-sm text-gray-500">Unsupported block</div>
  }
}
