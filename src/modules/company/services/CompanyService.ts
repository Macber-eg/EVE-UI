import { DatabaseService } from '../../core/database/DatabaseService';
import { Logger } from '../../core/logger/Logger';
import { AppError } from '../../core/error/AppError';
import { Company, CompanySchema } from '../types/company';
import { validateCompanyData } from '../validation/companyValidation';

export class CompanyService {
  private static instance: CompanyService;
  private db: DatabaseService;
  private logger: Logger;

  private constructor() {
    this.db = DatabaseService.getInstance();
    this.logger = Logger.getInstance();
  }

  public static getInstance(): CompanyService {
    if (!CompanyService.instance) {
      CompanyService.instance = new CompanyService();
    }
    return CompanyService.instance;
  }

  async createCompany(data: Omit<Company, 'id' | 'owner_id'>): Promise<Company> {
    try {
      // Get current user
      const { data: { user }, error: authError } = await this.db.getUser();
      if (authError || !user) {
        throw new AppError('Authentication required', 'AUTH_ERROR', 401);
      }

      // Validate company data
      const validatedData = await validateCompanyData({
        ...data,
        owner_id: user.id
      });

      // Create company
      const result = await this.db.query('companies', {
        ...validatedData,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to create company:', error);
      throw AppError.fromError(error);
    }
  }

  async getCompany(id: string): Promise<Company> {
    try {
      const company = await this.db.query('companies', {
        id,
        single: true
      });

      if (!company) {
        throw new AppError('Company not found', 'NOT_FOUND', 404);
      }

      return company;
    } catch (error) {
      this.logger.error('Failed to get company:', error);
      throw AppError.fromError(error);
    }
  }

  async updateCompany(id: string, updates: Partial<Company>): Promise<Company> {
    try {
      // Validate updates
      const validatedUpdates = CompanySchema.partial().parse(updates);

      const result = await this.db.query('companies', {
        ...validatedUpdates,
        id,
        updated_at: new Date().toISOString()
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to update company:', error);
      throw AppError.fromError(error);
    }
  }
}