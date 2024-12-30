
import { Brain, Activity, Clock, Target } from 'lucide-react';
import { EVE } from '../../../types/eve';
import EVECommunicationPanel from './EVECommunicationPanel';

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
            ×
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Left Panel - Stats & Info */}
          <div className="w-1/3 border-r border-white/10 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Performance Metrics */}
              <div>
                <h3 className="text-white font-medium mb-4">Performance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Efficiency</span>
                      <span className="text-[#72f68e]">{eve.performance.efficiency}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#72f68e] rounded-full"
                        style={{ width: `${eve.performance.efficiency}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Accuracy</span>
                      <span className="text-[#72f68e]">{eve.performance.accuracy}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#72f68e] rounded-full"
                        style={{ width: `${eve.performance.accuracy}%` }}
                      />
                    </div>
                  </div>
                </div>
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
                <div className="space-y-2">
                  {eve.models.map((model, index) => (
                    <div
                      key={index}
                      className="bg-white/5 rounded-lg p-3"
                    >
                      <div className="text-white font-medium">{model.model}</div>
                      <div className="text-sm text-gray-400">{model.purpose}</div>
                    </div>
                  ))}
                </div>
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