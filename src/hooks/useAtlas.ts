import { useState, useCallback } from 'react';
import { atlasService } from '../services/atlas/AtlasService';
import { useCompanyStore } from '../store/companyStore';

export function useAtlas() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { company } = useCompanyStore();

  const chat = useCallback(async (
    message: string,
    onProgress?: (chunk: string) => void
  ) => {
    if (!company) {
      throw new Error('No company context available');
    }

    setLoading(true);
    setError(null);

    try {
      return await atlasService.chat(message, company.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to communicate with Atlas';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [company]);

  return {
    chat,
    loading,
    error
  };
}