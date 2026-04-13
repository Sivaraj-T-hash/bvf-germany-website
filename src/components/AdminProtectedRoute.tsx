import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';

export default function AdminProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!user) {
    return <Navigate to="/admin" replace state={{ from: location.pathname }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/admin" replace state={{ from: location.pathname, unauthorized: true }} />;
  }

  return children;
}
