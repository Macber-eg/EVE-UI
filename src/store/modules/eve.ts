import { create } from 'zustand';
import { supabase } from '../../config/supabase';
import { EVE, EVEAction } from '../../types/eve';
import { AppError } from '../../utils/error-handling';

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
  fetchEVEs: (companyId: string) => Promise<void>;
}

export const useEVEStore = create<EVEState>((set, get) => ({
  eves: [],
  actions: [],
  loading: false,
  error: null,
  selectedEVE: null,

  createEVE: async (eveData) => {
    set({ loading: true, error: null });
    try {
      const { data: eve, error } = await supabase
        .from('eves')
        .insert({
          ...eveData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      if (!eve) throw new Error('Failed to create EVE');

      set(state => ({ eves: [...state.eves, eve] }));
      return eve;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create EVE';
      set({ error: message });
      throw error;
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
      set(state => ({
        eves: state.eves.map(e => e.id === id ? eve : e)
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update EVE';
      set({ error: message });
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
      const message = error instanceof Error ? error.message : 'Failed to delete EVE';
      set({ error: message });
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
      const message = error instanceof Error ? error.message : 'Failed to log action';
      set({ error: message });
      throw error;
    }
  },

  fetchEVEs: async (companyId) => {
    set({ loading: true, error: null });
    try {
      const { data: eves, error } = await supabase
        .from('eves')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      set({ eves: eves || [] });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch EVEs';
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));