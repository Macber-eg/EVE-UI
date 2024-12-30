import { supabase } from '../supabase';
import { AppError } from '../../utils/error-handling';

export async function initializeDatabase(retries = 3): Promise<void> {
  let lastError;

  for (let i = 0; i < retries; i++) {
    try {
      // Test connection
      const { data: { version }, error: versionError } = await supabase.rpc('version');
      
      if (versionError) {
        console.warn('Database version check failed:', versionError);
        throw new AppError('Database connection failed', 'CONNECTION_ERROR', 500);
      }

      console.debug('Connected to PostgreSQL version:', version);
      return;
    } catch (err) {
      console.warn(`Database initialization attempt ${i + 1} failed:`, err);
      lastError = err;
      
      if (i < retries - 1) {
        const delay = Math.min(1000 * Math.pow(2, i), 10000); // Exponential backoff with 10s max
        console.debug(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw new AppError(
    'Failed to initialize database after multiple attempts',
    'DATABASE_ERROR',
    500,
    lastError
  );
}