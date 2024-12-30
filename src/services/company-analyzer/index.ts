import { OpenAIService } from '../../lib/openai';
import { AppError } from '../../utils/error-handling';
import { Company } from '../../types/company';
import { CompanyAnalysisSchema, CompanyDescriptionSchema } from './validation';
import { ANALYSIS_SYSTEM_PROMPT, createAnalysisPrompt } from './prompts';

export class CompanyAnalyzerService {
  private static instance: CompanyAnalyzerService;
  private openai: OpenAIService;
  private retryAttempts = 3;
  private retryDelay = 1000;

  private constructor() {
    this.openai = OpenAIService.getInstance();
  }

  public static getInstance(): CompanyAnalyzerService {
    if (!CompanyAnalyzerService.instance) {
      CompanyAnalyzerService.instance = new CompanyAnalyzerService();
    }
    return CompanyAnalyzerService.instance;
  }

  private async retry<T>(operation: () => Promise<T>, attempts = this.retryAttempts): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (attempts > 1) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.retry(operation, attempts - 1);
      }
      throw error;
    }
  }

  async analyzeDescription(description: string): Promise<Company> {
    try {
      // Validate input description
      const { description: validatedDescription } = CompanyDescriptionSchema.parse({ description });

      if (!this.openai.isInitialized()) {
        throw new AppError('OpenAI API key not configured', 'CONFIG_ERROR', 500);
      }

      // Get analysis from OpenAI with retries
      const analysis = await this.retry(async () => {
        const response = await this.openai.chat<any>(
          [
            { role: 'system', content: ANALYSIS_SYSTEM_PROMPT },
            { role: 'user', content: createAnalysisPrompt(validatedDescription) }
          ],
          undefined,
          true // Enable JSON mode
        );

        // Log raw response for debugging
        console.debug('Raw OpenAI Response:', response);
        return response;
      });

      // Validate analysis against our schema
      const validatedData = CompanyAnalysisSchema.parse(analysis);

      // Log validated data
      console.debug('Validated Company Data:', validatedData);

      return validatedData;
    } catch (error) {
      console.error('Company analysis error:', error);
      
      if (error instanceof AppError) {
        throw error;
      }

      if (error.name === 'ZodError') {
        const issues = error.issues.map((issue: any) => issue.message).join(', ');
        throw new AppError(
          `Invalid company data: ${issues}`,
          'VALIDATION_ERROR',
          400
        );
      }

      throw new AppError(
        'Failed to analyze company description. Please try again.',
        'ANALYSIS_ERROR',
        500
      );
    }
  }
}

export const companyAnalyzerService = CompanyAnalyzerService.getInstance();