import { EVE } from '../../types/eve';
import { OpenAIService } from '../../lib/openai';
import { KnowledgeBase } from '../../lib/knowledge-base';

export class EVELearningSystem {
  private static instance: EVELearningSystem;
  private openai: OpenAIService;
  private knowledgeBase: KnowledgeBase;

  private constructor() {
    this.openai = OpenAIService.getInstance();
    this.knowledgeBase = KnowledgeBase.getInstance();
  }

  public static getInstance(): EVELearningSystem {
    if (!EVELearningSystem.instance) {
      EVELearningSystem.instance = new EVELearningSystem();
    }
    return EVELearningSystem.instance;
  }

  async learnFromInteraction(
    eve: EVE,
    interaction: {
      type: 'task' | 'communication' | 'decision';
      content: string;
      result: any;
      success: boolean;
    }
  ): Promise<void> {
    try {
      // Extract learnings from interaction
      const learnings = await this.analyzeLearningOpportunity(interaction);

      // Store in knowledge base
      await this.knowledgeBase.addDocument(
        JSON.stringify({
          eve_id: eve.id,
          interaction_type: interaction.type,
          content: interaction.content,
          learnings,
          timestamp: new Date().toISOString()
        }),
        {
          type: 'eve_learning',
          eve_id: eve.id,
          success: interaction.success
        }
      );

      // Update EVE's capabilities if needed
      if (learnings.new_capabilities?.length) {
        eve.capabilities = [...new Set([...eve.capabilities, ...learnings.new_capabilities])];
      }
    } catch (error) {
      console.error('Learning system error:', error);
    }
  }

  private async analyzeLearningOpportunity(interaction: any) {
    const analysis = await this.openai.chat([
      {
        role: 'system',
        content: 'Analyze this interaction for learning opportunities and potential capability improvements.'
      },
      {
        role: 'user',
        content: JSON.stringify(interaction)
      }
    ]);

    return JSON.parse(analysis);
  }

  async getPerformanceInsights(eve: EVE): Promise<{
    strengths: string[];
    areas_for_improvement: string[];
    recommended_actions: string[];
  }> {
    const recentLearnings = await this.knowledgeBase.search('', {
      filters: {
        type: 'eve_learning',
        eve_id: eve.id
      },
      limit: 100
    });

    const analysis = await this.openai.chat([
      {
        role: 'system',
        content: 'Analyze EVE performance data and provide actionable insights.'
      },
      {
        role: 'user',
        content: JSON.stringify({
          eve: {
            name: eve.name,
            role: eve.role,
            capabilities: eve.capabilities,
            performance: eve.performance
          },
          learnings: recentLearnings
        })
      }
    ], undefined, true);

    return analysis;
  }
}