import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { useEVEStore } from '../../../store/eveStore';
import { useCompanyStore } from '../../../store/companyStore';
import { Alert } from '../../common/Alert';

export default function CreateEVEForm({ onComplete }: { onComplete?: () => void }) {
  const navigate = useNavigate();
  const { company } = useCompanyStore();
  const { createEVE, loading, error } = useEVEStore();
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    type: 'specialist' as const,
    capabilities: [] as string[],
    models: [
      {
        provider: 'openai' as const,
        model: 'gpt-4',
        purpose: 'General tasks'
      }
    ]
  });

  const [customCapability, setCustomCapability] = useState('');

  // Redirect if no company exists
  useEffect(() => {
    if (!company) {
      navigate('/setup', { 
        replace: true,
        state: { 
          returnTo: '/dashboard/agents',
          message: 'Please create a company first before creating EVEs™' 
        }
      });
    }
  }, [company, navigate]);

  if (!company) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const eve = await createEVE({
        ...formData,
        status: 'idle',
        performance: {
          efficiency: 0,
          accuracy: 0,
          tasks_completed: 0
        }
      });
      
      if (eve) {
        onComplete?.();
      }
    } catch (err) {
      console.error('Error creating EVE:', err);
    }
  };

  const addCapability = () => {
    if (customCapability.trim()) {
      setFormData(prev => ({
        ...prev,
        capabilities: [...prev.capabilities, customCapability.trim()]
      }));
      setCustomCapability('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <div className="flex items-center space-x-2 mb-6">
          <Brain className="h-5 w-5 text-[#72f68e]" />
          <h3 className="text-lg font-medium text-white">Create New EVE™</h3>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            className="mb-6"
          />
        )}

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
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Role
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#72f68e]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#72f68e]"
            >
              <option value="specialist">Specialist</option>
              <option value="support">Support</option>
              <option value="orchestrator">Orchestrator</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Capabilities
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customCapability}
                onChange={(e) => setCustomCapability(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#72f68e]"
                placeholder="Add capability"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCapability())}
              />
              <button
                type="button"
                onClick={addCapability}
                className="px-4 py-2 bg-[#72f68e]/10 text-[#72f68e] rounded-lg hover:bg-[#72f68e]/20 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.capabilities.map((capability, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#72f68e]/10 text-[#72f68e]"
                >
                  {capability}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      capabilities: prev.capabilities.filter((_, i) => i !== index)
                    }))}
                    className="ml-2 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
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
                Creating EVE™...
              </>
            ) : (
              'Create EVE™'
            )}
          </button>
        </div>
      </div>
    </form>
  );
}