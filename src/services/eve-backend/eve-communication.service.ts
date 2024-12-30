import { EVEMessage } from '../../types/eve';
import { supabase } from '../../lib/supabase';
import { AppError } from '../../utils/error-handling';

export class EVEBackendCommunicationService {
  private static instance: EVEBackendCommunicationService;

  private constructor() {}

  public static getInstance(): EVEBackendCommunicationService {
    if (!EVEBackendCommunicationService.instance) {
      EVEBackendCommunicationService.instance = new EVEBackendCommunicationService();
    }
    return EVEBackendCommunicationService.instance;
  }

  async sendMessage(message: Omit<EVEMessage, 'id' | 'created_at'>): Promise<EVEMessage> {
    try {
      const { data, error } = await supabase
        .from('eve_messages')
        .insert({
          ...message,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(
        'Failed to send message',
        'COMMUNICATION_ERROR',
        500
      );
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

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new AppError(
        'Failed to fetch messages',
        'COMMUNICATION_ERROR',
        500
      );
    }
  }

  async updateMessageStatus(
    messageId: string,
    status: EVEMessage['status'],
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      const updates: Partial<EVEMessage> = { status };

      if (status === 'delivered') {
        updates.delivered_at = new Date().toISOString();
      } else if (status === 'read') {
        updates.read_at = new Date().toISOString();
      } else if (status === 'processed') {
        updates.processed_at = new Date().toISOString();
      }

      if (metadata) {
        updates.metadata = metadata;
      }

      const { error } = await supabase
        .from('eve_messages')
        .update(updates)
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      throw new AppError(
        'Failed to update message status',
        'COMMUNICATION_ERROR',
        500
      );
    }
  }

  async deleteMessage(messageId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('eve_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      throw new AppError(
        'Failed to delete message',
        'COMMUNICATION_ERROR',
        500
      );
    }
  }
}

export const eveBackendCommunicationService = EVEBackendCommunicationService.getInstance();