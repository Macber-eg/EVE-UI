import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EVEFactory } from '../EVEFactory';
import { OpenAIService } from '../../../lib/openai';
import { KnowledgeBase } from '../../../lib/knowledge-base';

vi.mock('../../../lib/openai');
vi.mock('../../../lib/knowledge-base');

describe('EVEFactory', () => {
  let factory: EVEFactory;

  beforeEach(() => {
    vi.clearAllMocks();
    factory = EVEFactory.getInstance();
  });

  it('creates EVE instances with correct configuration', async () => {
    const config = {
      name: 'Test EVE',
      role: 'Test Role',
      type: 'specialist' as const,
      capabilities: ['test'],
      models: [{ provider: 'openai' as const, model: 'gpt-4', purpose: 'test' }]
    };

    const eve = await factory.createEVE('company-123', config);

    expect(eve).toMatchObject({
      name: config.name,
      role: config.role,
      type: config.type,
      capabilities: config.capabilities,
      status: 'idle',
      performance: {
        efficiency: 0,
        accuracy: 0,
        tasks_completed: 0
      }
    });
  });

  it('initializes EVE knowledge base', async () => {
    const config = {
      name: 'Test EVE',
      role: 'Test Role',
      type: 'specialist' as const,
      capabilities: ['test'],
      models: [{ provider: 'openai' as const, model: 'gpt-4', purpose: 'test' }]
    };

    await factory.createEVE('company-123', config);

    expect(KnowledgeBase.prototype.addDocument).toHaveBeenCalled();
  });

  it('handles message processing', async () => {
    const config = {
      name: 'Test EVE',
      role: 'Test Role',
      type: 'specialist' as const,
      capabilities: ['test'],
      models: [{ provider: 'openai' as const, model: 'gpt-4', purpose: 'test' }]
    };

    const eve = await factory.createEVE('company-123', config);

    // Mock message processing
    const message = {
      content: 'Test message',
      from: 'sender-123'
    };

    await (factory as any).processMessage(eve, message);

    expect(OpenAIService.prototype.chat).toHaveBeenCalled();
  });

  it('handles task processing', async () => {
    const config = {
      name: 'Test EVE',
      role: 'Test Role',
      type: 'specialist' as const,
      capabilities: ['test'],
      models: [{ provider: 'openai' as const, model: 'gpt-4', purpose: 'test' }]
    };

    const eve = await factory.createEVE('company-123', config);

    // Mock task processing
    const task = {
      id: 'task-123',
      description: 'Test task'
    };

    await (factory as any).processTask(eve, task);

    expect(OpenAIService.prototype.chat).toHaveBeenCalled();
    expect(eve.status).toBe('idle');
    expect(eve.performance.tasks_completed).toBe(1);
  });
});