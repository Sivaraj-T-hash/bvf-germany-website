import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading, studentApproved, studentStatus, mustChangePassword, passwordStatusLoading } = useAuth();
  const location = useLocation();

  if (loading || passwordStatusLoading) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!studentApproved) {
    return <Navigate to="/login" replace state={{ from: location.pathname, requiresApproval: true, studentStatus }} />;
  }

  if (mustChangePassword) {
    return <Navigate to="/change-password" replace state={{ from: location.pathname }} />;
  }

  return children;
}
