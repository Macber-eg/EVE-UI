import React from 'react';
import { Plus } from 'lucide-react';
import { EVE } from '../../../../types/eve';
import { EVEHeader } from './EVEHeader';
import { EVECapabilities } from './EVECapabilities';
import { EVEMetrics } from './EVEMetrics';

interface EVECardProps {
  eve: EVE;
  onClick: () => void;
  isOrchestrator?: boolean;
}

export default function EVECard({ eve, onClick, isOrchestrator = false }: EVECardProps) {
  return (
    <div className={`bg-[#040707]/30 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:bg-[#040707]/40 transition-all duration-300 ${
      isOrchestrator ? 'ring-2 ring-[#72f68e]/20' : ''
    }`}>
      <div className="flex items-start justify-between">
        <EVEHeader eve={eve} isOrchestrator={isOrchestrator} />
      </div>

      <EVECapabilities capabilities={eve.capabilities} />
      <EVEMetrics performance={eve.performance} />

      <button
        onClick={onClick}
        className="mt-6 w-full bg-[#72f68e]/10 text-[#72f68e] hover:bg-[#72f68e]/20 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
      >
        <Plus className="h-4 w-4 mr-2" />
        View Details
      </button>
    </div>
  );
}