import { z } from 'zod';

// Base schemas
export const UUIDSchema = z.string().uuid('Invalid UUID format');

export const TimestampSchema = z.string().datetime('Invalid timestamp format').or(z.date());

export const MetadataSchema = z.object({
  task_id: UUIDSchema.optional(),
  requires_response: z.boolean().optional(),
  response_deadline: TimestampSchema.optional(),
  context: z.record(z.any()).optional(),
}).optional();

// EVE related schemas
export const EVEIdSchema = UUIDSchema.describe('EVE ID');

export const EVEPerformanceSchema = z.object({
  efficiency: z.number().min(0).max(100),
  accuracy: z.number().min(0).max(100),
  tasks_completed: z.number().min(0)
});

export const EVEModelSchema = z.object({
  provider: z.enum(['openai', 'anthropic']),
  model: z.string().min(1),
  purpose: z.string().min(1)
});

export const EVESchema = z.object({
  id: EVEIdSchema,
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  status: z.enum(['active', 'busy', 'idle']),
  type: z.enum(['orchestrator', 'specialist', 'support']),
  capabilities: z.array(z.string()),
  performance: EVEPerformanceSchema,
  models: z.array(EVEModelSchema)
});

// Message schemas
export const EVEMessageSchema = z.object({
  from_eve_id: EVEIdSchema,
  to_eve_id: EVEIdSchema,
  content: z.string().min(1, 'Message content is required'),
  type: z.enum(['direct', 'broadcast', 'task', 'status_update']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  status: z.enum(['sent', 'delivered', 'read', 'processed']),
  metadata: MetadataSchema
});

export const EVEMessageResponseSchema = EVEMessageSchema.extend({
  id: UUIDSchema,
  created_at: TimestampSchema,
  delivered_at: TimestampSchema.optional(),
  read_at: TimestampSchema.optional(),
  processed_at: TimestampSchema.optional()
});

// Validation functions
export const validateEVEId = (id: string): boolean => {
  const result = EVEIdSchema.safeParse(id);
  return result.success;
};

export const validateEVEMessage = (message: unknown): boolean => {
  const result = EVEMessageSchema.safeParse(message);
  return result.success;
};

export const parseEVEMessage = (message: unknown) => {
  return EVEMessageSchema.parse(message);
};

export const parseEVEMessageResponse = (message: unknown) => {
  return EVEMessageResponseSchema.parse(message);
};