import { create } from 'zustand';
import type { Database } from '../lib/database/types';
import { supabase } from '../lib/supabase';
import { CompanySchema } from '../types/company';
import { AppError } from '../utils/error-handling';

type Company = Database['public']['Tables']['companies']['Row'];
type CompanyInsert = Database['public']['Tables']['companies']['Insert'];

interface CompanyState {
  company: Company | null;
  loading: boolean;
  error: string | null;
  createCompany: (data: CompanyInsert) => Promise<Company>;
  updateCompany: (id: string, updates: Partial<CompanyInsert>) => Promise<void>;
  fetchCompany: (id: string) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  clearCompany: () => void;
}

export const useCompanyStore = create<CompanyState>((set) => ({
  company: null,
  loading: false,
  error: null,

  createCompany: async (data) => {
    set({ loading: true, error: null });
    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new AppError('Authentication required', 'AUTH_ERROR', 401);
      }

      // Validate company data
      const validatedData = CompanySchema.parse({
        ...data,
        owner_id: user.id
      });

      // Create company
      const { data: company, error } = await supabase
        .from('companies')
        .insert({
          ...validatedData,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select(`
          *,
          eves (
            id,
            name,
            role,
            type,
            status
          ),
          subscriptions (
            id,
            tier,
            status,
            features
          )
        `)
        .single();

      if (error) throw error;
      if (!company) throw new AppError('Failed to create company', 'DATABASE_ERROR', 500);

      set({ company });
      return company;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create company';
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateCompany: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      // Validate updates
      const validatedUpdates = CompanySchema.partial().parse(updates);

      const { data: company, error } = await supabase
        .from('companies')
        .update({
          ...validatedUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          eves (
            id,
            name,
            role,
            type,
            status
          ),
          subscriptions (
            id,
            tier,
            status,
            features
          )
        `)
        .single();

      if (error) throw error;
      if (!company) throw new AppError('Company not found', 'NOT_FOUND', 404);

      set({ company });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update company';
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  fetchCompany: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data: company, error } = await supabase
        .from('companies')
        .select(`
          *,
          eves (
            id,
            name,
            role,
            type,
            status
          ),
          subscriptions (
            id,
            tier,
            status,
            features
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!company) throw new AppError('Company not found', 'NOT_FOUND', 404);

      set({ company });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch company';
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteCompany: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set({ company: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete company';
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  clearCompany: () => {
    set({ company: null, error: null });
  }
}));