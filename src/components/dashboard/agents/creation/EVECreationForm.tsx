import React, { useState } from 'react';
import { Brain, Target, MessageCircle, Shield } from 'lucide-react';
import { useEVEStore } from '../../../../store/eveStore';
import { EVE } from '../../../../types/eve';
import { CapabilityInput } from './form/CapabilityInput';
import { ModelSelection } from './form/ModelSelection';
import { RoleInput } from './form/RoleInput';
import { TypeSelection } from './form/TypeSelection';

export function EVECreationForm() {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    type: 'specialist' as EVE['type'],
    capabilities: [] as string[],
    customCapability: ''
  });

  const { createEVE, loading, error } = useEVEStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createEVE({
        name: formData.name,
        role: formData.role,
        type: formData.type,
        status: 'idle',
        capabilities: formData.capabilities,
        performance: {
          efficiency: 0,
          accuracy: 0,
          tasks_completed: 0
        },
        models: []
      });
    } catch (err) {
      console.error('Error creating EVE:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h3 className="text-lg font-medium text-white mb-6">Create New EVE™</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              EVE™ Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#72f68e]"
              placeholder="Enter EVE name"
              required
            />
          </div>

          <RoleInput
            value={formData.role}
            onChange={(role) => setFormData({ ...formData, role })}
          />

          <TypeSelection
            value={formData.type}
            onChange={(type) => setFormData({ ...formData, type })}
          />

          <CapabilityInput
            capabilities={formData.capabilities}
            onAdd={(capability) => setFormData(prev => ({
              ...prev,
              capabilities: [...prev.capabilities, capability]
            }))}
            onRemove={(index) => setFormData(prev => ({
              ...prev,
              capabilities: prev.capabilities.filter((_, i) => i !== index)
            }))}
          />

          <ModelSelection
            type={formData.type}
            onChange={() => {}} // Will be implemented in next iteration
          />
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-[#72f68e] text-[#040707] rounded-lg hover:bg-[#72f68e]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create EVE™'}
          </button>
        </div>
      </div>
    </form>
  );
}