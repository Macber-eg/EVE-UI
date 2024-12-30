import { EVE } from '../../types/eve';
import { EVEFactory } from './EVEFactory';
import { TaskQueueService } from '../task-queue';
import { EVECommunicationService } from '../eve-communication';
import { KnowledgeBase } from '../../lib/knowledge-base';

export class EVEOrchestrator {
  private static instance: EVEOrchestrator;
  private factory: EVEFactory;
  private taskQueue: TaskQueueService;
  private communicationService: EVECommunicationService;
  private knowledgeBase: KnowledgeBase;
  private activeEVEs: Map<string, EVE> = new Map();

  private constructor() {
    this.factory = EVEFactory.getInstance();
    this.taskQueue = TaskQueueService.getInstance();
    this.communicationService = new EVECommunicationService();
    this.knowledgeBase = KnowledgeBase.getInstance();
  }

  public static getInstance(): EVEOrchestrator {
    if (!EVEOrchestrator.instance) {
      EVEOrchestrator.instance = new EVEOrchestrator();
    }
    return EVEOrchestrator.instance;
  }

  public async createEVE(
    companyId: string,
    config: {
      name: string;
      role: string;
      type: EVE['type'];
      capabilities: string[];
      models: EVE['models'];
    }
  ): Promise<EVE> {
    const eve = await this.factory.createEVE(companyId, config);
    this.activeEVEs.set(eve.id, eve);
    return eve;
  }

  public async assignTask(eveId: string, task: any): Promise<void> {
    const eve = this.activeEVEs.get(eveId);
    if (!eve) {
      throw new Error(`EVE ${eveId} not found`);
    }

    await this.taskQueue.createTask({
      ...task,
      assignedTo: eveId
    });
  }

  public async broadcastMessage(
    message: string,
    filter?: (eve: EVE) => boolean
  ): Promise<void> {
    const targetEVEs = Array.from(this.activeEVEs.values())
      .filter(filter || (() => true));

    await Promise.all(
      targetEVEs.map(eve =>
        this.communicationService.sendMessage(
          { id: 'orchestrator', name: 'Orchestrator' } as EVE,
          eve,
          message
        )
      )
    );
  }

  public async getEVEStatus(eveId: string): Promise<{
    status: EVE['status'];
    performance: EVE['performance'];
    currentTask?: any;
  }> {
    const eve = this.activeEVEs.get(eveId);
    if (!eve) {
      throw new Error(`EVE ${eveId} not found`);
    }

    const currentTask = await this.taskQueue.getCurrentTask(eveId);

    return {
      status: eve.status,
      performance: eve.performance,
      currentTask
    };
  }

  public async optimizeWorkload(): Promise<void> {
    const eves = Array.from(this.activeEVEs.values());
    const tasks = await this.taskQueue.getPendingTasks();

    // Simple round-robin task distribution
    for (let i = 0; i < tasks.length; i++) {
      const eve = eves[i % eves.length];
      await this.assignTask(eve.id, tasks[i]);
    }
  }

  public async updateEVECapabilities(
    eveId: string,
    capabilities: string[]
  ): Promise<void> {
    const eve = this.activeEVEs.get(eveId);
    if (!eve) {
      throw new Error(`EVE ${eveId} not found`);
    }

    eve.capabilities = capabilities;
    await this.knowledgeBase.updateDocument(
      eveId,
      JSON.stringify({
        eve_id: eve.id,
        name: eve.name,
        role: eve.role,
        capabilities: eve.capabilities,
        type: 'eve_configuration'
      })
    );
  }
}