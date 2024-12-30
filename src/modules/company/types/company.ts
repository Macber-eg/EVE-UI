import { z } from 'zod';

export const CompanySchema = z.object({
  id: z.string().uuid('Invalid company ID'),
  name: z.string().min(1, 'Company name is required'),
  type: z.enum(['corporation', 'llc', 'nonprofit']),
  jurisdiction: z.string().min(1, 'Jurisdiction is required'),
  status: z.enum(['pending', 'active', 'paused', 'terminated']).default('pending'),
  owner_id: z.string().uuid('Invalid owner ID'),
  contact: z.object({
    email: z.string().email('Invalid email address'),
    phone: z.string().optional()
  }),
  settings: z.object({
    industry: z.string().min(1, 'Industry is required'),
    autonomy_level: z.enum(['full', 'high', 'medium', 'low']).default('medium'),
    human_oversight_required: z.array(z.string()).default([]),
    notification_preferences: z.object({
      email: z.boolean().default(true),
      push: z.boolean().default(true),
      urgency_threshold: z.enum(['low', 'medium', 'high', 'critical']).default('medium')
    })
  })
});

export type Company = z.infer<typeof CompanySchema>;