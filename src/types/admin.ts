import { z } from 'zod';

export const AdminRoleSchema = z.enum(['super_admin', 'admin', 'support']);
export type AdminRole = z.infer<typeof AdminRoleSchema>;

export const AdminUserSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  role: AdminRoleSchema,
  permissions: z.array(z.string()),
  status: z.enum(['active', 'inactive', 'suspended']),
  created_at: z.date(),
  updated_at: z.date()
});

export type AdminUser = z.infer<typeof AdminUserSchema>;

export const AdminAuditLogSchema = z.object({
  id: z.string().uuid(),
  admin_id: z.string().uuid(),
  action: z.string(),
  entity_type: z.string(),
  entity_id: z.string().uuid(),
  changes: z.record(z.any()),
  created_at: z.date()
});

export type AdminAuditLog = z.infer<typeof AdminAuditLogSchema>;

export const AdminSettingSchema = z.object({
  id: z.string().uuid(),
  key: z.string(),
  value: z.any(),
  description: z.string().optional(),
  created_at: z.date(),
  updated_at: z.date()
});

export type AdminSetting = z.infer<typeof AdminSettingSchema>;