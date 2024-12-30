import { createClient } from '@supabase/supabase-js';
import { AppError } from '../error';
import { Logger } from '../logger';

export class DatabaseService {
  private static instance: DatabaseService;
  private client;
  private logger: Logger;

  private constructor() {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new AppError('Missing database configuration', 'CONFIG_ERROR', 500);
    }

    this.client = createClient(url, key);
    this.logger = Logger.getInstance();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async query<T>(table: string, query: any): Promise<T> {
    try {
      const { data, error } = await this.client
        .from(table)
        .select(query);

      if (error) throw error;
      return data as T;
    } catch (error) {
      this.logger.error('Database query error:', error);
      throw new AppError('Database query failed', 'DATABASE_ERROR', 500);
    }
  }

  // Add other database methods
}