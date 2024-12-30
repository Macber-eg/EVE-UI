import { DatabaseConfig } from './types';
import { environmentService } from '../../config/environment';

export class DatabaseConfigService {
  private static instance: DatabaseConfigService;

  private constructor() {}

  public static getInstance(): DatabaseConfigService {
    if (!DatabaseConfigService.instance) {
      DatabaseConfigService.instance = new DatabaseConfigService();
    }
    return DatabaseConfigService.instance;
  }

  public getConfig(): DatabaseConfig {
    const url = environmentService.get('SUPABASE_URL');
    const key = environmentService.get('SUPABASE_ANON_KEY');

    if (!url || !key) {
      throw new Error('Missing required database configuration');
    }

    return new DatabaseConfig(url, key, 'public', 3, 1000);
  }
}

export const databaseConfigService = DatabaseConfigService.getInstance();