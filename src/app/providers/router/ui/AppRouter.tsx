import { Route, Routes } from 'react-router-dom'
import { routeConfig } from '../config/routeConfig.tsx'

const AppRouter = () => {
  return (
    <Routes>
      {Object.entries(routeConfig).map(([routeName, route]) => (
        <Route key={routeName} path={route.path} element={route.element} />
      ))}
    </Routes>
  )
}

export default AppRouter
