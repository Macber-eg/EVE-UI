import React from 'react';
import { Brain, Zap } from 'lucide-react';
import { EVE } from '../../../../types/eve';

interface EVEHeaderProps {
  eve: EVE;
  isOrchestrator?: boolean;
}

export function EVEHeader({ eve, isOrchestrator }: EVEHeaderProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <div className={`h-12 w-12 rounded-lg ${
          isOrchestrator ? 'bg-[#72f68e]/30' : 'bg-[#72f68e]/20'
        } flex items-center justify-center`}>
          {isOrchestrator ? (
            <Zap className="h-6 w-6 text-[#72f68e]" />
          ) : (
            <Brain className="h-6 w-6 text-[#72f68e]" />
          )}
        </div>
        <span
          className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#040707] ${
            eve.status === 'active' ? 'bg-[#72f68e]' :
            eve.status === 'busy' ? 'bg-purple-500' :
            'bg-yellow-500'
          }`}
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white">{eve.name}</h3>
        <p className="text-sm text-[#72f68e]">{eve.role}</p>
      </div>
    </div>
  );
}