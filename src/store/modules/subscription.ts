import { create } from 'zustand';
import { supabase } from '../../config/supabase';
import { Subscription } from '../../types/subscription';
import { AppError } from '../../utils/error-handling';

interface SubscriptionState {
  subscription: Subscription | null;
  loading: boolean;
  error: string | null;
  createSubscription: (companyId: string, tier: string, paymentMethod: any) => Promise<void>;
  cancelSubscription: (companyId: string) => Promise<void>;
  fetchSubscription: (companyId: string) => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  subscription: null,
  loading: false,
  error: null,

  createSubscription: async (companyId, tier, paymentMethod) => {
    set({ loading: true, error: null });
    try {
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .insert({
          company_id: companyId,
          tier,
          stripe_customer_id: paymentMethod.customer,
          stripe_subscription_id: paymentMethod.subscription,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          features: getFeaturesByTier(tier)
        })
        .select()
        .single();

      if (error) throw error;
      set({ subscription });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create subscription';
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  cancelSubscription: async (companyId) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          cancel_at_period_end: true,
          updated_at: new Date().toISOString()
        })
        .eq('company_id', companyId);

      if (error) throw error;
      set(state => ({
        subscription: state.subscription
          ? { ...state.subscription, status: 'canceled', cancel_at_period_end: true }
          : null
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to cancel subscription';
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  fetchSubscription: async (companyId) => {
    set({ loading: true, error: null });
    try {
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('company_id', companyId)
        .single();

      if (error) throw error;
      set({ subscription });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch subscription';
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));

function getFeaturesByTier(tier: string) {
  const features = {
    starter: {
      max_eves: 3,
      max_users: 5,
      max_storage_gb: 10,
      features: ['Basic Analytics', 'Email Support', 'Core EVE™ Features']
    },
    growth: {
      max_eves: 10,
      max_users: 20,
      max_storage_gb: 50,
      features: ['Advanced Analytics', 'Priority Support', 'Custom EVE™ Training']
    },
    enterprise: {
      max_eves: -1, // Unlimited
      max_users: -1, // Unlimited
      max_storage_gb: 500,
      features: ['Enterprise Analytics', '24/7 Support', 'Custom Development']
    }
  };
  return features[tier as keyof typeof features] || features.starter;
}