import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EVELearningSystem } from '../EVELearningSystem';
import { OpenAIService } from '../../../lib/openai';
import { KnowledgeBase } from '../../../lib/knowledge-base';

vi.mock('../../../lib/openai');
vi.mock('../../../lib/knowledge-base');

describe('EVELearningSystem', () => {
  let learningSystem: EVELearningSystem;
  let mockEVE: any;

  beforeEach(() => {
    vi.clearAllMocks();
    learningSystem = EVELearningSystem.getInstance();
    mockEVE = {
      id: 'test-eve',
      name: 'Test EVE',
      capabilities: ['test'],
      performance: {
        efficiency: 0.8,
        accuracy: 0.9,
        tasks_completed: 100
      }
    };
  });

  it('learns from successful interactions', async () => {
    const interaction = {
      type: 'task' as const,
      content: 'Test task',
      result: { success: true },
      success: true
    };

    await learningSystem.learnFromInteraction(mockEVE, interaction);
    expect(KnowledgeBase.prototype.addDocument).toHaveBeenCalled();
  });

  it('analyzes learning opportunities', async () => {
    const interaction = {
      type: 'task' as const,
      content: 'Test task',
      result: { success: true },
      success: true
    };

    await learningSystem.learnFromInteraction(mockEVE, interaction);
    expect(OpenAIService.prototype.chat).toHaveBeenCalled();
  });

  it('provides performance insights', async () => {
    const insights = await learningSystem.getPerformanceInsights(mockEVE);
    expect(insights).toHaveProperty('strengths');
    expect(insights).toHaveProperty('areas_for_improvement');
    expect(insights).toHaveProperty('recommended_actions');
  });
});