import { Navigate } from 'react-router-dom'
import { useApp } from '../../context/AppProvider'
import type { ReactNode } from 'react'

interface PublicRouteProps {
  children: ReactNode
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated } = useApp()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
