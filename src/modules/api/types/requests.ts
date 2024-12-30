import { z } from 'zod';

export const RequestConfigSchema = z.object({
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
  url: z.string().min(1),
  data: z.any().optional(),
  params: z.record(z.any()).optional(),
  headers: z.record(z.string()).optional(),
  timeout: z.number().optional(),
  withCredentials: z.boolean().optional()
});

export type RequestConfig = z.infer<typeof RequestConfigSchema>;