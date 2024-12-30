import { DatabaseService } from '../../core/database/DatabaseService';
import { Logger } from '../../core/logger/Logger';
import { AppError } from '../../core/error/AppError';
import { validateUUID } from '../../core/validation';

export class TaskQueue {
  private static instance: TaskQueue;
  private db: DatabaseService;
  private logger: Logger;

  private constructor() {
    this.db = DatabaseService.getInstance();
    this.logger = Logger.getInstance();
  }

  public static getInstance(): TaskQueue {
    if (!TaskQueue.instance) {
      TaskQueue.instance = new TaskQueue();
    }
    return TaskQueue.instance;
  }

  async addTask(task: any): Promise<any> {
    try {
      if (!validateUUID(task.assignedTo)) {
        throw new AppError('Invalid EVE ID', 'VALIDATION_ERROR', 400);
      }

      const result = await this.db.query('tasks', {
        ...task,
        id: crypto.randomUUID(),
        status: 'pending',
        created_at: new Date().toISOString()
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to add task:', error);
      throw AppError.fromError(error);
    }
  }

  async getTasks(eveId: string): Promise<any[]> {
    try {
      if (!validateUUID(eveId)) {
        throw new AppError('Invalid EVE ID', 'VALIDATION_ERROR', 400);
      }

      return await this.db.query('tasks', {
        assigned_to: eveId,
        order: 'created_at.desc'
      });
    } catch (error) {
      this.logger.error('Failed to get tasks:', error);
      throw AppError.fromError(error);
    }
  }
}