import { type AppRoute, AppRoutes, getRouteBoard } from '@/shared/const/router.ts'
import { BoardPage } from '@/pages/BoardPage'
import type { RouteProps } from 'react-router-dom'

export const routeConfig: Record<AppRoute, RouteProps> = {
  [AppRoutes.BOARD]: {
    path: getRouteBoard(),
    element: <BoardPage />,
  },
}
