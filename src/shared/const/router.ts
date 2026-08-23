export const AppRoutes = {
  BOARD: 'board',
} as const

export type AppRoute = (typeof AppRoutes)[keyof typeof AppRoutes]

export const getRouteBoard = () => `/${AppRoutes.BOARD}`
