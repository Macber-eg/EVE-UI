import { DatabaseService } from '../../core/database/DatabaseService';
import { Logger } from '../../core/logger/Logger';
import { AppError } from '../../core/error/AppError';
import { Integration, IntegrationSchema } from '../types/integration';
import { validateIntegrationConfig } from '../utils/validation';
import { getProviderInstance } from '../providers';

export class IntegrationService {
  private static instance: IntegrationService;
  private db: DatabaseService;
  private logger: Logger;

  private constructor() {
    this.db = DatabaseService.getInstance();
    this.logger = Logger.getInstance();
  }

  public static getInstance(): IntegrationService {
    if (!IntegrationService.instance) {
      IntegrationService.instance = new IntegrationService();
    }
    return IntegrationService.instance;
  }

  async createIntegration(
    companyId: string,
    provider: Integration['provider'],
    config: Record<string, any>
  ): Promise<Integration> {
    try {
      // Validate config for provider
      const validConfig = await validateIntegrationConfig(provider, config);

      // Create integration instance
      const integration: Integration = {
        id: crypto.randomUUID(),
        provider,
        status: 'pending',
        config: validConfig,
        company_id: companyId,
        created_at: new Date(),
        updated_at: new Date()
      };

      // Validate integration data
      const validatedIntegration = IntegrationSchema.parse(integration);

      // Initialize provider
      const providerInstance = await getProviderInstance(provider);
      await providerInstance.initialize(validConfig);

      // Save to database
      const result = await this.db.query('integrations', validatedIntegration);

      return result;
    } catch (error) {
      this.logger.error('Failed to create integration:', error);
      throw AppError.fromError(error);
    }
  }

  async getIntegration(id: string): Promise<Integration> {
    try {
      const integration = await this.db.query('integrations', {
        id,
        single: true
      });

      if (!integration) {
        throw new AppError('Integration not found', 'NOT_FOUND', 404);
      }

      return integration;
    } catch (error) {
      this.logger.error('Failed to get integration:', error);
      throw AppError.fromError(error);
    }
  }

  async updateIntegration(id: string, updates: Partial<Integration>): Promise<Integration> {
    try {
      const integration = await this.getIntegration(id);
      
      // Validate updates
      if (updates.config) {
        await validateIntegrationConfig(integration.provider, updates.config);
      }

      const result = await this.db.query('integrations', {
        ...updates,
        id,
        updated_at: new Date().toISOString()
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to update integration:', error);
      throw AppError.fromError(error);
    }
  }

  async deleteIntegration(id: string): Promise<void> {
    try {
      const integration = await this.getIntegration(id);
      
      // Cleanup provider resources
      const providerInstance = await getProviderInstance(integration.provider);
      await providerInstance.cleanup(integration.config);

      // Delete from database
      await this.db.query('integrations', {
        id,
        method: 'DELETE'
      });
    } catch (error) {
      this.logger.error('Failed to delete integration:', error);
      throw AppError.fromError(error);
    }
  }
}