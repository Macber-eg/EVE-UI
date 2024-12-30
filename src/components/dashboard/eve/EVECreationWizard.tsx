import { useState } from 'react';
import { Brain, Target, MessageCircle, Shield, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { EVE } from '../../../types/eve';
import { useEVEStore } from '../../../store/eveStore';
import { usePrebuiltEVEs } from '../../../hooks/usePrebuiltEVEs';

interface EVECreationWizardProps {
  onComplete: () => void;
}

export default function EVECreationWizard({ onComplete }: EVECreationWizardProps) {
  const [currentStep, setCurrentStep] = useState<'select' | 'configure' | 'review'>('select');
  const [selectedEVEs, setSelectedEVEs] = useState<Set<string>>(new Set());
  const [configurations, setConfigurations] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getAvailableEVEs, instantiateEVE } = usePrebuiltEVEs();
  const availableEVEs = getAvailableEVEs();

  const handleNext = () => {
    if (currentStep === 'select') setCurrentStep('configure');
    else if (currentStep === 'configure') setCurrentStep('review');
  };

  const handleBack = () => {
    if (currentStep === 'configure') setCurrentStep('select');
    else if (currentStep === 'review') setCurrentStep('configure');
  };

  const handleComplete = async () => {
    setLoading(true);
    setError(null);

    try {
      for (const eveId of selectedEVEs) {
        const eve = availableEVEs.find(e => e.id === eveId);
        if (eve) {
          await instantiateEVE(eve.id, configurations[eve.id] || {});
        }
      }
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create EVEs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8 flex justify-between">
        {['Select EVEs™', 'Configure', 'Review'].map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`
              flex items-center justify-center w-8 h-8 rounded-full
              ${index === ['select', 'configure', 'review'].indexOf(currentStep)
                ? 'bg-[#72f68e] text-[#040707]'
                : 'bg-white/10 text-gray-400'}
            `}>
              {index + 1}
            </div>
            <span className="ml-2 text-sm text-gray-400">{step}</span>
            {index < 2 && (
              <div className="mx-4 h-px w-16 bg-white/10" />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        {currentStep === 'select' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Select Your EVEs™</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableEVEs.map((eve) => (
                <div
                  key={eve.id}
                  className={`
                    p-6 rounded-lg border transition-all cursor-pointer
                    ${selectedEVEs.has(eve.id)
                      ? 'border-[#72f68e] bg-[#72f68e]/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'}
                  `}
                  onClick={() => {
                    const newSelected = new Set(selectedEVEs);
                    if (newSelected.has(eve.id)) {
                      newSelected.delete(eve.id);
                    } else {
                      newSelected.add(eve.id);
                    }
                    setSelectedEVEs(newSelected);
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-[#72f68e]/20 flex items-center justify-center">
                      <Brain className="h-6 w-6 text-[#72f68e]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">{eve.name}</h3>
                      <p className="text-sm text-[#72f68e]">{eve.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-400">{eve.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
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
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 'configure' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Configure Integrations</h2>
            {Array.from(selectedEVEs).map(eveId => {
              const eve = availableEVEs.find(e => e.id === eveId);
              if (!eve) return null;

              return (
                <div key={eve.id} className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-white mb-4">{eve.name}</h3>
                  {eve.required_integrations.map((integration, index) => (
                    <div key={index} className="mb-4">
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        {integration.name}
                        {integration.required && (
                          <span className="text-[#72f68e] ml-1">*</span>
                        )}
                      </label>
                      <input
                        type="text"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#72f68e]"
                        placeholder={`Enter ${integration.name.toLowerCase()} configuration`}
                        onChange={(e) => {
                          setConfigurations(prev => ({
                            ...prev,
                            [eve.id]: {
                              ...prev[eve.id],
                              [integration.type]: e.target.value
                            }
                          }));
                        }}
                      />
                      <p className="mt-1 text-sm text-gray-400">{integration.description}</p>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {currentStep === 'review' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Review Configuration</h2>
            {Array.from(selectedEVEs).map(eveId => {
              const eve = availableEVEs.find(e => e.id === eveId);
              if (!eve) return null;

              return (
                <div key={eve.id} className="bg-white/5 rounded-lg p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-[#72f68e]/20 flex items-center justify-center">
                      <Brain className="h-6 w-6 text-[#72f68e]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">{eve.name}</h3>
                      <p className="text-sm text-[#72f68e]">{eve.role}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-200 mb-2">Capabilities</h4>
                      <div className="flex flex-wrap gap-2">
                        {eve.capabilities.map((capability, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300"
                          >
                            {capability}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-200 mb-2">Configured Integrations</h4>
                      {eve.required_integrations.map((integration, index) => (
                        <div key={index} className="flex items-center justify-between py-2">
                          <span className="text-gray-400">{integration.name}</span>
                          <span className="text-[#72f68e]">
                            {configurations[eve.id]?.[integration.type] ? 'Configured' : 'Not Configured'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          {currentStep !== 'select' && (
            <button
              onClick={handleBack}
              className="px-4 py-2 text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          
          {currentStep === 'review' ? (
            <button
              onClick={handleComplete}
              disabled={loading}
              className="px-6 py-2 bg-[#72f68e] text-[#040707] rounded-lg hover:bg-[#72f68e]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto flex items-center"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 border-2 border-[#040707]/20 border-t-[#040707] rounded-full animate-spin mr-2" />
                  Creating EVEs™...
                </>
              ) : (
                <>
                  Complete Setup
                  <Check className="h-5 w-5 ml-2" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={selectedEVEs.size === 0}
              className="px-6 py-2 bg-[#72f68e] text-[#040707] rounded-lg hover:bg-[#72f68e]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto flex items-center"
            >
              Next
              <ChevronRight className="h-5 w-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}