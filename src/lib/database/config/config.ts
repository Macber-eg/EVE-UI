import { z } from 'zod';
import { environmentService } from '../../../config/environment';
import { DatabaseConfig } from './types';

const configSchema = z.object({
  url: z.string().url('Invalid database URL'),
  key: z.string().min(1, 'Database key is required'),
  schema: z.string().min(1),
  maxRetries: z.number().min(0),
  retryDelay: z.number().min(0)
});

export function createDatabaseConfig(): DatabaseConfig {
  const url = environmentService.get('SUPABASE_URL');
  const key = environmentService.get('SUPABASE_ANON_KEY');

  if (!url || !key) {
    throw new Error('Missing required database configuration');
  }

  const config: DatabaseConfig = {
    url,
    key,
    schema: 'public',
    maxRetries: 3,
    retryDelay: 1000
  };

  const result = configSchema.safeParse(config);
  if (!result.success) {
    throw new Error(`Invalid database configuration: ${result.error.message}`);
  }

  return config;
}