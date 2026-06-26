import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'

const AuthLayout = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <LoadingSpinner fullPage />
  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'linear-gradient(135deg, #eef4fb 0%, #e8effa 50%, #eef4fb 100%)',
      }}
    >
      <Outlet />
    </div>
  )
}

export default AuthLayout
