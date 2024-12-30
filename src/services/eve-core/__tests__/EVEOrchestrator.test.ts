import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EVEOrchestrator } from '../EVEOrchestrator';
import { EVEFactory } from '../EVEFactory';
import { TaskQueueService } from '../../task-queue';

vi.mock('../EVEFactory');
vi.mock('../../task-queue');

describe('EVEOrchestrator', () => {
  let orchestrator: EVEOrchestrator;

  beforeEach(() => {
    vi.clearAllMocks();
    orchestrator = EVEOrchestrator.getInstance();
  });

  it('creates and manages EVE instances', async () => {
    const config = {
      name: 'Test EVE',
      role: 'Test Role',
      type: 'specialist' as const,
      capabilities: ['test'],
      models: [{ provider: 'openai' as const, model: 'gpt-4', purpose: 'test' }]
    };

    const eve = await orchestrator.createEVE('company-123', config);
    expect(EVEFactory.prototype.createEVE).toHaveBeenCalledWith('company-123', config);
    expect(eve).toBeDefined();
  });

  it('assigns tasks to EVEs', async () => {
    const eveId = 'eve-123';
    const task = { description: 'Test task' };

    await orchestrator.assignTask(eveId, task);
    expect(TaskQueueService.prototype.createTask).toHaveBeenCalledWith({
      ...task,
      assignedTo: eveId
    });
  });

  it('broadcasts messages to EVEs', async () => {
    const message = 'Test message';
    await orchestrator.broadcastMessage(message);
    // Verify broadcast functionality
  });

  it('retrieves EVE status', async () => {
    const eveId = 'eve-123';
    const status = await orchestrator.getEVEStatus(eveId);
    expect(status).toHaveProperty('status');
    expect(status).toHaveProperty('performance');
  });

  it('optimizes workload distribution', async () => {
    await orchestrator.optimizeWorkload();
    expect(TaskQueueService.prototype.getPendingTasks).toHaveBeenCalled();
  });

  it('updates EVE capabilities', async () => {
    const eveId = 'eve-123';
    const capabilities = ['new-capability'];
    await orchestrator.updateEVECapabilities(eveId, capabilities);
    // Verify capability update
  });
});