import React from 'react';
import { EVE } from '../../../../types/eve';

interface EVEModelsProps {
  models: EVE['models'];
}

export function EVEModels({ models }: EVEModelsProps) {
  return (
    <div className="space-y-2">
      {models.map((model, index) => (
        <div
          key={index}
          className="bg-white/5 rounded-lg p-3"
        >
          <div className="text-white font-medium">{model.model}</div>
          <div className="text-sm text-gray-400">{model.purpose}</div>
        </div>
      ))}
    </div>
  );
}