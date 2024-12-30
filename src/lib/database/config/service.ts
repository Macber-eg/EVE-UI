import { DatabaseConfig } from '../types';
import { environmentService } from '../../../config/environment';
import { validateConfig } from './validation';

export class DatabaseConfigService {
  private static instance: DatabaseConfigService;
  private config: DatabaseConfig;

  private constructor() {
    const url = environmentService.get('SUPABASE_URL');
    const key = environmentService.get('SUPABASE_ANON_KEY');

    if (!url || !key) {
      throw new Error('Missing required database configuration');
    }

    this.config = {
      url,
      key,
      schema: 'public',
      maxRetries: 3,
      retryDelay: 1000
    };

    validateConfig(this.config);
  }

  public static getInstance(): DatabaseConfigService {
    if (!DatabaseConfigService.instance) {
      DatabaseConfigService.instance = new DatabaseConfigService();
    }
    return DatabaseConfigService.instance;
  }

  public getConfig(): DatabaseConfig {
    return { ...this.config };
  }
}

export const databaseConfigService = DatabaseConfigService.getInstance();