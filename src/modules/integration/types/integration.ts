import { z } from 'zod';

export const IntegrationSchema = z.object({
  id: z.string().uuid('Invalid integration ID'),
  provider: z.enum(['email', 'slack', 'microsoft', 'google', 'openai', 'anthropic', 'stripe']),
  status: z.enum(['active', 'inactive', 'error', 'pending']),
  config: z.record(z.any()),
  company_id: z.string().uuid('Invalid company ID'),
  created_at: z.date(),
  updated_at: z.date(),
  last_sync: z.date().optional(),
  error_message: z.string().optional()
});

export type Integration = z.infer<typeof IntegrationSchema>;

export const IntegrationConfigSchema = z.object({
  credentials: z.record(z.string()),
  settings: z.record(z.any()).optional(),
  webhooks: z.array(z.string()).optional(),
  scopes: z.array(z.string()).optional()
});

export type IntegrationConfig = z.infer<typeof IntegrationConfigSchema>;