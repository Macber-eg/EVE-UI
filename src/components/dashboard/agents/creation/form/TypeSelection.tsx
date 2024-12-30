
import { EVE } from '../../../../../types/eve';

interface TypeSelectionProps {
  value: EVE['type'];
  onChange: (type: EVE['type']) => void;
}

export function TypeSelection({ value, onChange }: TypeSelectionProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-200 mb-2">
        Type
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as EVE['type'])}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#72f68e]"
      >
        <option value="specialist">Specialist</option>
        <option value="support">Support</option>
        <option value="orchestrator">Orchestrator</option>
      </select>
    </div>
  );
}