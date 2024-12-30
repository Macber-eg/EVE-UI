import { useState, useEffect } from 'react';
import { EVEMessage } from '../types/eve';
import { eveCommunicationService } from '../services/eve-communication';
import { AppError } from '../utils/error-handling';
import { validateEVEId } from '../utils/validation/eve';

export function useEVECommunication(eveId: string) {
  const [messages, setMessages] = useState<EVEMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate EVE ID
  useEffect(() => {
    if (!validateEVEId(eveId)) {
      setError('Invalid EVE ID format');
      return;
    }
  }, [eveId]);

  // Load initial messages
  useEffect(() => {
    if (!eveId || error) return;

    const loadMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const initialMessages = await eveCommunicationService.getMessages(eveId, {
          limit: 50
        });
        setMessages(initialMessages);
      } catch (err) {
        const message = err instanceof AppError ? err.message : 'Failed to load messages';
        setError(message);
        console.error('Failed to load messages:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [eveId, error]);

  // Subscribe to new messages
  useEffect(() => {
    if (!eveId || error) return;

    try {
      const unsubscribe = eveCommunicationService.subscribeToMessages(eveId, (message) => {
        setMessages(prev => [message, ...prev]);
      });

      return () => {
        unsubscribe();
      };
    } catch (err) {
      const message = err instanceof AppError ? err.message : 'Failed to subscribe to messages';
      setError(message);
      console.error('Failed to subscribe to messages:', err);
    }
  }, [eveId, error]);

  const sendMessage = async (
    toEveId: string,
    content: string,
    options?: {
      type?: EVEMessage['type'];
      priority?: EVEMessage['priority'];
      metadata?: Record<string, any>;
    }
  ) => {
    setError(null);
    try {
      if (!validateEVEId(toEveId)) {
        throw new AppError('Invalid recipient EVE ID', 'VALIDATION_ERROR', 400);
      }

      const message = await eveCommunicationService.sendMessage({
        from_eve_id: eveId,
        to_eve_id: toEveId,
        content,
        type: options?.type || 'direct',
        priority: options?.priority || 'medium',
        status: 'sent',
        metadata: options?.metadata
      });

      setMessages(prev => [message, ...prev]);
      return message;
    } catch (err) {
      const message = err instanceof AppError ? err.message : 'Failed to send message';
      setError(message);
      console.error('Failed to send message:', err);
      throw err;
    }
  };

  return {
    messages,
    sendMessage,
    loading,
    error
  };
}