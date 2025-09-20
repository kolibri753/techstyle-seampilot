// Apply the 'dark' class ASAP based on saved preference or system.
(() => {
  try {
    const raw = localStorage.getItem('ui:theme') as 'light' | 'dark' | 'system' | null
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
    const dark = raw === 'dark' || (raw !== 'light' && prefersDark) // system by default
    document.documentElement.classList.toggle('dark', !!dark)
  } catch {
    // no-op
  }
})()
