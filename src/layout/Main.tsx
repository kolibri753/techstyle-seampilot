import { Routes, Route, Navigate } from 'react-router-dom'
import { Splash } from '@/routes/Splash'
import { NotFound } from '@/routes/NotFound'

// placeholders for later routes (compile OK, add when ready)
function SamplesList() {
  return <div>Samples List (soon)</div>
}
function SampleBoard() {
  return <div>Sample Board (soon)</div>
}
function PrintView() {
  return <div>Print View (soon)</div>
}
function Settings() {
  return <div>Settings (soon)</div>
}

export function Main() {
  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-6 flex-1 ">
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/w/:wsId" element={<SamplesList />} />
        <Route path="/w/:wsId/s/:sid" element={<SampleBoard />} />
        <Route path="/w/:wsId/settings" element={<Settings />} />
        <Route path="/print/:sid" element={<PrintView />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </main> 
  )
}
