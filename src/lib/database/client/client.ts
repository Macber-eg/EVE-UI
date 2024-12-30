import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types';
import { databaseConfigService } from '../config/service';
import { ConnectionError } from '../errors';

export class DatabaseClient {
  private static instance: DatabaseClient;
  private client;
  private initialized = false;

  private constructor() {
    const config = databaseConfigService.getConfig();
    
    this.client = createClient<Database>(config.url, config.key, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      },
      db: {
        schema: config.schema || 'public'
      }
    });

    // Add debug logging
    console.debug('Database client created with URL:', config.url);
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
      console.debug('Initializing database connection...');
      const { data: { version }, error } = await this.client.rpc('version');
      
      if (error) {
        console.error('Database initialization error:', error);
        throw error;
      }
      
      this.initialized = true;
      console.debug('Database client initialized successfully:', version);
    } catch (error) {
      console.error('Failed to initialize database client:', error);
      throw new ConnectionError('Failed to initialize database client');
    }
  }

  public getClient() {
    if (!this.initialized) {
      throw new ConnectionError('Database client not initialized');
    }
    return this.client;
  }

  // Add test connection method
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

export const databaseClient = DatabaseClient.getInstance();