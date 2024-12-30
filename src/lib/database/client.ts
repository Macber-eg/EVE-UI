import { createClient } from '@supabase/supabase-js';
import type { Database, DatabaseConfig } from './types';
import { ConnectionError } from './errors';
import { environmentService } from '../../config/environment';

export class DatabaseClient {
  private static instance: DatabaseClient;
  private client;
  private initialized = false;

  private constructor() {
    const url = environmentService.get('SUPABASE_URL');
    const key = environmentService.get('SUPABASE_ANON_KEY');

    if (!url || !key) {
      throw new Error('Missing required database configuration');
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

  public static getInstance(): DatabaseClient {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = new DatabaseClient();
    }
    return DatabaseClient.instance;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const { data: { version }, error } = await this.client.rpc('version');
      if (error) throw error;
      
      this.initialized = true;
      console.debug('Database client initialized:', version);
    } catch (error) {
      throw new ConnectionError('Failed to initialize database client');
    }
  }

  public getClient() {
    if (!this.initialized) {
      throw new ConnectionError('Database client not initialized');
    }
    return this.client;
  }
}

export const databaseClient = DatabaseClient.getInstance();