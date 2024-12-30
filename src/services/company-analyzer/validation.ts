import { z } from 'zod';

export const CompanyAnalysisSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  type: z.enum(['corporation', 'llc', 'nonprofit']),
  jurisdiction: z.string().min(1, 'Jurisdiction is required'),
  contact: z.object({
    email: z.string().email('Invalid email'),
    phone: z.string().optional()
  }).optional().default({
    email: '',
    phone: ''
  }),
  settings: z.object({
    industry: z.string().min(1, 'Industry is required'),
    autonomy_level: z.enum(['low', 'medium', 'high', 'full']),
    human_oversight_required: z.array(z.string()).min(1),
    notification_preferences: z.object({
      email: z.boolean(),
      push: z.boolean(),
      urgency_threshold: z.enum(['low', 'medium', 'high', 'critical'])
    })
  })
});

export const CompanyDescriptionSchema = z.object({
  description: z.string().min(50, 'Please provide a more detailed company description')
});