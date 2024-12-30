import { DatabaseService } from '../../core/database/DatabaseService';
import { Logger } from '../../core/logger/Logger';
import { AppError } from '../../core/error/AppError';
import { EVE, EVESchema } from '../types/eve';

export class EVEFactory {
  private static instance: EVEFactory;
  private db: DatabaseService;
  private logger: Logger;

  private constructor() {
    this.db = DatabaseService.getInstance();
    this.logger = Logger.getInstance();
  }

  public static getInstance(): EVEFactory {
    if (!EVEFactory.instance) {
      EVEFactory.instance = new EVEFactory();
    }
    return EVEFactory.instance;
  }

  async createEVE(companyId: string, config: Omit<EVE, 'id' | 'status' | 'performance'>): Promise<EVE> {
    try {
      const eveData: EVE = {
        id: crypto.randomUUID(),
        ...config,
        status: 'idle',
        performance: {
          efficiency: 0,
          accuracy: 0,
          tasks_completed: 0
        }
      };

      // Validate EVE data
      const validatedEVE = EVESchema.parse(eveData);

      const result = await this.db.query('eves', {
        ...validatedEVE,
        company_id: companyId,
        created_at: new Date().toISOString()
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to create EVE:', error);
      throw AppError.fromError(error);
    }
  }
}