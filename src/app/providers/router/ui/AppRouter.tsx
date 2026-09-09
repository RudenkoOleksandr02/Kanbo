import { Route, Routes, Navigate } from 'react-router-dom'
import { getRouteBoard } from '@/shared/const/router.ts'
import { routeConfig } from '../config/routeConfig.tsx'
import type { AppRouteProps } from '@/shared/types/router.ts'
import { RequireAuth } from './RequireAuth.tsx'
import { Suspense } from 'react'

const AppRouter = () => {
  const renderRoute = (routeName: string, route: AppRouteProps) => {
    return (
      <Route
        key={routeName}
        path={route.path}
        element={route.authOnly ? <RequireAuth>{route.element}</RequireAuth> : route.element}
      />
    )
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Navigate to={getRouteBoard()} replace />} />
        {Object.entries(routeConfig).map(([routeName, route]) => renderRoute(routeName, route))}
      </Routes>
    </Suspense>
  )
}

export default AppRouter
