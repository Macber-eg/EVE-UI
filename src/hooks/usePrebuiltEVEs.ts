import { useState, useCallback } from 'react';
import { PrebuiltEVE } from '../types/prebuilt-eves';
import { prebuiltEVEService } from '../services/prebuilt-eves';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useEVEStore } from '../store/eveStore';

export function usePrebuiltEVEs() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { subscription } = useSubscriptionStore();
  const { createEVE } = useEVEStore();

  const getAvailableEVEs = useCallback((): PrebuiltEVE[] => {
    if (!subscription) {
      return [];
    }
    return prebuiltEVEService.getAvailableEVEs(subscription);
  }, [subscription]);

  const instantiateEVE = useCallback(async (
    prebuiltId: string,
    integrationConfigs: Record<string, any>
  ) => {
    setLoading(true);
    setError(null);

    try {
      if (!subscription) {
        throw new Error('Active subscription required');
      }

      // Validate integration configs
      const isValid = prebuiltEVEService.validateIntegrationConfig(
        prebuiltId,
        integrationConfigs
      );

      if (!isValid) {
        throw new Error('Invalid integration configuration');
      }

      // Create EVE instance
      const eve = await prebuiltEVEService.instantiateEVE(
        prebuiltId,
        subscription.company_id,
        integrationConfigs
      );

      // Add to EVE store
      await createEVE(eve);

      return eve;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create EVE';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [subscription, createEVE]);

  return {
    getAvailableEVEs,
    instantiateEVE,
    loading,
    error
  };
}