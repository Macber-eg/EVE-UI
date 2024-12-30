import { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface CapabilityInputProps {
  capabilities: string[];
  onAdd: (capability: string) => void;
  onRemove: (index: number) => void;
}

export function CapabilityInput({ capabilities, onAdd, onRemove }: CapabilityInputProps) {
  const [customCapability, setCustomCapability] = useState('');

  const handleAdd = () => {
    if (customCapability.trim()) {
      onAdd(customCapability.trim());
      setCustomCapability('');
    }
  };

  return (
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
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-[#72f68e]/10 text-[#72f68e] rounded-lg hover:bg-[#72f68e]/20 transition-colors"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {capabilities.map((capability, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#72f68e]/10 text-[#72f68e]"
          >
            {capability}
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="ml-2 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}