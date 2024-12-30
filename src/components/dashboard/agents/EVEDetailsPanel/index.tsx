import React from 'react';
import { X, Brain } from 'lucide-react';
import { EVE } from '../../../../types/eve';
import { EVEPerformance } from './EVEPerformance';
import { EVEModels } from './EVEModels';
import EVECommunicationPanel from '../EVECommunicationPanel';

interface EVEDetailsPanelProps {
  eve: EVE;
  onClose: () => void;
}

export default function EVEDetailsPanel({ eve, onClose }: EVEDetailsPanelProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#040707]/95 rounded-lg w-full max-w-6xl m-4 border border-white/10 flex flex-col h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-[#72f68e]/20 flex items-center justify-center">
              <Brain className="h-6 w-6 text-[#72f68e]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{eve.name}</h2>
              <p className="text-sm text-[#72f68e]">{eve.role}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Left Panel - Stats & Info */}
          <div className="w-1/3 border-r border-white/10 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Performance Metrics */}
              <div>
                <h3 className="text-white font-medium mb-4">Performance</h3>
                <EVEPerformance performance={eve.performance} />
              </div>

              {/* Capabilities */}
              <div>
                <h3 className="text-white font-medium mb-4">Capabilities</h3>
                <div className="flex flex-wrap gap-2">
                  {eve.capabilities.map((capability, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-sm bg-[#72f68e]/10 text-[#72f68e]"
                    >
                      {capability}
                    </span>
                  ))}
                </div>
              </div>

              {/* Models */}
              <div>
                <h3 className="text-white font-medium mb-4">AI Models</h3>
                <EVEModels models={eve.models} />
              </div>
            </div>
          </div>

          {/* Right Panel - Communication */}
          <div className="flex-1 flex flex-col">
            <EVECommunicationPanel eve={eve} className="flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
}