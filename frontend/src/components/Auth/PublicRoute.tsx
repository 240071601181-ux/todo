import { Navigate } from 'react-router-dom'
import { useApp } from '../../context/AppProvider'
import LoadingPage from '../../pages/LoadingPage'
import type { ReactNode } from 'react'

interface PublicRouteProps {
  children: ReactNode
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, isAuthLoading } = useApp()

  if (isAuthLoading) {
    return <LoadingPage />
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
