import { create } from 'zustand';
import { EVE, EVEAction, EVESchema } from '../types/eve';
import { supabase } from '../lib/supabase';
import { AppError } from '../utils/error-handling';
import { useCompanyStore } from './companyStore';

interface EVEState {
  eves: EVE[];
  actions: EVEAction[];
  loading: boolean;
  error: string | null;
  selectedEVE: EVE | null;
  createEVE: (eve: Omit<EVE, 'id'>) => Promise<EVE>;
  updateEVE: (id: string, updates: Partial<EVE>) => Promise<void>;
  deleteEVE: (id: string) => Promise<void>;
  selectEVE: (eve: EVE | null) => void;
  logAction: (action: Omit<EVEAction, 'id'>) => Promise<void>;
  initializeEVEs: () => Promise<void>;
}

export const useEVEStore = create<EVEState>((set, get) => ({
  eves: [],
  actions: [],
  loading: false,
  error: null,
  selectedEVE: null,

  initializeEVEs: async () => {
    set({ loading: true, error: null });
    try {
      const company = useCompanyStore.getState().company;
      if (!company) {
        set({ eves: [] }); // Reset EVEs if no company
        return;
      }

      const { data: eves, error } = await supabase
        .from('eves')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Validate each EVE
      const validatedEves = eves?.map(eve => EVESchema.parse(eve)) || [];
      set({ eves: validatedEves });
    } catch (error) {
      console.error('Failed to initialize EVEs:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to load EVEs' });
    } finally {
      set({ loading: false });
    }
  },

  createEVE: async (eveData) => {
    set({ loading: true, error: null });
    try {
      const company = useCompanyStore.getState().company;
      if (!company) {
        throw new AppError('Company required to create EVE', 'VALIDATION_ERROR', 400);
      }

      // Generate UUID for new EVE
      const eveId = crypto.randomUUID();

      // Validate EVE data
      const validatedData = EVESchema.parse({
        ...eveData,
        id: eveId
      });

      // Insert into database
      const { data: eve, error } = await supabase
        .from('eves')
        .insert({
          ...validatedData,
          company_id: company.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw new AppError('Failed to create EVE', 'DATABASE_ERROR', 500);
      }

      if (!eve) {
        throw new AppError('Failed to create EVE', 'DATABASE_ERROR', 500);
      }

      // Validate returned EVE
      const validatedEve = EVESchema.parse(eve);
      set(state => ({ eves: [...state.eves, validatedEve] }));
      return validatedEve;
    } catch (error) {
      console.error('Failed to create EVE:', error);
      const message = error instanceof AppError ? error.message : 'Failed to create EVE';
      set({ error: message });
      throw error instanceof AppError ? error : new AppError(message, 'EVE_ERROR', 500);
    } finally {
      set({ loading: false });
    }
  },

  updateEVE: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const { data: eve, error } = await supabase
        .from('eves')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!eve) throw new AppError('EVE not found', 'NOT_FOUND', 404);

      const validatedEve = EVESchema.parse(eve);
      set(state => ({
        eves: state.eves.map(e => e.id === id ? validatedEve : e)
      }));
    } catch (error) {
      console.error('Failed to update EVE:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to update EVE' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteEVE: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('eves')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        eves: state.eves.filter(eve => eve.id !== id),
        selectedEVE: state.selectedEVE?.id === id ? null : state.selectedEVE
      }));
    } catch (error) {
      console.error('Failed to delete EVE:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to delete EVE' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  selectEVE: (eve) => {
    set({ selectedEVE: eve });
  },

  logAction: async (action) => {
    try {
      const { data: loggedAction, error } = await supabase
        .from('eve_actions')
        .insert({
          ...action,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      set(state => ({ actions: [...state.actions, loggedAction] }));
    } catch (error) {
      console.error('Failed to log action:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to log action' });
      throw error;
    }
  },
}));