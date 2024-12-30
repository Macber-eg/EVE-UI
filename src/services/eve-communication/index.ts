import { EVEMessage, EVEMessageSchema } from '../../types/eve';
import { supabase } from '../../lib/supabase';
import { AppError } from '../../utils/error-handling';

class EVECommunicationService {
  private static instance: EVECommunicationService;
  private messageHandlers: Map<string, Set<(message: EVEMessage) => void>> = new Map();

  private constructor() {}

  public static getInstance(): EVECommunicationService {
    if (!EVECommunicationService.instance) {
      EVECommunicationService.instance = new EVECommunicationService();
    }
    return EVECommunicationService.instance;
  }

  async sendMessage(message: Omit<EVEMessage, 'id' | 'created_at'>): Promise<EVEMessage> {
    try {
      // Validate message data
      const validatedMessage = EVEMessageSchema.parse(message);

      const { data, error } = await supabase
        .from('eve_messages')
        .insert({
          ...validatedMessage,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw new AppError('Failed to send message', 'DATABASE_ERROR', 500);
      }

      return data;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error instanceof AppError ? error : new AppError('Failed to send message', 'COMMUNICATION_ERROR', 500);
    }
  }

  async getMessages(eveId: string, options?: {
    limit?: number;
    offset?: number;
    status?: EVEMessage['status'];
  }): Promise<EVEMessage[]> {
    try {
      let query = supabase
        .from('eve_messages')
        .select()
        .or(`to_eve_id.eq.${eveId},from_eve_id.eq.${eveId}`)
        .order('created_at', { ascending: false });

      if (options?.status) {
        query = query.eq('status', options.status);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(
          options.offset,
          options.offset + (options.limit || 10) - 1
        );
      }

      const { data, error } = await query;

      if (error) {
        console.error('Database error:', error);
        throw new AppError('Failed to fetch messages', 'DATABASE_ERROR', 500);
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      throw error instanceof AppError ? error : new AppError('Failed to fetch messages', 'COMMUNICATION_ERROR', 500);
    }
  }

  subscribeToMessages(eveId: string, handler: (message: EVEMessage) => void): () => void {
    try {
      if (!this.messageHandlers.has(eveId)) {
        this.messageHandlers.set(eveId, new Set());
      }
      
      this.messageHandlers.get(eveId)!.add(handler);

      // Set up realtime subscription
      const channel = supabase
        .channel(`eve_messages:${eveId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'eve_messages',
            filter: `to_eve_id=eq.${eveId}`
          },
          (payload) => {
            const handlers = this.messageHandlers.get(eveId);
            if (handlers) {
              handlers.forEach(h => h(payload.new as EVEMessage));
            }
          }
        )
        .subscribe();

      // Return cleanup function
      return () => {
        const handlers = this.messageHandlers.get(eveId);
        if (handlers) {
          handlers.delete(handler);
          if (handlers.size === 0) {
            channel.unsubscribe();
            this.messageHandlers.delete(eveId);
          }
        }
      };
    } catch (error) {
      console.error('Failed to subscribe to messages:', error);
      throw error instanceof AppError ? error : new AppError('Failed to subscribe to messages', 'COMMUNICATION_ERROR', 500);
    }
  }
}

export const eveCommunicationService = EVECommunicationService.getInstance();