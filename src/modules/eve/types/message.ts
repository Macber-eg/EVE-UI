import { z } from 'zod';

export const MessageSchema = z.object({
  id: z.string().uuid('Invalid message ID'),
  from_eve_id: z.string().uuid('Invalid sender EVE ID'),
  to_eve_id: z.string().uuid('Invalid recipient EVE ID'),
  content: z.string().min(1, 'Message content is required'),
  type: z.enum(['direct', 'broadcast', 'task', 'status_update']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  status: z.enum(['sent', 'delivered', 'read', 'processed']),
  created_at: z.date(),
  metadata: z.object({
    task_id: z.string().uuid().optional(),
    requires_response: z.boolean().optional(),
    context: z.record(z.any()).optional()
  }).optional()
});

export type EVEMessage = z.infer<typeof MessageSchema>;