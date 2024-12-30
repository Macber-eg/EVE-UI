import { OpenAIService } from '../../lib/openai';
import { EVE } from '../../types/eve';
import { Company } from '../../types/company';
import { supabase } from '../../lib/supabase';
import { AppError } from '../../utils/error-handling';

export class AtlasService {
  private static instance: AtlasService;
  private openai: OpenAIService;

  private constructor() {
    this.openai = OpenAIService.getInstance();
  }

  public static getInstance(): AtlasService {
    if (!AtlasService.instance) {
      AtlasService.instance = new AtlasService();
    }
    return AtlasService.instance;
  }

  async createAtlas(company: Company): Promise<EVE> {
    try {
      const { data: atlas, error } = await supabase
        .from('eves')
        .insert({
          company_id: company.id,
          name: 'Atlas',
          role: 'Chief EVE™ Orchestrator',
          type: 'orchestrator',
          status: 'active',
          capabilities: [
            'EVE™ Creation',
            'Resource Optimization',
            'Strategic Planning',
            'Task Orchestration',
            'Performance Monitoring'
          ],
          models: [
            {
              provider: 'openai',
              model: 'gpt-4-turbo-preview',
              purpose: 'Strategic Decision Making'
            },
            {
              provider: 'anthropic',
              model: 'claude-3-opus',
              purpose: 'Complex Analysis'
            }
          ]
        })
        .select()
        .single();

      if (error) throw error;
      return atlas;
    } catch (error) {
      console.error('Failed to create Atlas:', error);
      throw new AppError('Failed to create Atlas EVE™', 'EVE_ERROR', 500);
    }
  }

  async chat(message: string, companyId: string): Promise<string> {
    try {
      if (!this.openai.isInitialized()) {
        throw new Error('OpenAI API key not configured');
      }

      // Get company context
      const { data: company } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      // Get active EVEs
      const { data: eves } = await supabase
        .from('eves')
        .select('*')
        .eq('company_id', companyId);

      const systemPrompt = `You are Atlas, the Chief EVE™ Orchestrator for ${company?.name || 'this company'}.
        Your role is to coordinate all EVE™ operations and assist with company management.
        
        Company Context:
        ${JSON.stringify(company, null, 2)}
        
        Active EVEs:
        ${JSON.stringify(eves, null, 2)}
        
        Respond in a professional, helpful manner. Focus on actionable insights and clear direction.`;

      const response = await this.openai.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ]);

      return response;
    } catch (error) {
      console.error('Atlas chat error:', error);
      throw new AppError('Failed to process message', 'CHAT_ERROR', 500);
    }
  }
}

export const atlasService = AtlasService.getInstance();