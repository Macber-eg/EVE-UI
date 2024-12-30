import { z } from 'zod';

export const ApiResponseSchema = z.object({
  data: z.any(),
  status: z.number(),
  message: z.string().optional(),
  errors: z.array(z.string()).optional()
});

export type ApiResponse<T = any> = z.infer<typeof ApiResponseSchema> & {
  data: T;
};