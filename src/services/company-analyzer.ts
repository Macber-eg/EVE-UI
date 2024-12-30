import { OpenAIService } from '../lib/openai';
import { AppError } from '../utils/error-handling';
import { Company, CompanySchema } from '../types/company';
import { supabase } from '../lib/supabase';
import { z } from 'zod';

// Schema for OpenAI response validation
const CompanyAnalysisSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  type: z.enum(['corporation', 'llc', 'nonprofit']),
  jurisdiction: z.string().min(1, 'Jurisdiction is required'),
  contact: z.object({
    email: z.string().email('Invalid email'),
    phone: z.string().optional()
  }).optional(),
  settings: z.object({
    industry: z.string().min(1, 'Industry is required'),
    autonomy_level: z.enum(['low', 'medium', 'high', 'full']).default('medium'),
    human_oversight_required: z.array(z.string()).min(1),
    notification_preferences: z.object({
      email: z.boolean().default(true),
      push: z.boolean().default(true),
      urgency_threshold: z.enum(['low', 'medium', 'high', 'critical']).default('medium')
    }).default({
      email: true,
      push: true,
      urgency_threshold: 'medium'
    })
  })
});

export class CompanyAnalyzerService {
  private static instance: CompanyAnalyzerService;
  private openai: OpenAIService;

  private constructor() {
    this.openai = OpenAIService.getInstance();
  }

  public static getInstance(): CompanyAnalyzerService {
    if (!CompanyAnalyzerService.instance) {
      CompanyAnalyzerService.instance = new CompanyAnalyzerService();
    }
    return CompanyAnalyzerService.instance;
  }

  async analyzeDescription(description: string): Promise<Company> {
    try {
      if (!this.openai.isInitialized()) {
        throw new Error('OpenAI API key not configured');
      }

      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new AppError('Authentication required', 'AUTH_ERROR', 401);
      }

      console.debug('Analyzing company description for user:', user.email);

      const systemPrompt = `You are a business analyst AI specializing in company analysis. 
        Analyze company descriptions and extract structured information.
        Provide responses in valid JSON format matching the specified schema.
        Do not include any explanatory text, only return the JSON object.`;

      const userPrompt = `
        Analyze this company description and extract key information:
        "${description}"

        Return a JSON object with exactly this structure:
        {
          "name": "Company name (required)",
          "type": "corporation" | "llc" | "nonprofit",
          "jurisdiction": "Primary jurisdiction (required)",
          "contact": {
            "email": "${user.email}",
            "phone": "Contact phone (optional)"
          },
          "settings": {
            "industry": "Primary industry (required)",
            "autonomy_level": "low" | "medium" | "high" | "full",
            "human_oversight_required": ["Array of areas requiring human oversight"],
            "notification_preferences": {
              "email": true,
              "push": true,
              "urgency_threshold": "low" | "medium" | "high" | "critical"
            }
          }
        }`;

      // Get JSON response from OpenAI
      const response = await this.openai.chat<any>(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        undefined,
        true // Enable JSON mode
      );

      console.debug('Raw OpenAI Response:', response);

      // Validate OpenAI response
      const validatedAnalysis = CompanyAnalysisSchema.parse(response);
      console.debug('Validated Analysis:', validatedAnalysis);

      // Ensure contact email is set to user's email
      const companyData = {
        ...validatedAnalysis,
        contact: {
          ...validatedAnalysis.contact,
          email: user.email || ''
        }
      };

      // Validate final company data
      const validatedCompany = CompanySchema.parse(companyData);
      console.debug('Final Validated Company Data:', validatedCompany);

      // Insert into database
      const { data: company, error: insertError } = await supabase
        .from('companies')
        .insert({
          ...validatedCompany,
          owner_id: user.id,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('*')
        .single();

      if (insertError) {
        console.error('Database insertion error:', insertError);
        throw new AppError(
          'Failed to create company in database',
          'DATABASE_ERROR',
          500
        );
      }

      if (!company) {
        throw new AppError('Company creation failed', 'DATABASE_ERROR', 500);
      }

      console.debug('Company created successfully:', company);
      return company;
    } catch (error) {
      console.error('Company analysis error:', error);
      
      if (error instanceof z.ZodError) {
        const issues = error.issues.map(issue => issue.message).join(', ');
        throw new AppError(
          `Invalid company data: ${issues}`,
          'VALIDATION_ERROR',
          400
        );
      }

      if (error instanceof AppError) {
        throw error;
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