import { PrebuiltEVE, PrebuiltEVESchema } from '../types/prebuilt-eves';
import { PREBUILT_EVES } from '../config/prebuilt-eves';
import { EVE } from '../types/eve';
import { Subscription } from '../types/subscription';

export class PrebuiltEVEService {
  private static instance: PrebuiltEVEService;

  private constructor() {}

  public static getInstance(): PrebuiltEVEService {
    if (!PrebuiltEVEService.instance) {
      PrebuiltEVEService.instance = new PrebuiltEVEService();
    }
    return PrebuiltEVEService.instance;
  }

  public getAvailableEVEs(subscription: Subscription): PrebuiltEVE[] {
    const tierLevels = {
      starter: 0,
      growth: 1,
      enterprise: 2
    };

    const subscriptionLevel = tierLevels[subscription.tier];
    return PREBUILT_EVES.filter(eve => 
      tierLevels[eve.min_subscription_tier] <= subscriptionLevel
    );
  }

  public async instantiateEVE(
    prebuiltId: string,
    companyId: string,
    integrationConfigs: Record<string, any>
  ): Promise<EVE> {
    const prebuilt = PREBUILT_EVES.find(eve => eve.id === prebuiltId);
    if (!prebuilt) {
      throw new Error(`Prebuilt EVE with id ${prebuiltId} not found`);
    }

    // Validate the prebuilt EVE
    PrebuiltEVESchema.parse(prebuilt);

    // Validate required integrations
    const missingIntegrations = prebuilt.required_integrations
      .filter(integration => integration.required && !integrationConfigs[integration.type])
      .map(integration => integration.name);

    if (missingIntegrations.length > 0) {
      throw new Error(`Missing required integrations: ${missingIntegrations.join(', ')}`);
    }

    // Create EVE instance
    const eve: EVE = {
      id: crypto.randomUUID(),
      name: prebuilt.name,
      role: prebuilt.role,
      status: 'idle',
      type: this.mapCategoryToType(prebuilt.category),
      capabilities: prebuilt.capabilities,
      performance: {
        efficiency: 0,
        accuracy: 0,
        tasks_completed: 0
      },
      models: prebuilt.models
    };

    // In a real implementation, we would:
    // 1. Create the EVE in the database
    // 2. Set up integrations
    // 3. Initialize AI models
    // 4. Set up monitoring

    return eve;
  }

  private mapCategoryToType(category: PrebuiltEVE['category']): EVE['type'] {
    const categoryToType: Record<PrebuiltEVE['category'], EVE['type']> = {
      communication: 'specialist',
      strategy: 'orchestrator',
      social: 'specialist',
      finance: 'specialist',
      operations: 'support',
      security: 'support'
    };
    return categoryToType[category];
  }

  public validateIntegrationConfig(
    prebuiltId: string,
    config: Record<string, any>
  ): boolean {
    const prebuilt = PREBUILT_EVES.find(eve => eve.id === prebuiltId);
    if (!prebuilt) {
      throw new Error(`Prebuilt EVE with id ${prebuiltId} not found`);
    }

    // Validate each required integration
    for (const integration of prebuilt.required_integrations) {
      if (integration.required) {
        const providedConfig = config[integration.type];
        if (!providedConfig) {
          return false;
        }

        // Validate config schema
        for (const [key, type] of Object.entries(integration.config_schema)) {
          if (!providedConfig[key] || typeof providedConfig[key] !== type) {
            return false;
          }
        }
      }
    }

    return true;
  }
}

export const prebuiltEVEService = PrebuiltEVEService.getInstance();