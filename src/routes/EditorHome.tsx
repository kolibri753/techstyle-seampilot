import { env } from '@/lib/env'

export function EditorHome() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">Dashboard (Editor)</h2>
      <p className="opacity-80">Workspace: {env.DEFAULT_WS_ID}</p>
      <ul className="list-disc pl-5">
        <li>+ Sample</li>
        <li>Open/Close comments</li>
        <li>Create revision / Export PDF</li>
        <li>Settings (members, invite)</li>
      </ul>
    </section>
  )
}
