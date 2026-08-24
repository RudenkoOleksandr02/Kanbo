export const AppRoutes = {
  BOARD: 'board',
  LOGIN: 'login',
} as const

export type AppRoute = (typeof AppRoutes)[keyof typeof AppRoutes]

export const getRouteBoard = () => `/${AppRoutes.BOARD}`
export const getRouteLogin = () => `/${AppRoutes.LOGIN}`
