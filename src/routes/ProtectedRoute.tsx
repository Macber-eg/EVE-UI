
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCompanyStore } from '../store/companyStore';
import { LoadingState } from '../components/common/LoadingState';

export function ProtectedRoute() {
  const location = useLocation();
  const { user, loading: authLoading } = useAuthStore();
  const { company, loading: companyLoading } = useCompanyStore();

  // Show loading state while checking auth
  if (authLoading || companyLoading) {
    return <LoadingState message="Loading..." />;
  }

  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If user is logged in but no company info, redirect to company info page
  // except if they're already on the company info or setup pages
  if (!company && !['/company-info', '/setup'].includes(location.pathname)) {
    return <Navigate to="/company-info" replace />;
  }

  return <Outlet />;
}