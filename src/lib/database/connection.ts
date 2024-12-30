import { createClient } from '@supabase/supabase-js';
import type { Database, DatabaseConfig } from './types';
import { AppError } from '../../utils/error-handling';
import { environmentService } from '../../config/environment';

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private client;
  private initialized = false;

  private constructor() {
    const url = environmentService.get('SUPABASE_URL');
    const key = environmentService.get('SUPABASE_ANON_KEY');

    if (!url || !key) {
      throw new AppError('Missing required database configuration', 'CONFIG_ERROR', 500);
    }

    this.client = createClient<Database>(url, key, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      },
      db: {
        schema: 'public'
      }
    });
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public getClient() {
    if (!this.initialized) {
      throw new AppError('Database not initialized', 'CONNECTION_ERROR', 500);
    }
    return this.client;
  }

  public setInitialized(value: boolean) {
    this.initialized = value;
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public async testConnection(): Promise<boolean> {
    try {
      const { error } = await this.client.rpc('version');
      return !error;
    } catch (err) {
      console.error('Connection test failed:', err);
      return false;
    }
  }
}

export const dbConnection = DatabaseConnection.getInstance();