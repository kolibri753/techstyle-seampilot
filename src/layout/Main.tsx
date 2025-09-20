import { Routes, Route, Navigate } from 'react-router-dom'
import { Login } from '@/routes/Login'
import { RoleLanding } from '@/routes/RoleLanding'
import { CommentatorHome } from '@/routes/CommentatorHome'
import { EditorHome } from '@/routes/EditorHome'
import { AccessDenied } from '@/routes/AccessDenied'
import { NotFound } from '@/routes/NotFound'

export function Main() {
  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-6 flex-1">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/app" element={<RoleLanding />} />

        <Route path="/w/:wsId" element={<CommentatorHome />} />
        <Route path="/w/:wsId/editor" element={<EditorHome />} />

        <Route path="/denied" element={<AccessDenied />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </main>
  )
}
