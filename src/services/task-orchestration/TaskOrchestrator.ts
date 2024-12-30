import { Task, TaskPriority } from '../../types/task';
import { EVE } from '../../types/eve';
import { supabase } from '../../lib/supabase';
import { AppError } from '../../utils/error-handling';
import { eveCommunicationService } from '../eve-communication';

export class TaskOrchestrator {
  private static instance: TaskOrchestrator;

  private constructor() {}

  public static getInstance(): TaskOrchestrator {
    if (!TaskOrchestrator.instance) {
      TaskOrchestrator.instance = new TaskOrchestrator();
    }
    return TaskOrchestrator.instance;
  }

  async createTask(
    companyId: string,
    data: Omit<Task, 'id' | 'company_id' | 'status' | 'created_at'>
  ): Promise<Task> {
    try {
      // Validate EVE assignments
      const { data: eve, error: eveError } = await supabase
        .from('eves')
        .select('id, status')
        .eq('id', data.assigned_to)
        .single();

      if (eveError || !eve) {
        throw new Error('Invalid EVE assignment');
      }

      // Create task
      const { data: task, error } = await supabase
        .from('tasks')
        .insert({
          ...data,
          company_id: companyId,
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Notify assigned EVE
      await eveCommunicationService.sendMessage({
        from_eve_id: data.created_by,
        to_eve_id: data.assigned_to,
        content: `New task assigned: ${data.title}`,
        type: 'task',
        priority: data.priority as TaskPriority,
        status: 'sent',
        metadata: {
          task_id: task.id,
          requires_response: true
        }
      });

      return task;
    } catch (error) {
      console.error('Failed to create task:', error);
      throw new AppError('Failed to create task', 'TASK_ERROR', 500);
    }
  }

  async getTask(taskId: string): Promise<Task> {
    try {
      const { data: task, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (error) throw error;
      if (!task) throw new Error('Task not found');

      return task;
    } catch (error) {
      console.error('Failed to get task:', error);
      throw new AppError('Failed to get task', 'TASK_ERROR', 500);
    }
  }

  async updateTaskStatus(
    taskId: string,
    status: Task['status'],
    result?: any,
    error?: string
  ): Promise<void> {
    try {
      const updates: Partial<Task> = { 
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'in_progress') {
        updates.started_at = new Date().toISOString();
      } else if (status === 'completed' || status === 'failed') {
        updates.completed_at = new Date().toISOString();
        if (result) updates.result = result;
        if (error) updates.error = error;
      }

      const { error: updateError } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId);

      if (updateError) throw updateError;

      // Get task details for notification
      const { data: task } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (task) {
        // Notify task creator
        await eveCommunicationService.sendMessage({
          from_eve_id: task.assigned_to,
          to_eve_id: task.created_by,
          content: `Task ${task.title} status updated to ${status}`,
          type: 'status_update',
          priority: task.priority,
          status: 'sent',
          metadata: {
            task_id: taskId,
            task_status: status,
            result,
            error
          }
        });
      }
    } catch (error) {
      console.error('Failed to update task status:', error);
      throw new AppError('Failed to update task status', 'TASK_ERROR', 500);
    }
  }

  async reassignTask(taskId: string, newEveId: string): Promise<void> {
    try {
      // Validate new EVE
      const { data: eve, error: eveError } = await supabase
        .from('eves')
        .select('id, status')
        .eq('id', newEveId)
        .single();

      if (eveError || !eve) {
        throw new Error('Invalid EVE assignment');
      }

      // Get current task
      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (taskError || !task) {
        throw new Error('Task not found');
      }

      // Update assignment
      const { error: updateError } = await supabase
        .from('tasks')
        .update({
          assigned_to: newEveId,
          status: 'pending',
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (updateError) throw updateError;

      // Notify EVEs
      await Promise.all([
        // Notify previous EVE
        eveCommunicationService.sendMessage({
          from_eve_id: task.created_by,
          to_eve_id: task.assigned_to,
          content: `Task ${task.title} has been reassigned`,
          type: 'task',
          priority: task.priority,
          status: 'sent',
          metadata: { task_id: taskId }
        }),
        // Notify new EVE
        eveCommunicationService.sendMessage({
          from_eve_id: task.created_by,
          to_eve_id: newEveId,
          content: `New task assigned: ${task.title}`,
          type: 'task',
          priority: task.priority,
          status: 'sent',
          metadata: {
            task_id: taskId,
            requires_response: true
          }
        })
      ]);
    } catch (error) {
      console.error('Failed to reassign task:', error);
      throw new AppError('Failed to reassign task', 'TASK_ERROR', 500);
    }
  }

  async getTaskQueue(eveId: string): Promise<Task[]> {
    try {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to', eveId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return tasks || [];
    } catch (error) {
      console.error('Failed to get task queue:', error);
      throw new AppError('Failed to get task queue', 'TASK_ERROR', 500);
    }
  }

  async optimizeTaskDistribution(companyId: string): Promise<void> {
    try {
      // Get all company EVEs and their current tasks
      const { data: eves, error: evesError } = await supabase
        .from('eves')
        .select(`
          id,
          type,
          status,
          capabilities,
          performance,
          tasks:tasks(count)
        `)
        .eq('company_id', companyId);

      if (evesError) throw evesError;

      // Get pending tasks
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('company_id', companyId)
        .eq('status', 'pending')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true });

      if (tasksError) throw tasksError;

      // Simple round-robin distribution for now
      // TODO: Implement more sophisticated distribution based on:
      // - EVE capabilities
      // - Current workload
      // - Performance metrics
      // - Task priority and dependencies
      if (tasks && eves) {
        const availableEves = eves.filter(eve => eve.status === 'idle');
        for (let i = 0; i < tasks.length; i++) {
          const task = tasks[i];
          const eve = availableEves[i % availableEves.length];
          if (eve) {
            await this.reassignTask(task.id, eve.id);
          }
        }
      }
    } catch (error) {
      console.error('Failed to optimize task distribution:', error);
      throw new AppError('Failed to optimize task distribution', 'TASK_ERROR', 500);
    }
  }
}

export const taskOrchestrator = TaskOrchestrator.getInstance();