import React from 'react';
import { Brain, Target, MessageCircle, Shield, Banknote } from 'lucide-react';
import { useSubscriptionStore } from '../../../store/subscriptionStore';
import { prebuiltEVEService } from '../../../services/prebuilt-eves';
import { Button } from '../../common/Button';

export default function PrebuiltEVEList({ onSelect }: { onSelect: (eveId: string) => void }) {
  const { subscription } = useSubscriptionStore();
  const availableEVEs = subscription ? prebuiltEVEService.getAvailableEVEs(subscription) : [];

  const getIcon = (category: string) => {
    switch (category) {
      case 'strategy':
        return Brain;
      case 'communication':
        return MessageCircle;
      case 'social':
        return Target;
      case 'finance':
        return Banknote;
      default:
        return Shield;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {availableEVEs.map((eve) => {
        const Icon = getIcon(eve.category);
        
        return (
          <div
            key={eve.id}
            className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#72f68e]/20 p-2.5">
                <Icon className="w-full h-full text-[#72f68e]" />
              </div>
              <div>
                <h4 className="text-white font-semibold">{eve.name}</h4>
                <p className="text-sm text-[#72f68e]">{eve.role}</p>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm mb-4">{eve.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {eve.capabilities.slice(0, 3).map((capability, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300"
                >
                  {capability}
                </span>
              ))}
              {eve.capabilities.length > 3 && (
                <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300">
                  +{eve.capabilities.length - 3} more
                </span>
              )}
            </div>

            <div className="space-y-2 mb-4">
              {eve.models.map((model, index) => (
                <div
                  key={index}
                  className="text-xs bg-white/5 rounded-lg p-2 flex justify-between"
                >
                  <span className="text-white">{model.model}</span>
                  <span className="text-gray-400">{model.purpose}</span>
                </div>
              ))}
            </div>

            <Button
              onClick={() => onSelect(eve.id)}
              fullWidth
              className="mt-4"
            >
              Create {eve.name}
            </Button>
          </div>
        );
      })}
    </div>
  );
}