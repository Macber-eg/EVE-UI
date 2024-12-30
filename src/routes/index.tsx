import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { LoadingState } from '../components/common/LoadingState';
import { useAuthStore } from '../store/authStore';

// Eager load critical components
import LandingPage from '../components/LandingPage';
import AuthForm from '../components/auth/AuthForm';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import CompanySetupFlow from '../components/setup/CompanySetupFlow';

// Lazy load dashboard components
const OverviewDashboard = lazy(() => import('../components/dashboard/overview/OverviewDashboard'));
const EVEListView = lazy(() => import('../components/dashboard/agents/EVEListView'));
const HumansView = lazy(() => import('../components/dashboard/humans/HumansView'));
const TeamsView = lazy(() => import('../components/dashboard/teams/TeamsView'));
const DocumentsView = lazy(() => import('../components/dashboard/documents/DocumentsView'));
const TaskQueueView = lazy(() => import('../components/dashboard/tasks/TaskQueueView'));
const APIIntegrationView = lazy(() => import('../components/dashboard/api/APIIntegrationView'));
const FeedbackLoopView = lazy(() => import('../components/dashboard/feedback/FeedbackLoopView'));
const ReportsView = lazy(() => import('../components/dashboard/reports/ReportsView'));
const SettingsView = lazy(() => import('../components/dashboard/settings/SettingsView'));

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <LoadingState message="Loading..." />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default function AppRoutes() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/auth" 
          element={
            <PublicRoute>
              <AuthForm />
            </PublicRoute>
          } 
        />

        {/* Company Setup */}
        <Route
          path="/setup"
          element={
            <PrivateRoute>
              <CompanySetupFlow />
            </PrivateRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<LoadingState message="Loading dashboard..." />}>
                <OverviewDashboard />
              </Suspense>
            }
          />
          <Route
            path="agents"
            element={
              <Suspense fallback={<LoadingState message="Loading EVEs..." />}>
                <EVEListView />
              </Suspense>
            }
          />
          <Route
            path="humans"
            element={
              <Suspense fallback={<LoadingState message="Loading team..." />}>
                <HumansView />
              </Suspense>
            }
          />
          <Route
            path="teams"
            element={
              <Suspense fallback={<LoadingState message="Loading teams..." />}>
                <TeamsView />
              </Suspense>
            }
          />
          <Route
            path="documents"
            element={
              <Suspense fallback={<LoadingState message="Loading documents..." />}>
                <DocumentsView />
              </Suspense>
            }
          />
          <Route
            path="tasks"
            element={
              <Suspense fallback={<LoadingState message="Loading tasks..." />}>
                <TaskQueueView />
              </Suspense>
            }
          />
          <Route
            path="api"
            element={
              <Suspense fallback={<LoadingState message="Loading integrations..." />}>
                <APIIntegrationView />
              </Suspense>
            }
          />
          <Route
            path="feedback"
            element={
              <Suspense fallback={<LoadingState message="Loading feedback..." />}>
                <FeedbackLoopView />
              </Suspense>
            }
          />
          <Route
            path="reports"
            element={
              <Suspense fallback={<LoadingState message="Loading reports..." />}>
                <ReportsView />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<LoadingState message="Loading settings..." />}>
                <SettingsView />
              </Suspense>
            }
          />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}