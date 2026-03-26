import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export function ProtectedRoute({ allowedRoles }) {
  const { user } = useAuthStore()

  if (!user) return <Navigate to="/login" replace />

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}

export function PublicRoute() {
  const { user } = useAuthStore()
  if (user) return <Navigate to="/" replace />
  return <Outlet />
}
