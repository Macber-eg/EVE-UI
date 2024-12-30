import React from 'react';
import { EVE } from '../../../../types/eve';

interface EVEPerformanceProps {
  performance: EVE['performance'];
}

export function EVEPerformance({ performance }: EVEPerformanceProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Efficiency</span>
          <span className="text-[#72f68e]">{performance.efficiency}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#72f68e] rounded-full"
            style={{ width: `${performance.efficiency}%` }}
          />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Accuracy</span>
          <span className="text-[#72f68e]">{performance.accuracy}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#72f68e] rounded-full"
            style={{ width: `${performance.accuracy}%` }}
          />
        </div>
      </div>
    </div>
  );
}