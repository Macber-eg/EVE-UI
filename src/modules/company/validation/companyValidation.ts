import { z } from 'zod';
import { Company, CompanySchema } from '../types/company';
import { AppError } from '../../core/error/AppError';

export async function validateCompanyData(data: Partial<Company>): Promise<Company> {
  try {
    return CompanySchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue => issue.message).join(', ');
      throw new AppError(`Invalid company data: ${issues}`, 'VALIDATION_ERROR', 400);
    }
    throw error;
  }
}

export function validateIndustry(industry: string): boolean {
  return industry.length >= 2 && industry.length <= 100;
}

export function validateJurisdiction(jurisdiction: string): boolean {
  return jurisdiction.length >= 2 && jurisdiction.length <= 100;
}