import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

/**
 * Guards a route behind login, and optionally behind specific roles.
 * Unauthenticated visitors are sent to /login; logged-in users of the wrong
 * role are sent back to their own /admin home instead of an access-denied page.
 */
function ProtectedRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return null
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/admin" replace />
  }

  return children
}

export default ProtectedRoute
