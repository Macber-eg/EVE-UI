import { useState, useEffect } from 'react';
import { environmentService } from '../config/environment';
import { supabase, initializeDatabase } from '../lib/supabase';
import { AppError } from '../utils/error-handling';

export function useInitialization() {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    let mounted = true;
    let retryTimeout: NodeJS.Timeout;

    async function initialize() {
      try {
        // Validate environment variables
        if (!environmentService.validate()) {
          throw new AppError(
            'Missing required environment variables. Please check your configuration.',
            'CONFIG_ERROR',
            500
          );
        }

        // Initialize database with retries
        await initializeDatabase();

        // Get initial auth session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.warn('Session retrieval warning:', sessionError);
        }

        if (mounted) {
          setInitialized(true);
          setError(null);
        }
      } catch (err) {
        console.error('Initialization error:', err);
        
        if (mounted) {
          setError(
            err instanceof AppError 
              ? err.message 
              : 'Failed to initialize application. Please try again.'
          );

          if (retryCount < maxRetries) {
            const delay = 2000 * Math.pow(2, retryCount);
            console.debug(`Retrying initialization in ${delay}ms...`);
            
            setRetryCount(prev => prev + 1);
            retryTimeout = setTimeout(() => {
              if (mounted) initialize();
            }, delay);
          }
        }
      }
    }

    initialize();

    return () => {
      mounted = false;
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [retryCount]);

  return { 
    initialized, 
    error,
    isRetrying: retryCount > 0 && retryCount < maxRetries 
  };
}