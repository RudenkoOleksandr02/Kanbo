import { Route, Routes } from 'react-router-dom'
import { routeConfig } from '../config/routeConfig.tsx'
import type { AppRouteProps } from '@/shared/types/router.ts'
import { RequireAuth } from './RequireAuth.tsx'

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
    <Routes>
      {Object.entries(routeConfig).map(([routeName, route]) => renderRoute(routeName, route))}
    </Routes>
  )
}

export default AppRouter
