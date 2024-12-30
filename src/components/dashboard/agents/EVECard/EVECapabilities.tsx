import React from 'react';

interface EVECapabilitiesProps {
  capabilities: string[];
}

export function EVECapabilities({ capabilities }: EVECapabilitiesProps) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {capabilities.slice(0, 3).map((capability, index) => (
        <span
          key={index}
          className="text-xs px-2 py-1 rounded-full bg-[#72f68e]/10 text-[#72f68e]"
        >
          {capability}
        </span>
      ))}
      {capabilities.length > 3 && (
        <span className="text-xs px-2 py-1 rounded-full bg-[#72f68e]/10 text-[#72f68e]">
          +{capabilities.length - 3} more
        </span>
      )}
    </div>
  );
}