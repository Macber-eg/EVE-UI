import React, { useState } from 'react';
import { useTaskOrchestration } from '../../../hooks/useTaskOrchestration';
import { useCompanyStore } from '../../../store/companyStore';
import { useEVEStore } from '../../../store/eveStore';
import { Task } from '../../../types/task';
import { Brain, Calendar, Clock, AlertTriangle } from 'lucide-react';

export default function TaskCreationForm() {
  const { company } = useCompanyStore();
  const { eves } = useEVEStore();
  const { createTask, loading, error } = useTaskOrchestration(company?.id || '');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    assigned_to: '',
    scheduled_for: '',
    deadline: '',
    metadata: {
      type: 'action' as const,
      estimated_duration: 30,
      max_retries: 3
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;

    try {
      await createTask({
        ...formData,
        created_by: eves[0]?.id || '', // TODO: Use orchestrator EVE
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        assigned_to: '',
        scheduled_for: '',
        deadline: '',
        metadata: {
          type: 'action',
          estimated_duration: 30,
          max_retries: 3
        }
      });
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <div className="flex items-center space-x-2 mb-6">
          <Brain className="h-5 w-5 text-[#72f68e]" />
          <h3 className="text-lg font-medium text-white">Create New Task</h3>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#72f68e]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full h-32 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#72f68e]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#72f68e]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Assign To
              </label>
              <select
                value={formData.assigned_to}
                onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#72f68e]"
                required
              >
                <option value="">Select EVE™</option>
                {eves.map((eve) => (
                  <option key={eve.id} value={eve.id}>
                    {eve.name} ({eve.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-[#72f68e]" />
                  Schedule For
                </div>
              </label>
              <input
                type="datetime-local"
                value={formData.scheduled_for}
                onChange={(e) => setFormData({ ...formData, scheduled_for: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#72f68e]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-[#72f68e]" />
                  Deadline
                </div>
              </label>
              <input
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#72f68e]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Estimated Duration (minutes)
            </label>
            <input
              type="number"
              value={formData.metadata.estimated_duration}
              onChange={(e) => setFormData({
                ...formData,
                metadata: {
                  ...formData.metadata,
                  estimated_duration: parseInt(e.target.value)
                }
              })}
              min="1"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#72f68e]"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#72f68e] text-[#040707] py-2 rounded-lg hover:bg-[#72f68e]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="h-5 w-5 border-2 border-[#040707]/20 border-t-[#040707] rounded-full animate-spin mr-2" />
                Creating Task...
              </>
            ) : (
              'Create Task'
            )}
          </button>
        </div>
      </div>
    </form>
  );
}