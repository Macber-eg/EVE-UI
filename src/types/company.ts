import { z } from 'zod';

export const CompanySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  type: z.enum(['corporation', 'llc', 'nonprofit']),
  jurisdiction: z.string().min(1, 'Jurisdiction is required'),
  contact: z.object({
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
  }).optional(),
  settings: z.object({
    industry: z.string().min(1, 'Industry is required'),
    autonomy_level: z.enum(['full', 'high', 'medium', 'low']).default('medium'),
    human_oversight_required: z.array(z.string()).default([]),
    notification_preferences: z.object({
      email: z.boolean().default(true),
      push: z.boolean().default(true),
      urgency_threshold: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
    }).default({
      email: true,
      push: true,
      urgency_threshold: 'medium'
    })
  }).default({
    industry: '',
    autonomy_level: 'medium',
    human_oversight_required: [],
    notification_preferences: {
      email: true,
      push: true,
      urgency_threshold: 'medium'
    }
  })
});

export type Company = z.infer<typeof CompanySchema>;