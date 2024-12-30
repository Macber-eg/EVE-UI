import { EVE } from '../../types/eve';
import { OpenAIService } from '../../lib/openai';
import { KnowledgeBase } from '../../lib/knowledge-base';
import { EVECommunicationService } from '../eve-communication';
import { TaskQueueService } from '../task-queue';

export class EVEFactory {
  private static instance: EVEFactory;
  private openai: OpenAIService;
  private knowledgeBase: KnowledgeBase;
  private communicationService: EVECommunicationService;
  private taskQueue: TaskQueueService;

  private constructor() {
    this.openai = OpenAIService.getInstance();
    this.knowledgeBase = KnowledgeBase.getInstance();
    this.communicationService = new EVECommunicationService();
    this.taskQueue = TaskQueueService.getInstance();
  }

  public static getInstance(): EVEFactory {
    if (!EVEFactory.instance) {
      EVEFactory.instance = new EVEFactory();
    }
    return EVEFactory.instance;
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
    // Create EVE instance
    const eve: EVE = {
      id: crypto.randomUUID(),
      name: config.name,
      role: config.role,
      status: 'idle',
      type: config.type,
      capabilities: config.capabilities,
      performance: {
        efficiency: 0,
        accuracy: 0,
        tasks_completed: 0
      },
      models: config.models
    };

    // Initialize EVE's knowledge base
    await this.initializeKnowledge(eve);

    // Set up communication channels
    await this.setupCommunication(eve);

    // Configure task processing
    await this.setupTaskProcessing(eve);

    return eve;
  }

  private async initializeKnowledge(eve: EVE) {
    // Add base knowledge about EVE's role and capabilities
    await this.knowledgeBase.addDocument(
      JSON.stringify({
        eve_id: eve.id,
        name: eve.name,
        role: eve.role,
        capabilities: eve.capabilities,
        type: 'eve_configuration'
      }),
      {
        type: 'eve_knowledge',
        eve_id: eve.id
      }
    );
  }

  private async setupCommunication(eve: EVE) {
    // Register message handlers
    this.communicationService.registerMessageHandler(eve.id, async (message) => {
      // Process incoming messages
      await this.processMessage(eve, message);
    });
  }

  private async setupTaskProcessing(eve: EVE) {
    // Set up task queue processing
    this.taskQueue.onTaskAdded(async (task) => {
      if (task.assignedTo === eve.id) {
        await this.processTask(eve, task);
      }
    });
  }

  private async processMessage(eve: EVE, message: any) {
    try {
      // Process message based on EVE's capabilities
      const response = await this.openai.chat([
        {
          role: 'system',
          content: `You are ${eve.name}, a ${eve.role}. Your capabilities include: ${eve.capabilities.join(', ')}`
        },
        {
          role: 'user',
          content: message.content
        }
      ]);

      // Send response
      await this.communicationService.sendMessage(
        eve,
        message.from,
        response
      );
    } catch (error) {
      console.error(`Error processing message for EVE ${eve.id}:`, error);
    }
  }

  private async processTask(eve: EVE, task: any) {
    try {
      // Update EVE status
      eve.status = 'busy';

      // Process task based on EVE's capabilities
      const result = await this.openai.chat([
        {
          role: 'system',
          content: `You are ${eve.name}, a ${eve.role}. Your capabilities include: ${eve.capabilities.join(', ')}`
        },
        {
          role: 'user',
          content: `Task: ${task.description}`
        }
      ]);

      // Update task status
      await this.taskQueue.updateTaskStatus(task.id, 'completed', result);

      // Update EVE status
      eve.status = 'idle';
      eve.performance.tasks_completed++;
    } catch (error) {
      console.error(`Error processing task for EVE ${eve.id}:`, error);
      await this.taskQueue.updateTaskStatus(task.id, 'failed', error.message);
      eve.status = 'idle';
    }
  }
}