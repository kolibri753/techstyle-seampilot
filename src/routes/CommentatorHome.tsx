import { env } from '@/lib/env'

export function CommentatorHome() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">Samples (Commentator)</h2>
      <p className="opacity-80">Workspace: {env.DEFAULT_WS_ID}</p>
      <p>TODO: list samples and open one to comment.</p>
    </section>
  )
}
