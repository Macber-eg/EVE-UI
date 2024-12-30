import { AppError } from '../../core/error/AppError';
import { Logger } from '../../core/logger/Logger';

export abstract class BaseProvider {
  protected logger: Logger;

  constructor() {
    this.logger = Logger.getInstance();
  }

  abstract initialize(config: Record<string, any>): Promise<void>;
  abstract validate(config: Record<string, any>): Promise<boolean>;
  abstract cleanup(config: Record<string, any>): Promise<void>;
  
  protected handleError(error: unknown, context: string): never {
    this.logger.error(`${context}:`, error);
    throw AppError.fromError(error);
  }
}