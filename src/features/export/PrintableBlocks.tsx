import type { Block, ImageBlock, AudioBlock, TableBlock, TextBlock } from '@/features/blocks/types'
import type { Sample } from '@/features/samples/types'
import { fmtDateTime } from '@/lib/date'

/**
 * Print-only renderer.
 * Shows a small header with Sample details, then ONLY block contents (no block titles).
 * Everything else in the app is hidden during printing.
 */
export function PrintableBlocks({ sample, blocks }: { sample: Sample; blocks: Block[] }) {
  const updated =
    sample.updatedAt?.toDate?.() ??
    (sample.createdAt?.toDate ? sample.createdAt.toDate() : undefined)

  return (
    <div id="print-root" className="hidden print:block">
      <style>{`
        @page { margin: 16mm; }
        @media print {
          /* Show only the print root */
          body * { visibility: hidden !important; }
          #print-root, #print-root * { visibility: visible !important; }
          #print-root { position: absolute; inset: 0; padding: 0; margin: 0; }
        }
        .print-container {
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
          color: #0f172a; /* slate-900-ish */
          font-size: 12pt;
        }
        .print-header { margin-bottom: 14pt; }
        .print-title { font-size: 18pt; font-weight: 600; margin: 0 0 4pt 0; }
        .print-meta { font-size: 10pt; color: #475569; } /* slate-600 */
        .print-block { page-break-inside: avoid; margin: 12pt 0 14pt; }
        .print-block img { max-width: 100%; height: auto; border-radius: 6px; }
        .print-table { border-collapse: collapse; width: 100%; }
        .print-table td { border: 1px solid #cbd5e1; padding: 6px 8px; vertical-align: top; }
        .pre { white-space: pre-wrap; line-height: 1.6; }
        .breakable-link { word-break: break-all; text-decoration: none; color: inherit; }
      `}</style>

      <div className="print-container">
        {/* Sample details ONLY */}
        <div className="print-header">
          <div className="print-title">{sample.title || '(untitled)'}</div>
          <div className="print-meta">
            Status: {sample.status} • v{sample.version} • Updated: {fmtDateTime(updated)}
          </div>
        </div>

        {/* Block contents */}
        {blocks.map((b, i) => {
          if (b.kind === 'text') {
            const t = b as TextBlock
            return (
              <div key={i} className="print-block pre">
                {t.text}
              </div>
            )
          }

          if (b.kind === 'image') {
            const img = b as ImageBlock
            return (
              <div key={i} className="print-block">
                <img src={img.url} alt={img.caption ?? ''} />
                {img.caption ? (
                  <div className="pre" style={{ marginTop: 6 }}>
                    {img.caption}
                  </div>
                ) : null}
              </div>
            )
          }

          if (b.kind === 'audio') {
            const a = b as AudioBlock
            return (
              <div key={i} className="print-block">
                {/* No audio player in PDFs; include URL and optional note */}
                <div style={{ marginBottom: 6 }}>
                  <a className="breakable-link" href={a.url} rel="noreferrer noopener">
                    {a.url}
                  </a>
                </div>
                {a.note ? <div className="pre">{a.note}</div> : null}
              </div>
            )
          }

          if (b.kind === 'table') {
            const t = b as TableBlock
            return (
              <div key={i} className="print-block">
                <table className="print-table">
                  <tbody>
                    {(t.rows ?? []).map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, c) => (
                          <td key={c}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }

          return <div key={i} className="print-block" />
        })}
      </div>
    </div>
  )
}
