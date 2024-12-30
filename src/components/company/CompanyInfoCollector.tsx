import { useState } from 'react';
import { Brain, AlertTriangle } from 'lucide-react';
import { useCompanyStore } from '../../store/companyStore';
import { companyAnalyzerService } from '../../services/company-analyzer';
import { LoadingState } from '../common/LoadingState';
import { Alert } from '../common/Alert';

interface CompanyInfoCollectorProps {
  onComplete: () => void;
}

export default function CompanyInfoCollector({ onComplete }: CompanyInfoCollectorProps) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createCompany } = useCompanyStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (description.length < 50) {
        throw new Error('Please provide a more detailed description of your company');
      }

      // Log the input description
      console.debug('Analyzing company description:', description);

      // Analyze company description
      const companyData = await companyAnalyzerService.analyzeDescription(description);
      
      // Log the analyzed data
      console.debug('Analyzed Company Data:', companyData);

      // Create company in database
      await createCompany(companyData);

      console.debug('Company created successfully');
      onComplete();
    } catch (err) {
      console.error('Error processing company info:', err);
      setError(err instanceof Error ? err.message : 'Failed to process company information');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState message="Processing company information..." />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">Tell Us About Your Company</h2>
        <p className="text-gray-400 mt-2">
          Describe your company and its goals. Our AI will analyze your description to optimize your EVE™ configuration.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <div className="flex items-center space-x-2 mb-4">
            <Brain className="h-5 w-5 text-[#72f68e]" />
            <span className="text-sm font-medium text-white">Company Description</span>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-40 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#72f68e]"
            placeholder="Describe your company, its mission, industry, and any other relevant details that will help us configure your EVE™ workforce optimally..."
            required
          />
          <p className="mt-2 text-sm text-gray-400">
            Include details about your industry, target market, operational needs, and automation preferences.
          </p>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError(null)}
          />
        )}

        <button
          type="submit"
          className="w-full bg-[#72f68e] text-[#040707] py-3 rounded-lg hover:bg-[#72f68e]/90 transition-colors flex items-center justify-center"
        >
          Analyze Company Information
        </button>
      </form>
    </div>
  );
}