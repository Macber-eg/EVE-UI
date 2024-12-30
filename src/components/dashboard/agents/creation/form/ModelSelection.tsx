import React from 'react';
import { EVE } from '../../../../../types/eve';

interface ModelSelectionProps {
  type: EVE['type'];
  onChange: (models: EVE['models']) => void;
}

const modelOptions = {
  orchestrator: [
    { provider: 'openai', model: 'gpt-4-turbo', purpose: 'Complex Decision Making' },
    { provider: 'anthropic', model: 'claude-3-opus', purpose: 'Strategic Analysis' }
  ],
  specialist: [
    { provider: 'openai', model: 'gpt-4', purpose: 'Task Execution' },
    { provider: 'anthropic', model: 'claude-3-sonnet', purpose: 'Domain Processing' }
  ],
  support: [
    { provider: 'openai', model: 'gpt-3.5-turbo', purpose: 'Basic Tasks' },
    { provider: 'anthropic', model: 'claude-3-haiku', purpose: 'Support Functions' }
  ]
};

export function ModelSelection({ type, onChange }: ModelSelectionProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-200 mb-2">
        AI Models
      </label>
      <div className="space-y-2">
        {modelOptions[type].map((model, index) => (
          <label
            key={`${model.provider}-${model.model}`}
            className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <input
              type="checkbox"
              className="rounded border-white/10 text-[#72f68e] focus:ring-[#72f68e]"
            />
            <div>
              <div className="text-white font-medium">{model.model}</div>
              <div className="text-sm text-gray-400">{model.purpose}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}