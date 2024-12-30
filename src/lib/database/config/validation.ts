import { z } from 'zod';
import { DatabaseConfig } from '../types';

export const configSchema = z.object({
  url: z.string().url('Invalid database URL'),
  key: z.string().min(1, 'Database key is required'),
  schema: z.string().min(1),
  maxRetries: z.number().min(0),
  retryDelay: z.number().min(0)
});

export function validateConfig(config: DatabaseConfig): void {
  const result = configSchema.safeParse(config);
  if (!result.success) {
    throw new Error(`Invalid database configuration: ${result.error.message}`);
  }
}