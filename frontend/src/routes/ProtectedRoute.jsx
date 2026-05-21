import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children, permission }) {
  const { user, loading, hasPermission, hasRole } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-navy-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-surface-200 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (permission && !hasRole('Super Admin') && !hasPermission(permission)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}
