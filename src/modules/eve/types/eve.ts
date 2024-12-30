import { z } from 'zod';

export const EVESchema = z.object({
  id: z.string().uuid('Invalid EVE ID'),
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  status: z.enum(['active', 'busy', 'idle']),
  type: z.enum(['orchestrator', 'specialist', 'support']),
  capabilities: z.array(z.string()),
  performance: z.object({
    efficiency: z.number().min(0).max(100),
    accuracy: z.number().min(0).max(100),
    tasks_completed: z.number().min(0)
  }),
  models: z.array(z.object({
    provider: z.enum(['openai', 'anthropic']),
    model: z.string(),
    purpose: z.string()
  }))
});

export type EVE = z.infer<typeof EVESchema>;