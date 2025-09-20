export function AccessDenied() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">Access denied</h2>
      <p className="opacity-80">
        Your account is not a member of this workspace. Ask an editor to add you in Settings.
      </p>
    </section>
  )
}
