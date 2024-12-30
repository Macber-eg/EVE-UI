import { createClient } from '@supabase/supabase-js';
import type { Database } from '../lib/database/types';
import { AppError } from '../utils/error-handling';

// Supabase configuration
const supabaseUrl = 'https://bfabdzpuaunyblhaqtfk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmYWJkenB1YXVueWJsaGFxdGZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1NDYyOTMsImV4cCI6MjA1MTEyMjI5M30.WFutH4-tqWxGhpVTxwA-CzNIP6jVDfzmlB4D4HfiJTQ';

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
});

// Database initialization function
export const initializeDatabase = async (retries = 3): Promise<void> => {
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
        const delay = Math.min(1000 * Math.pow(2, i), 10000);
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
};

// Connection check utility
export const checkConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('version');
    return !error;
  } catch (err) {
    console.error('Database connection check failed:', err);
    return false;
  }
};