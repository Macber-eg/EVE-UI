import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Building2, Key, Brain } from 'lucide-react';
import { useCompanyStore } from '../../store/companyStore';
import { Company } from '../../types/company';
import { LoadingState } from '../common/LoadingState';
import { Alert } from '../common/Alert';

type Step = 'company' | 'api' | 'eves';

export default function CompanySetupFlow() {
  const [currentStep, setCurrentStep] = useState<Step>('company');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { company, createCompany } = useCompanyStore();

  // Handle company creation
  const handleCompanyCreation = async (companyData: Partial<Company>) => {
    setLoading(true);
    setError(null);

    try {
      await createCompany(companyData);
      setCurrentStep('api');
    } catch (err) {
      console.error('Company creation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create company');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    await handleCompanyCreation({
      name: formData.get('name') as string,
      type: formData.get('type') as Company['type'],
      jurisdiction: formData.get('jurisdiction') as string,
      settings: {
        industry: formData.get('industry') as string,
        autonomy_level: formData.get('autonomy_level') as any,
        human_oversight_required: ['financial_decisions', 'legal_matters'],
        notification_preferences: {
          email: true,
          push: true,
          urgency_threshold: 'medium'
        }
      }
    });
  };

  if (loading) {
    return <LoadingState message="Setting up your company..." />;
  }

  return (
    <div className="min-h-screen bg-[#040707] py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-8 flex justify-between">
          {['Company Setup', 'API Configuration', 'EVE™ Creation'].map((step, index) => {
            const stepNum = index + 1;
            const isCurrent = (
              (currentStep === 'company' && stepNum === 1) ||
              (currentStep === 'api' && stepNum === 2) ||
              (currentStep === 'eves' && stepNum === 3)
            );
            const isComplete = (
              (currentStep === 'api' && stepNum === 1) ||
              (currentStep === 'eves' && stepNum <= 2)
            );

            return (
              <div key={step} className="flex flex-col items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${isComplete ? 'bg-[#72f68e] text-[#040707]' :
                    isCurrent ? 'bg-[#72f68e]/20 text-[#72f68e]' :
                    'bg-white/5 text-gray-400'}
                `}>
                  {stepNum}
                </div>
                <span className={`
                  mt-2 text-sm
                  ${isCurrent ? 'text-[#72f68e]' :
                    isComplete ? 'text-white' : 'text-gray-400'}
                `}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* Company Creation Form */}
        {currentStep === 'company' && !company && (
          <div className="bg-white/5 rounded-lg p-8 border border-white/10">
            <div className="flex items-center space-x-3 mb-6">
              <Building2 className="h-6 w-6 text-[#72f68e]" />
              <h2 className="text-xl font-semibold text-white">Company Information</h2>
            </div>

            {error && (
              <Alert
                type="error"
                message={error}
                className="mb-6"
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#72f68e]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Company Type
                </label>
                <select
                  name="type"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#72f68e]"
                  required
                >
                  <option value="corporation">Corporation</option>
                  <option value="llc">LLC</option>
                  <option value="nonprofit">Non-Profit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Jurisdiction
                </label>
                <input
                  type="text"
                  name="jurisdiction"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#72f68e]"
                  placeholder="e.g., Delaware, USA"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Industry
                </label>
                <input
                  type="text"
                  name="industry"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#72f68e]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Autonomy Level
                </label>
                <select
                  name="autonomy_level"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#72f68e]"
                  required
                >
                  <option value="low">Low - High Human Oversight</option>
                  <option value="medium">Medium - Balanced Automation</option>
                  <option value="high">High - Minimal Human Oversight</option>
                  <option value="full">Full - Complete Automation</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#72f68e] text-[#040707] py-3 rounded-lg hover:bg-[#72f68e]/90 transition-colors"
              >
                Create Company
              </button>
            </form>
          </div>
        )}

        {/* API Configuration */}
        {currentStep === 'api' && (
          <div className="bg-white/5 rounded-lg p-8 border border-white/10">
            <div className="flex items-center space-x-3 mb-6">
              <Key className="h-6 w-6 text-[#72f68e]" />
              <h2 className="text-xl font-semibold text-white">API Configuration</h2>
            </div>

            <div className="mb-6">
              <div className="bg-[#72f68e]/10 border border-[#72f68e]/20 rounded-lg p-4">
                <h3 className="text-[#72f68e] font-medium mb-2">Use Platform API Keys</h3>
                <p className="text-sm text-gray-400">
                  You can use our API keys for a 2x markup on usage costs, or provide your own keys for direct pricing.
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep('eves')}
              className="w-full bg-[#72f68e] text-[#040707] py-3 rounded-lg hover:bg-[#72f68e]/90 transition-colors"
            >
              Continue with Platform API Keys
            </button>
          </div>
        )}

        {/* EVE Creation */}
        {currentStep === 'eves' && (
          <div className="bg-white/5 rounded-lg p-8 border border-white/10">
            <div className="flex items-center space-x-3 mb-6">
              <Brain className="h-6 w-6 text-[#72f68e]" />
              <h2 className="text-xl font-semibold text-white">Setup Complete</h2>
            </div>

            <div className="mb-6">
              <p className="text-gray-400">
                Your company is set up and ready to go. Let's create your first EVE™!
              </p>
            </div>

            <button
              onClick={() => {
                const returnTo = (location.state as any)?.returnTo || '/dashboard/agents';
                navigate(returnTo);
              }}
              className="w-full bg-[#72f68e] text-[#040707] py-3 rounded-lg hover:bg-[#72f68e]/90 transition-colors"
            >
              Go to EVE™ Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}