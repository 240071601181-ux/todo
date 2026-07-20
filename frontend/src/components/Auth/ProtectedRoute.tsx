import { Navigate, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppProvider'
import LoadingPage from '../../pages/LoadingPage'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isAuthLoading } = useApp()
  const location = useLocation()

  if (isAuthLoading) {
    return <LoadingPage />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
