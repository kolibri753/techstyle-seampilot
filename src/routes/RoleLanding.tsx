import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useMember } from '@/routes/useMember'
import { env } from '@/lib/env'

export function RoleLanding() {
  const { user, loading } = useAuth()
  const { member, loading: mLoading } = useMember(env.DEFAULT_WS_ID)
  const nav = useNavigate()

  useEffect(() => {
    if (!loading && !mLoading && user) {
      if (!member) nav('/denied', { replace: true })
      else if (member.role === 'editor') nav(`/w/${env.DEFAULT_WS_ID}/editor`, { replace: true })
      else nav(`/w/${env.DEFAULT_WS_ID}`, { replace: true })
    }
  }, [loading, mLoading, user, member, nav])

  if (loading || mLoading) return <div>Loading…</div>
  if (!user) return <Navigate to="/" replace />
  return <div /> // brief placeholder before navigate
}
