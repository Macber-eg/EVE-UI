import { z } from 'zod';

export type EVECategory = 
  | 'communication'
  | 'strategy'
  | 'social'
  | 'finance'
  | 'operations'
  | 'security';

export type IntegrationType = 
  | 'email'
  | 'whatsapp'
  | 'slack'
  | 'social_media'
  | 'crm'
  | 'accounting'
  | 'analytics';

export interface Integration {
  type: IntegrationType;
  name: string;
  description: string;
  required: boolean;
  config_schema: Record<string, any>;
}

export interface PrebuiltEVE {
  id: string;
  name: string;
  role: string;
  category: EVECategory;
  description: string;
  capabilities: string[];
  required_integrations: Integration[];
  models: {
    provider: 'openai' | 'anthropic';
    model: string;
    purpose: string;
  }[];
  min_subscription_tier: 'starter' | 'growth' | 'enterprise';
}

export const PrebuiltEVESchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  category: z.enum(['communication', 'strategy', 'social', 'finance', 'operations', 'security']),
  description: z.string(),
  capabilities: z.array(z.string()),
  required_integrations: z.array(z.object({
    type: z.enum([
      'email',
      'whatsapp',
      'slack',
      'social_media',
      'crm',
      'accounting',
      'analytics'
    ]),
    name: z.string(),
    description: z.string(),
    required: z.boolean(),
    config_schema: z.record(z.any())
  })),
  models: z.array(z.object({
    provider: z.enum(['openai', 'anthropic']),
    model: z.string(),
    purpose: z.string()
  })),
  min_subscription_tier: z.enum(['starter', 'growth', 'enterprise'])
});