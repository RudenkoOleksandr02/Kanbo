import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { getRouteLogin } from '@/shared/const/router.ts'
import { getUser } from '@/entities/User'

export function RequireAuth({ children }: { children: ReactNode }) {
  const { authData } = useSelector(getUser)
  const location = useLocation()

  if (!authData) {
    return <Navigate to={getRouteLogin()} state={{ from: location }} replace />
  }

  return children
}
