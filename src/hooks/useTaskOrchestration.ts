import { useState, useCallback } from 'react';
import { Task } from '../types/task';
import { taskOrchestrator } from '../services/task-orchestration/TaskOrchestrator';

export function useTaskOrchestration(companyId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTask = useCallback(async (
    data: Omit<Task, 'id' | 'company_id' | 'status' | 'created_at'>
  ) => {
    setLoading(true);
    setError(null);
    try {
      return await taskOrchestrator.createTask(companyId, data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create task';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const updateTaskStatus = useCallback(async (
    taskId: string,
    status: Task['status'],
    result?: any,
    error?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      await taskOrchestrator.updateTaskStatus(taskId, status, result, error);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update task status';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reassignTask = useCallback(async (
    taskId: string,
    newEveId: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      await taskOrchestrator.reassignTask(taskId, newEveId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reassign task';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const optimizeTaskDistribution = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await taskOrchestrator.optimizeTaskDistribution(companyId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to optimize task distribution';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  return {
    createTask,
    updateTaskStatus,
    reassignTask,
    optimizeTaskDistribution,
    loading,
    error
  };
}