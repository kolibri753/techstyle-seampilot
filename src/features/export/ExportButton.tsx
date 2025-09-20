export function ExportButton() {
  return (
    <button
      type="button"
      className="border rounded px-3 py-2 font-medium"
      onClick={() => window.print()}
      title="Save as PDF in the print dialog"
    >
      Export PDF
    </button>
  )
}
