import { DatabaseService } from '../../core/database/DatabaseService';
import { Logger } from '../../core/logger/Logger';
import { AppError } from '../../core/error/AppError';
import { validateUUID } from '../../core/validation';
import { EVEMessage, MessageSchema } from '../types/message';

export class EVECommunicationService {
  private static instance: EVECommunicationService;
  private db: DatabaseService;
  private logger: Logger;

  private constructor() {
    this.db = DatabaseService.getInstance();
    this.logger = Logger.getInstance();
  }

  public static getInstance(): EVECommunicationService {
    if (!EVECommunicationService.instance) {
      EVECommunicationService.instance = new EVECommunicationService();
    }
    return EVECommunicationService.instance;
  }

  async sendMessage(message: Omit<EVEMessage, 'id' | 'created_at'>): Promise<EVEMessage> {
    try {
      // Validate EVE IDs
      if (!validateUUID(message.from_eve_id) || !validateUUID(message.to_eve_id)) {
        throw new AppError('Invalid EVE ID format', 'VALIDATION_ERROR', 400);
      }

      // Validate message data
      const validatedMessage = MessageSchema.parse({
        ...message,
        id: crypto.randomUUID(),
        created_at: new Date()
      });

      const result = await this.db.query('eve_messages', {
        ...validatedMessage,
        created_at: validatedMessage.created_at.toISOString()
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to send message:', error);
      throw AppError.fromError(error);
    }
  }

  async getMessages(eveId: string): Promise<EVEMessage[]> {
    try {
      if (!validateUUID(eveId)) {
        throw new AppError('Invalid EVE ID format', 'VALIDATION_ERROR', 400);
      }

      const messages = await this.db.query('eve_messages', {
        or: `to_eve_id.eq.${eveId},from_eve_id.eq.${eveId}`
      });

      return messages.map(msg => ({
        ...msg,
        created_at: new Date(msg.created_at)
      }));
    } catch (error) {
      this.logger.error('Failed to fetch messages:', error);
      throw AppError.fromError(error);
    }
  }
}