import { OpenAIService } from '../../core/ai/OpenAIService';
import { Logger } from '../../core/logger/Logger';
import { AppError } from '../../core/error/AppError';
import { Company } from '../types/company';

export class CompanyAnalyzer {
  private static instance: CompanyAnalyzer;
  private openai: OpenAIService;
  private logger: Logger;

  private constructor() {
    this.openai = OpenAIService.getInstance();
    this.logger = Logger.getInstance();
  }

  public static getInstance(): CompanyAnalyzer {
    if (!CompanyAnalyzer.instance) {
      CompanyAnalyzer.instance = new CompanyAnalyzer();
    }
    return CompanyAnalyzer.instance;
  }

  async analyzeCompanyNeeds(description: string): Promise<Partial<Company>> {
    try {
      const analysis = await this.openai.analyze(description, {
        type: 'company_analysis',
        format: 'json'
      });

      return analysis;
    } catch (error) {
      this.logger.error('Company analysis failed:', error);
      throw AppError.fromError(error);
    }
  }

  async suggestOptimizations(company: Company): Promise<any> {
    try {
      const suggestions = await this.openai.analyze(JSON.stringify(company), {
        type: 'optimization_analysis',
        format: 'json'
      });

      return suggestions;
    } catch (error) {
      this.logger.error('Optimization analysis failed:', error);
      throw AppError.fromError(error);
    }
  }
}