import { type AppRoute, AppRoutes, getRouteBoard, getRouteLogin } from '@/shared/const/router.ts'
import { BoardPage } from '@/pages/BoardPage'
import { LoginPage } from '@/pages/LoginPage'
import type { AppRouteProps } from '@/shared/types/router.ts'

export const routeConfig: Record<AppRoute, AppRouteProps> = {
  [AppRoutes.BOARD]: {
    path: getRouteBoard(),
    element: <BoardPage />,
    authOnly: true,
  },
  [AppRoutes.LOGIN]: {
    path: getRouteLogin(),
    element: <LoginPage />,
  },
}
