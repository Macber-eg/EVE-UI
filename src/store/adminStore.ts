import { create } from 'zustand';
import { AdminUser, AdminAuditLog, AdminSetting } from '../types/admin';
import { supabase } from '../lib/supabase';
import { AppError } from '../utils/error-handling';

interface AdminState {
  isAdmin: boolean;
  adminUser: AdminUser | null;
  auditLogs: AdminAuditLog[];
  settings: AdminSetting[];
  loading: boolean;
  error: string | null;
  checkAdminStatus: () => Promise<void>;
  fetchAuditLogs: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  updateSetting: (key: string, value: any) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  isAdmin: false,
  adminUser: null,
  auditLogs: [],
  settings: [],
  loading: false,
  error: null,

  checkAdminStatus: async () => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (error) throw error;

      set({ 
        isAdmin: !!adminUser,
        adminUser: adminUser ? {
          ...adminUser,
          created_at: new Date(adminUser.created_at),
          updated_at: new Date(adminUser.updated_at)
        } : null
      });
    } catch (error) {
      console.error('Admin status check failed:', error);
      set({ error: 'Failed to verify admin status' });
    } finally {
      set({ loading: false });
    }
  },

  fetchAuditLogs: async () => {
    set({ loading: true, error: null });
    try {
      const { data: logs, error } = await supabase
        .from('admin_audit_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ 
        auditLogs: logs.map(log => ({
          ...log,
          created_at: new Date(log.created_at)
        }))
      });
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      set({ error: 'Failed to load audit logs' });
    } finally {
      set({ loading: false });
    }
  },

  fetchSettings: async () => {
    set({ loading: true, error: null });
    try {
      const { data: settings, error } = await supabase
        .from('admin_settings')
        .select('*')
        .order('key');

      if (error) throw error;

      set({ 
        settings: settings.map(setting => ({
          ...setting,
          created_at: new Date(setting.created_at),
          updated_at: new Date(setting.updated_at)
        }))
      });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      set({ error: 'Failed to load settings' });
    } finally {
      set({ loading: false });
    }
  },

  updateSetting: async (key: string, value: any) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('admin_settings')
        .update({ value })
        .eq('key', key);

      if (error) throw error;

      // Refresh settings
      await get().fetchSettings();
    } catch (error) {
      console.error('Failed to update setting:', error);
      throw new AppError('Failed to update setting', 'ADMIN_ERROR', 500);
    } finally {
      set({ loading: false });
    }
  }
}));