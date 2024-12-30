
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './components/ErrorBoundary';
import AppRoutes from './routes';
import { useSession } from './hooks/useSession';
import { LoadingState } from './components/common/LoadingState';
import { useInitialization } from './hooks/useInitialization';
import { AlertTriangle } from 'lucide-react';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      //cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  const { loading: sessionLoading } = useSession();
  const { initialized, error, isRetrying } = useInitialization();

  // Show loading state while initializing
  if (!initialized || sessionLoading) {
    return (
      <LoadingState 
        message={isRetrying ? "Retrying connection..." : "Initializing application..."} 
      />
    );
  }

  // Show error state if initialization failed
  if (error) {
    return (
      <div className="min-h-screen bg-[#040707] flex items-center justify-center">
        <div className="bg-white/5 rounded-lg p-8 max-w-lg mx-4">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <h1 className="text-xl font-semibold text-white">Something went wrong</h1>
          </div>
          <p className="text-gray-400 mb-6">
            We apologize for the inconvenience. Please try refreshing the page or contact support if the problem persists.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-[#72f68e] text-[#040707] py-2 rounded-lg hover:bg-[#72f68e]/90 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}