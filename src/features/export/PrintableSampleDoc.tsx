import type { Sample } from '@/features/samples/types'
import type { Block } from '@/features/blocks/types'
import { blockLabel } from '@/features/blocks/utils/labels'

type Props = {
  sample: Sample
  blocks: Block[]
}

/**
 * Hidden on-screen; visible in print. Keep DOM simple & print-friendly.
 */
export function PrintableSampleDoc({ sample, blocks }: Props) {
  const updated = sample.updatedAt?.toDate() ?? sample.createdAt?.toDate()
  return (
    <div id="print-root" className="print-only">
      {/* Cover */}
      <div style={{ pageBreakAfter: 'always' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>{sample.title || '(untitled)'}</h1>
        <div style={{ marginBottom: '12px', color: '#475569' }}>
          <div>
            <b>Status:</b> {sample.status}
          </div>
          <div>
            <b>Version:</b> v{sample.version}
          </div>
          <div>
            <b>Updated:</b> {updated ? updated.toLocaleString() : '—'}
          </div>
        </div>
        <p style={{ color: '#334155' }}>
          <b>Instructions</b> — follow the steps below. This document was exported from 4fit.
        </p>
      </div>

      {/* Content */}
      <div>
        {blocks.map((b, i) => {
          const sectionTitle = blockLabel(b, i)
          return (
            <section key={i} style={{ breakInside: 'avoid', marginBottom: '18px' }}>
              <h2 style={{ fontSize: '18px', margin: '0 0 6px 0' }}>{sectionTitle}</h2>

              {b.kind === 'text' && (
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {b.text || <em style={{ color: '#64748b' }}>Empty text</em>}
                </div>
              )}

              {b.kind === 'image' && (
                <figure style={{ margin: 0 }}>
                  {/* Make images page-width friendly and keep aspect */}
                  <img
                    src={b.url}
                    alt={b.caption ?? ''}
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      marginBottom: '6px',
                    }}
                  />
                  {b.caption && (
                    <figcaption style={{ fontSize: '12px', color: '#475569' }}>
                      {b.caption}
                    </figcaption>
                  )}
                </figure>
              )}

              {b.kind === 'audio' && (
                <div style={{ color: '#334155' }}>
                  <div>
                    <b>Audio file:</b>{' '}
                    {b.url ? (
                      <a href={b.url} style={{ color: '#0f172a' }}>
                        {b.url}
                      </a>
                    ) : (
                      <em style={{ color: '#64748b' }}>No audio uploaded</em>
                    )}
                  </div>
                  {b.note && <div style={{ marginTop: '4px' }}>{b.note}</div>}
                </div>
              )}

              {b.kind === 'table' && (
                <div style={{ overflowX: 'auto' }}>
                  <table
                    style={{
                      borderCollapse: 'collapse',
                      width: '100%',
                      fontSize: '14px',
                    }}
                  >
                    <tbody>
                      {(b.rows ?? []).map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              style={{
                                border: '1px solid #cbd5e1',
                                padding: '6px 8px',
                                verticalAlign: 'top',
                              }}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
