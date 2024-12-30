import { z } from 'zod';
import { Integration } from '../types/integration';
import { AppError } from '../../core/error/AppError';
import { getProviderInstance } from '../providers';

export async function validateIntegrationConfig(
  provider: Integration['provider'],
  config: Record<string, any>
): Promise<Record<string, any>> {
  try {
    const providerInstance = await getProviderInstance(provider);
    const isValid = await providerInstance.validate(config);

    if (!isValid) {
      throw new AppError(
        `Invalid configuration for ${provider} integration`,
        'VALIDATION_ERROR',
        400
      );
    }

    return config;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue => issue.message).join(', ');
      throw new AppError(
        `Invalid integration configuration: ${issues}`,
        'VALIDATION_ERROR',
        400
      );
    }
    throw error;
  }
}