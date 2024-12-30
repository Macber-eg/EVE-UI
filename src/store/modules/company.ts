import { create } from 'zustand';
import { supabase } from '../../config/supabase';
import { Company } from '../../types/company';
import { AppError } from '../../utils/error-handling';
import { Logger } from '../../utils/logger';

const logger = new Logger('CompanyStore');

interface CompanyState {
  company: Company | null;
  loading: boolean;
  error: string | null;
  createCompany: (data: Omit<Company, 'id' | 'owner_id' | 'created_at' | 'updated_at'>) => Promise<Company>;
  updateCompany: (id: string, updates: Partial<Company>) => Promise<void>;
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

      logger.debug('Creating company for user:', user.id);

      // Create company
      const { data: company, error } = await supabase
        .from('companies')
        .insert({
          ...data,
          owner_id: user.id,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        logger.error('Failed to create company:', error);
        throw error;
      }

      if (!company) {
        throw new AppError('Failed to create company', 'DATABASE_ERROR', 500);
      }

      logger.info('Company created successfully:', company.id);
      set({ company });
      return company;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create company';
      logger.error('Company creation error:', error);
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateCompany: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      // Validate company exists and user has access
      const { data: existing, error: fetchError } = await supabase
        .from('companies')
        .select()
        .eq('id', id)
        .single();

      if (fetchError || !existing) {
        throw new AppError('Company not found', 'NOT_FOUND', 404);
      }

      // Update company
      const { data: company, error } = await supabase
        .from('companies')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update company:', error);
        throw error;
      }

      logger.info('Company updated successfully:', id);
      set({ company });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update company';
      logger.error('Company update error:', error);
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

      if (error) {
        logger.error('Failed to fetch company:', error);
        throw error;
      }

      logger.debug('Company fetched successfully:', id);
      set({ company });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch company';
      logger.error('Company fetch error:', error);
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

      if (error) {
        logger.error('Failed to delete company:', error);
        throw error;
      }

      logger.info('Company deleted successfully:', id);
      set({ company: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete company';
      logger.error('Company deletion error:', error);
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