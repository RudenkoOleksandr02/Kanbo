import { type AppRoute, AppRoutes, getRouteBoard, getRouteLogin } from '@/shared/const/router.ts'
import { BoardPage } from '@/pages/BoardPage'
import type { RouteProps } from 'react-router-dom'
import { LoginPage } from '@/pages/LoginPage'

export const routeConfig: Record<AppRoute, RouteProps> = {
  [AppRoutes.BOARD]: {
    path: getRouteBoard(),
    element: <BoardPage />,
  },
  [AppRoutes.LOGIN]: {
    path: getRouteLogin(),
    element: <LoginPage />,
  },
}
