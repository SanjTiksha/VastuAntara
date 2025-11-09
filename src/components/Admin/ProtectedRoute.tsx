import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: 'admin'
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full border-4 border-accent/40 border-t-accent p-6" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin" replace />
  }

  return <>{children}</>
}

