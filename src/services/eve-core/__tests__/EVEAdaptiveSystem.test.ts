import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EVEAdaptiveSystem } from '../EVEAdaptiveSystem';
import { OpenAIService } from '../../../lib/openai';
import { EVELearningSystem } from '../EVELearningSystem';

vi.mock('../../../lib/openai');
vi.mock('../EVELearningSystem');

describe('EVEAdaptiveSystem', () => {
  let adaptiveSystem: EVEAdaptiveSystem;
  let mockEVE: any;

  beforeEach(() => {
    vi.clearAllMocks();
    adaptiveSystem = EVEAdaptiveSystem.getInstance();
    mockEVE = {
      id: 'test-eve',
      name: 'Test EVE',
      models: [],
      performance: {
        efficiency: 0.8,
        accuracy: 0.9,
        tasks_completed: 100
      }
    };
  });

  it('adapts to workload changes', async () => {
    const workloadMetrics = {
      task_volume: 100,
      complexity: 0.7,
      success_rate: 0.85,
      response_times: [100, 150, 200]
    };

    await adaptiveSystem.adaptToWorkload(mockEVE, workloadMetrics);
    expect(OpenAIService.prototype.chat).toHaveBeenCalled();
    expect(mockEVE.performance).toBeDefined();
  });

  it('upgrades models when needed', async () => {
    const workloadMetrics = {
      task_volume: 200,
      complexity: 0.9,
      success_rate: 0.75,
      response_times: [200, 250, 300]
    };

    await adaptiveSystem.adaptToWorkload(mockEVE, workloadMetrics);
    expect(mockEVE.models.length).toBeGreaterThan(0);
  });

  it('generates optimization reports', async () => {
    const report = await adaptiveSystem.getOptimizationReport(mockEVE);
    expect(report).toHaveProperty('current_efficiency');
    expect(report).toHaveProperty('potential_improvements');
    expect(report).toHaveProperty('recommended_changes');
  });
});