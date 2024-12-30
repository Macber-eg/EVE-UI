
import { Activity, Clock } from 'lucide-react';
import { EVE } from '../../../../types/eve';

interface EVEMetricsProps {
  performance: EVE['performance'];
}

export function EVEMetrics({ performance }: EVEMetricsProps) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4">
      <div className="flex items-center space-x-2">
        <Activity className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-300">
          {performance.tasks_completed} Tasks
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-300">
          {performance.efficiency}% Efficiency
        </span>
      </div>
    </div>
  );
}